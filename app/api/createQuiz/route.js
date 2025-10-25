import { GoogleGenAI, Type } from "@google/genai";
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ai = new GoogleGenAI({
  apiKey: process.env.GENAI_API_KEY,
});

async function createQuiz(topic, roomId) {
  if (!topic || !topic.trim()) throw new Error("Topic is required");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Create a short multiple-choice quiz with 10 questions on the topic of ${topic}.
Each question should have 4 options, specify the correct answer index (0-based), and provide a hint.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            answer: { type: Type.NUMBER },
            hint: { type: Type.STRING },
          },
          propertyOrdering: ["question", "options", "answer", "hint"],
        },
      },
    },
  });

  try {
    const quiz = JSON.parse(response.text);
    return quiz;
  } catch (err) {
    console.error("Failed to parse quiz response:", err);
    return [];
  }
}

export async function POST(request) {
  try {
    const { topic, roomId } = await request.json();
    const roomKey = `room:${roomId}`;
    const roomJSON = await redis.get(roomKey);

    if (!roomJSON) {
      return new Response(JSON.stringify({ error: "Room not found" }), {
        status: 404,
      });
    }

    const newQuiz = await createQuiz(topic, roomId);

    roomJSON.quiz = newQuiz;
    await redis.set(roomKey, JSON.stringify(roomJSON));

    console.log("Updated room in Redis:", roomId);

    return new Response("Success", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error generating quiz:", err);
    return new Response(JSON.stringify({ error: "Failed to generate quiz" }), {
      status: 500,
    });
  }
}
