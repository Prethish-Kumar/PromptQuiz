"use client";

import { useEffect, useState } from "react";
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

// Example avatar list (you’ll replace these with real images in /public/avatars)
const avatarList = [
  "/avatars/1.png",
  "/avatars/2.png",
  "/avatars/3.png",
  "/avatars/4.png",
  "/avatars/5.png",
  "/avatars/6.png",
];

export default function RoomPage({ params }) {
  const { roomId } = params;
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("Player");
  const [avatar, setAvatar] = useState("/avatars/1.png");
  const [open, setOpen] = useState(false);

  // Simulated players joining
  useEffect(() => {
    const samplePlayers = [
      { name: "Raja", avatar: "/avatars/2.png" },
      { name: "Aarav", avatar: "/avatars/3.png" },
      { name: "Meera", avatar: "/avatars/4.png" },
      { name: "Kiran", avatar: "/avatars/5.png" },
      { name: "Zoya", avatar: "/avatars/6.png" },
      { name: "Ravi", avatar: "/avatars/1.png" },
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < samplePlayers.length) {
        setPlayers((p) => [...p, samplePlayers[i]]);
        i++;
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    alert("Room code copied!");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-gray-900/60 border border-gray-800 rounded-3xl p-8 shadow-2xl text-center backdrop-blur-md"
      >
        {/* Header */}
        <h1 className="text-4xl font-bold text-white mb-2">Quiz Room</h1>
        <div className="flex justify-center items-center gap-2 text-gray-400 mb-6">
          <Users className="w-5 h-5" />
          <span>Room ID: {roomId}</span>
          <button
            onClick={handleCopy}
            className="text-indigo-400 hover:text-indigo-300"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={avatar}
            alt="Your avatar"
            className="w-20 h-20 rounded-full border-2 border-indigo-500 shadow-md mb-3"
          />
          <p className="text-white font-medium mb-2">{name}</p>
          <Button
            variant="outline"
            className="text-sm text-gray-300 hover:text-indigo-400 flex items-center gap-2 border-gray-700"
            onClick={() => setOpen(true)}
          >
            <Edit2 className="w-4 h-4" /> Change name / avatar
          </Button>
        </div>

        {/* Player List */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 gap-6 justify-center"
        >
          <AnimatePresence>
            {players.map((player) => (
              <motion.div
                key={player.name}
                layout
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="relative">
                  <motion.img
                    src={player.avatar}
                    alt={player.name}
                    className="w-16 h-16 rounded-full border-2 border-indigo-500 shadow-lg"
                    whileHover={{ scale: 1.1 }}
                  />
                </div>
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
                  onChange={(e) => setName(e.target.value)}
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
                  onClick={() => setOpen(false)}
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
