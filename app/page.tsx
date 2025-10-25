"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { easeOut } from "framer-motion";

export default function Home() {
  const [topic, setTopic] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    try {
      console.log("Generating quiz for topic:", topic);

      const res = await fetch("/api/createQuiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Generated quiz:", data.quiz);
        // You can now store it in state and render
      } else {
        console.error("API error:", data.error);
      }
    } catch (err) {
      console.error("Failed to generate quiz:", err);
    }
  };

  // 👇 Parent & child variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // time between child animations
        delayChildren: 0.2, // delay before first child starts
      },
    },
  };

  const item = {
    hidden: { opacity: 0, filter: "blur(12px)", y: 20 },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { duration: 0.8, ease: easeOut },
    },
  };

  return (
    <main className="relative min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-gray-800 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.2),transparent_90%)] animate-pulse-slow" />

      {/* 👇 Animate everything as children */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center"
      >
        <motion.img
          variants={item}
          src="/logo.png"
          alt="AI Quiz Generator Logo"
          className="mb-6 drop-shadow-lg"
        />

        <motion.h1
          variants={item}
          className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4"
        >
          Generate AI Quizzes on <br />
          <span className="text-indigo-400">Any Topic Instantly</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-gray-400 max-w-lg mb-8 text-lg"
        >
          Type any topic — from physics to football — and our AI will craft a
          personalized quiz just for you.
        </motion.p>

        <motion.div
          variants={item}
          className="flex w-full max-w-md bg-gray-900/60 border border-gray-700 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md"
        >
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic (e.g. World War II)"
            className="flex-1 px-4 py-3 bg-transparent text-white focus:outline-none placeholder-gray-500"
          />
          <button
            onClick={handleGenerate}
            className="bg-indigo-500 hover:bg-indigo-600 px-5 flex items-center gap-2 transition-colors"
          >
            <span className="font-medium">Generate</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        <motion.p variants={item} className="text-gray-500 text-sm mt-10">
          Powered by <span className="text-indigo-400 font-medium">OpenAI</span>{" "}
          🚀
        </motion.p>
      </motion.div>

      {/* Background pulse animation */}
      <style jsx global>{`
        @keyframes pulseSlow {
          0%,
          100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
          }
        }
        .animate-pulse-slow {
          animation: pulseSlow 3s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
