"use client";
import { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Edit2, Check, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

const URL = process.env.PUBLIC_SOCKET_URL || "http://localhost:4000";
const socket = io(URL);

// Example avatars
const avatarList = [
  "/avatars/horse.png",
  "/avatars/bear.png",
  "/avatars/sea-lion.png",
  "/avatars/elephant.png",
  "/avatars/tiger.png",
  "/avatars/rabbit.png",
];

interface Player {
  id: string;
  name: string;
  avatar: string;
}

interface RoomPageProps {
  params: {
    roomId: string;
  };
}

export default function RoomPage({ params }: RoomPageProps) {
  const router = useRouter();
  const { roomId }: { roomId: string } = use(params);
  const guestId = localStorage.getItem("guestId");
  const guestName = localStorage.getItem("guestName");
  const guestAvatar = localStorage.getItem("guestAvatar");
  useEffect(() => {
    if (!guestId) {
      router.push("/");
    } else {
      socket.emit("join_room", {
        roomId: roomId,
        guestId: guestId,
      });
    }
  }, [router]);

  const [players, setPlayers] = useState<Player[]>([]);
  const [name, setName] = useState(localStorage.getItem("guestName"));
  const [avatar, setAvatar] = useState(
    "/avatars/" + localStorage.getItem("guestAvatar") + ".png"
  );
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [roomReady, setRoomReady] = useState(false);
  const loadingPhrases = [
    "Preparing your quiz",
    "Sending sloths to find questions...",
    "Sharpening pencils...",
    "Counting brain cells...",
    "Almost ready!",
  ];

  const [loadingText, setLoadingText] = useState(loadingPhrases[0]);

  useEffect(() => {
    // Join the room
    socket.emit("join_room", roomId, guestId, guestName, guestAvatar);

    // Listen for full room data from server
    socket.on("room_data", (room) => {
      // Filter out the current user
      const otherPlayers = room.players.filter(
        (player: any) => player.id !== guestId
      );

      setPlayers(otherPlayers);
    });

    // Listen for new players joining
    socket.on("player_joined", (player) => {
      setPlayers((prev) => [...prev, player]);
    });

    // Listen for players leaving
    socket.on("player_left", ({ id }) => {
      setPlayers((prev) => prev.filter((p) => p.id !== id));
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("room_data");
      socket.off("player_joined");
      socket.off("player_left");
    };
  }, [roomId, guestId]);
  const startQuizGeneration = () => {
    if (!topic.trim()) return alert("Please enter a topic!");
    setHasStarted(true);

    const data = {
      topic: topic.trim(),
      roomId: roomId,
    };

    axios
      .post("/api/createQuiz", data)
      .then((response) => {
        if (response.status === 200) {
          setRoomReady(true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    alert("Room code copied!");
  };

  useEffect(() => {
    if (!hasStarted) return; // only run when quiz generation has started

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % loadingPhrases.length;
      setLoadingText(loadingPhrases[index]);
    }, 2000); // change phrase every 2 seconds

    return () => clearInterval(interval); // cleanup when component unmounts or hasStarted changes
  }, [hasStarted]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-gray-900/60 border border-gray-800 rounded-3xl p-8 shadow-2xl text-center backdrop-blur-md"
      >
        {/* Header */}
        <h1 className="text-4xl font-bold text-white mb-1">Quiz Room</h1>

        {/* Room Info */}
        <div className="flex justify-center items-center gap-4 text-gray-400 mb-6">
          <Users className="w-5 h-5" />
          <span>Room ID: {roomId}</span>
          <button
            onClick={handleCopy}
            className="text-indigo-400 hover:text-indigo-300"
          >
            <Copy className="w-4 h-4" />
          </button>
          {topic && (
            <span>
              Topic: <strong>{topic}</strong>
            </span>
          )}
        </div>

        {!hasStarted && !roomReady && (
          <div className="mb-6 flex flex-col sm:flex-row items-center gap-3 justify-center">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter quiz topic"
              className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
            />
            <Button
              onClick={startQuizGeneration}
              className="bg-indigo-500 hover:bg-indigo-600"
            >
              Generate Quiz
            </Button>
          </div>
        )}

        {hasStarted && !roomReady && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-4"
          >
            <p className="text-indigo-400 font-semibold text-lg animate-pulse">
              {loadingText}
            </p>
          </motion.div>
        )}

        {roomReady && (
          <div className="mb-6">
            <p className="text-green-500 font-semibold text-lg animate-pulse">
              Questions are ready!
            </p>
            <p className="text-gray-400 font-semibold text-sm">
              Start the quiz when all players have joined.
            </p>
          </div>
        )}

        {/* User Info */}
        <div className="flex flex-col items-center mb-8 relative group">
          <motion.div className="relative">
            <motion.img
              src={"/avatars/" + localStorage.getItem("guestAvatar") + ".png"}
              alt="Your avatar"
              className="w-20 h-20 rounded-full border-2 border-indigo-500 shadow-md mb-3 transition-transform"
              layout
              whileHover={{ scale: 1.1 }}
            />

            {/* Hover Edit Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(true)}
              className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit2 className="w-5 h-5 text-white" />
            </motion.div>
          </motion.div>

          <p className="text-white font-medium mb-2">
            {localStorage.getItem("guestName") || "Player"}
          </p>
        </div>

        {/* Player List */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 gap-6 justify-center"
        >
          <AnimatePresence>
            {players.map((player) => (
              <motion.div
                key={player.id}
                layout
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-2"
              >
                <motion.img
                  src={"/avatars/" + player.avatar + ".png"}
                  alt={player.name}
                  className="w-16 h-16 rounded-full border-2 border-indigo-500 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                />
                <p className="text-white text-sm font-medium">{player.name}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Waiting Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-gray-400 mt-10"
        >
          Waiting for players to join...
        </motion.p>
        <Button
          onClick={startQuizGeneration}
          className="bg-green-500 hover:bg-green-600 mt-8"
        >
          Start Quiz
        </Button>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg text-indigo-400 mb-2">
              Customize Your Profile
            </DialogTitle>
          </DialogHeader>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-400">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <p className="text-sm mb-2 text-gray-400">Choose an Avatar</p>
                <div className="grid grid-cols-3 gap-3">
                  {avatarList.map((a) => (
                    <motion.div
                      key={a}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setAvatar(a)}
                      className={`cursor-pointer rounded-full border-2 p-1 ${
                        avatar === a
                          ? "border-indigo-500"
                          : "border-transparent hover:border-gray-600"
                      }`}
                    >
                      <img
                        src={a}
                        alt="avatar"
                        className="w-full rounded-full"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  className="bg-indigo-500 hover:bg-indigo-600"
                  onClick={() => {
                    setOpen(false);
                    localStorage.setItem("guestName", name || "Player");
                    const avatarName = avatar.split("/").pop()?.split(".")[0];
                    localStorage.setItem("guestAvatar", avatarName || "horse");
                  }}
                >
                  <Check className="w-4 h-4 mr-1" /> Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </main>
  );
}
