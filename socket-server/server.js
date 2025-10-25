// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Redis } = require("@upstash/redis");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your frontend URL in production
    methods: ["GET", "POST"],
  },
});

// Express route
app.get("/", (req, res) => {
  res.send("AI Quiz Socket Server is running!");
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Example: when a client sends a message
  socket.on("create_room", async ({ hostId, hostName, hostAvatar, roomId }) => {
    console.log(`Creating room for host: ${hostId} with ID: ${roomId}`);
    const host = {
      id: hostId,
      name: hostName,
      avatar: hostAvatar,
      answers: [],
      score: 0,
    };
    const room = {
      id: roomId,
      status: "waiting",
      createdAt: new Date().toISOString(),
      host: hostId,
      players: [host],
      quiz: [],
      currentQuestionIndex: 0,
    };

    await redis.set(`room:${roomId}`, JSON.stringify(room));

    // Join the socket to the room
    socket.join(roomId);
  });

  // Join room event
  socket.on("join_room", async (roomId, guestId, guestName, guestAvatar) => {
    // Store on the socket object
    socket.data.roomId = roomId;
    socket.data.guestId = guestId;

    const roomJson = await redis.get(`room:${roomId}`);
    if (roomJson) {
      const playerExists = roomJson.players.some(
        (player) => player.id === guestId
      );

      if (!playerExists) {
        const newPlayer = {
          id: guestId,
          name: guestName,
          avatar: guestAvatar,
          answers: [],
          score: 0,
        };
        roomJson.players.push(newPlayer);
        await redis.set(`room:${roomId}`, JSON.stringify(roomJson));

        io.in(roomId).emit("player_joined", newPlayer); // notify everyone
      }

      socket.join(roomId);

      // send full room data to new player
      socket.emit("room_data", roomJson);
    }
  });

  // Disconnect event
  socket.on("disconnect", async () => {
    const roomId = socket.data.roomId;
    const guestId = socket.data.guestId;

    if (!roomId || !guestId) return; // not in a room

    // Remove player from room in Redis
    const roomJson = await redis.get(`room:${roomId}`);
    if (roomJson) {
      roomJson.players = roomJson.players.filter(
        (player) => player.id !== guestId
      );
      await redis.set(`room:${roomId}`, JSON.stringify(roomJson));

      // Notify everyone in the room
      io.in(roomId).emit("player_left", { id: guestId });
    }

    console.log(`Client disconnected: ${guestId} from room ${roomId}`);
  });
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
