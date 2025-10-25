import { GoogleGenAI, Type } from "@google/genai";

// Make sure your API key is in .env.local as GENAI_API_KEY
const ai = new GoogleGenAI({
  apiKey: process.env.GENAI_API_KEY,
});

async function createQuiz(topic) {
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
    const { topic } = await request.json();

    if (!topic || !topic.trim()) {
      return new Response(JSON.stringify({ error: "Topic is required" }), {
        status: 400,
      });
    }

    const quiz = await createQuiz(topic);

    return new Response(JSON.stringify({ quiz }), {
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
