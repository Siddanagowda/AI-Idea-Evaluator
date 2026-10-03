# 🚀 The Startup Idea Evaluator – AI + Voting Mobile App

An interactive full-stack mobile application built for the **Mobile App Internship Assignment**. Users can submit startup ideas, receive real multi-dimensional feedback from **Google Gemini 2.5 Flash AI**, upvote community ideas, view dynamic leaderboards, and toggle dark mode.

---

## 🏗️ Architecture & System Design

```
                 ┌──────────────────────────────────────┐
                 │        React Native (Expo App)       │
                 │   AsyncStorage persistence & UI      │
                 └──────────────────┬───────────────────┘
                                    │
          ┌─────────────────────────┴─────────────────────────┐
          │                                                   │
          ▼                                                   ▼
┌───────────────────┐                               ┌───────────────────┐
│   AsyncStorage    │                               │  FastAPI Backend  │
│ - Ideas Database  │                               │ POST /api/evaluate│
│ - Voted Ideas List│                               └─────────┬─────────┘
│ - Theme (Light/Dark)                                        │ HTTPS
└───────────────────┘                                         ▼
                                                    ┌───────────────────┐
                                                    │ Gemini 2.5 Flash  │
                                                    │ Structured JSON   │
                                                    └───────────────────┘
```

---

## ✨ Features Implemented

### 🧾 1. Idea Submission & Real AI Evaluation
- **Interactive Form**: Inputs for Startup Name, Tagline, and Problem/Solution Description with character counters & input validation.
- **Real AI Evaluation**: Powered by **Google Gemini 2.5 Flash** returning structured JSON data:
  - **Overall Score** (0–100)
  - **Dimensional Ratings**: Problem Clarity, Market Potential, Originality, Feasibility
  - **Strengths & Considerations**: Bulleted feedback
  - **AI Summary**: Constructive paragraph analysis
- **Offline / Fallback Resilience**: If `GEMINI_API_KEY` is not provided or encounters API rate limits, a smart client/server fallback evaluator guarantees seamless functionality without crashing.

### 📜 2. Ideas Feed Screen
- **Comprehensive Cards**: Displays Startup Name, Tagline, AI Score Badge, Vote Counter, and Date.
- **Single Vote Enforcement**: Users can upvote any idea once. Re-voting on the same idea is disabled via `AsyncStorage` device persistence.
- **Search & Sort**: Filter ideas by keyword or sort dynamically by:
  - ⭐ **AI Score** (High to low)
  - 👍 **Community Votes** (High to low)
  - 🕐 **Newest** (Chronological)
- **Expandable Details**: "Read More" drawer revealing full description and full AI score breakdown modal.

### 🏆 3. Leaderboard Screen
- **Top 5 Ranking**: Highlights the top 5 startup concepts.
- **Segmented Control Toggle**: Switch between **🏆 Community Top** (sorted by votes) and **🤖 AI Top Scores** (sorted by rating).
- **Medal Badges & Gradients**: Custom `🥇 Gold`, `🥈 Silver`, and `🥉 Bronze` rank badges with `expo-linear-gradient` styled cards.

### 🌚 4. Bonus Features
- 🌙 **Dark Mode Toggle**: Persistent dark/light theme setting across screens with smooth color adaptation.
- 📋 **Share & Copy**: One-tap copy to clipboard for startup pitches and AI scores.
- 🔔 **Toast Notifications**: Floating feedback popups for upvoting, submitting, and clipboard copying.
- 💾 **Pre-Seeded Sample Data**: Initial seed ideas pre-loaded so the app looks populated immediately on first launch.

---

## 🛠️ Tech Stack Used

- **Mobile App**:
  - **React Native** with **Expo** CLI
  - **TypeScript**
  - **@react-native-async-storage/async-storage** for persistent local storage
  - **expo-linear-gradient** for leaderboard UI cards
  - **expo-clipboard** for sharing ideas
  - **React Native Safe Area Context** & Custom Navigation Tabs

- **Backend Service**:
  - **Python 3.13** + **FastAPI**
  - **Google Gemini 2.5 Flash API** (`generativelanguage.googleapis.com`)
  - **Pydantic** for input/output schema validation
  - **Uvicorn** ASGI server with CORS middleware

---

## 🚀 How to Run Locally

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Expo Go app on mobile device OR iOS/Android emulator

---

### 2. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# (Optional) Set your Gemini API key in .env
# If left empty, the smart fallback evaluator automatically runs.
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env

# Start FastAPI server
python main.py
```

The server will start on `http://localhost:8000`. You can test endpoints via Interactive API Docs at `http://localhost:8000/docs`.

---

### 3. Mobile App Setup (Expo)

```bash
# Open a new terminal and navigate to mobile directory
cd mobile

# Install NPM dependencies
npm install

# Start Expo development server
npx expo start
```

Scan the QR code with **Expo Go** (Android/iOS) or press `a` for Android Emulator / `w` for Web preview.
