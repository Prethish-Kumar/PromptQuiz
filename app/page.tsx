"use client";
import { motion } from "framer-motion";
import { ArrowRight, Plus, LogIn } from "lucide-react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
const URL = process.env.PUBLIC_SOCKET_URL || "http://localhost:4000";
const socket = io(URL);

export default function Home() {
  const router = useRouter();

  const [joinOpen, setJoinOpen] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState("");

  function getRandomFunnyName() {
    const funnyNames = [
      "Quantum Potato",
      "Disco Duckling",
      "Toaster Wizard",
      "Angry Mango",
      "Sassy Turtle",
      "Banana Overlord",
      "Captain Obvious",
      "Ninja Pancake",
      "Waffle Ninja",
      "Lazy Comet",
      "Sir Licks A Lot",
      "Spicy Cloud",
      "Emotional Support Cactus",
      "Bureaucratic Sloth",
      "Unstable Unicorn",
      "Keyboard Samurai",
      "Hyperactive Marshmallow",
      "Caffeinated Koala",
      "Suspicious Muffin",
      "Dumpster Philosopher",
    ];

    const randomIndex = Math.floor(Math.random() * funnyNames.length);
    return funnyNames[randomIndex];
  }

  function getRandomAvatar() {
    const avatars = [
      "bear",
      "elephant",
      "ghost",
      "hen",
      "horse",
      "rabbit",
      "sea-lion",
      "shark",
      "sloth",
      "tiger",
    ];

    const randomIndex = Math.floor(Math.random() * avatars.length);
    return avatars[randomIndex];
  }

  if (localStorage.getItem("guestId") === null) {
    localStorage.setItem("guestId", Math.random().toString(36).substr(2, 9));
    localStorage.setItem("guestName", getRandomFunnyName());
    localStorage.setItem("guestAvatar", getRandomAvatar());
  }

  const handleCreateRoom = () => {
    const roomId = Math.random().toString(36).substr(2, 9);
    socket.emit("create_room", {
      hostId: localStorage.getItem("guestId"),
      hostName: localStorage.getItem("guestName"),
      hostAvatar: localStorage.getItem("guestAvatar"),
      roomId: roomId,
    });
    localStorage.setItem("lastRoomId", roomId);
    router.push(`/room/${roomId}`);
  };

  const handleJoinRoom = (joinRoomId) => {
    router.push(`/room/${joinRoomId}`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, filter: "blur(12px)", y: 20 },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.2),transparent_90%)] animate-pulse-slow" />

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
          Any Topic. Instant Fun!
        </motion.h1>

        <motion.p
          variants={item}
          className="text-gray-400 max-w-lg mb-8 text-lg"
        >
          Never run out of challenges. Create, play, and repeat!
        </motion.p>

        {/* Buttons */}
        <motion.div variants={item} className="flex gap-4">
          <button
            onClick={handleCreateRoom}
            className="flex items-center gap-2  bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition"
          >
            <Plus className="w-5 h-5" /> Create Room
          </button>

          <button
            onClick={() => setJoinOpen(true)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition"
          >
            <LogIn className="w-5 h-5" /> Join Room
          </button>
        </motion.div>
      </motion.div>

      <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
        <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg text-indigo-400 mb-2">
              Join a Room
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value)}
              placeholder="Enter Room ID"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-end">
              <button
                onClick={() => {
                  handleJoinRoom(joinRoomId);
                  setJoinOpen(false);
                }}
                className="bg-indigo-500 hover:bg-indigo-600 px-6 py-2 rounded-lg font-medium"
              >
                Join
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
