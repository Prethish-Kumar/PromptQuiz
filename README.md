# QuizMaster: Multiplayer AI-Powered Quiz App

![QuizMaster Banner](https://your-image-link.com/banner.png)

**QuizMaster** is a real-time, multiplayer quiz platform built with modern web technologies. Users can create custom quiz rooms, invite friends, and enjoy interactive quizzes powered by AI. It’s designed for speed, scalability, and a delightful user experience.

---

## 🚀 Features

- **Real-time Multiplayer:** Join rooms with friends and compete in quizzes together.
- **AI-Powered Quiz Generation:** Generate quizzes dynamically based on any topic using **Gemini AI**.
- **Custom Avatars & Profiles:** Users can choose names and avatars, stored in **localStorage**.
- **Live Scores & Leaderboards:** Track scores in real-time.
- **Room Persistence:** Rooms and players stored in **Redis** for fast, reliable state management.
- **Database Storage:** User and quiz data stored in **MongoDB** for persistence.
- **Smooth Animations:** Built with **Framer Motion** for seamless transitions and interactions.
- **Modern UI Components:** Leveraging **shadcn/ui** for polished dialogs, buttons, cards, and responsive design.

---

## 🛠 Technologies Used

### **Frontend**

- **Next.js 14** – A powerful React framework with server-side rendering, routing, and API routes.
- **TypeScript** – Provides type safety and improved developer experience.
- **React Hooks** – For state management and lifecycle handling.
- **Framer Motion** – Animations for loading states, UI transitions, and interactive effects.
- **LocalStorage** – Persist guest user info (name & avatar) across sessions.
- **shadcn/ui** – Ready-to-use UI components like Dialog, Card, Button, and more.
- **Lucide Icons** – Clean, modern SVG icons.

### **Backend & Real-Time**

- **Node.js + Express** – Lightweight server for API routes and websocket handling.
- **Socket.IO** – Real-time communication between players and rooms.
- **Redis (Upstash)** – Stores active room state, players, and scores in-memory for fast retrieval.
- **MongoDB** – Persistent storage for users, quizzes, and historical data.
- **Github Copilot** – Assisted development for generating boilerplate code, handling API requests, and writing TypeScript types efficiently.

### **AI Integration**

- **Gemini AI** – Used for generating quiz questions dynamically.
- **Prompt Engineering** – Custom prompts are designed to instruct the AI to generate quizzes in a structured and fun way.
- **Structured Outputs** – Gemini’s structured output features ensure the AI returns questions in a JSON format that can be directly added to the quiz state.
- **Dynamic Loading Messages** – While the quiz is generated, the UI shows engaging messages like `"Cooking questions about {topic}"` or `"Sent sloths to find questions on {topic}"`.

---

## ⚡ Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/quizmaster.git
cd quizmaster
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables** in `.env.local`:

```env
NEXT_PUBLIC_UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
MONGODB_URI=your_mongo_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 💡 Usage

- **Create a Room:** Click "Create Room" to start a new quiz session. You are automatically added as the host.
- **Join a Room:** Click "Join Room" and enter a valid Room ID. Your name and avatar will be sent to the server.
- **Play the Quiz:** Wait for the AI to generate questions. The loading screen shows fun, animated messages while the quiz is prepared.
- **Real-time Updates:** New players joining or leaving are reflected immediately for everyone using Socket.IO events.

---

## 🧩 Architecture

1. **Frontend**: Next.js + TypeScript + React hooks
   - Stores guest info in **localStorage**
   - Handles animations via **Framer Motion**
   - Uses **shadcn/ui** for modals, cards, and buttons

2. **Backend / API**:
   - **Next.js API routes** handle quiz generation and room creation
   - **Socket.IO** manages real-time player connections
   - **Redis** stores active room state for instant access
   - **MongoDB** keeps permanent records of quizzes, user history
   - **Gemini AI** generates structured quiz questions from prompts

---

## 📌 Best Practices Used

- **TypeScript everywhere** – type safety across frontend and backend.
- **LocalStorage for guest persistence** – users remain in the same session even on page reload.
- **Redis for in-memory state** – ensures fast reads/writes for active rooms.
- **MongoDB for permanent storage** – quizzes, scores, and historical data are persisted.
- **Socket.IO events carefully structured**:
  - `join_room`, `player_joined`, `player_left`, `room_data`
- **AI prompt engineering** ensures reliable and structured question output.
- **Animation & UX polish** – Framer Motion loading indicators, pulse effects, and dynamic text animations improve engagement.
- **Github Copilot usage** – helped generate repetitive boilerplate and types, speeding up development.

---

## 📁 Folder Structure (simplified)

```
/app
  /api
    createQuiz.ts
    joinRoom.ts
  /components
    ui/            # shadcn UI components
    PlayerCard.tsx
  /pages
    index.tsx
    room/[roomId].tsx
/lib
  redisClient.ts
  mongoClient.ts
  geminiClient.ts
```

---

## 🔮 Future Enhancements

- Add **leaderboard and scoring animations**
- Persistent **user accounts and authentication**
- Support for **more quiz types**: timed quizzes, multiple rounds
- Mobile-friendly enhancements and offline support
- More advanced **AI prompt engineering** for themed quizzes

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/NewFeature`)  
3. Commit your changes (`git commit -m 'Add new feature'`)  
4. Push to the branch (`git push origin feature/NewFeature`)  
5. Open a Pull Request

---

## 📜 License

MIT License © 2025 Prethish Kumar

---

Made with ❤️ using **Next.js, TypeScript, Redis, MongoDB, Socket.IO, Shadcn/UI, Framer Motion, Gemini AI, Structured Outputs, Prompt Engineering, and GitHub Copilot**.
`
