# 🚀 Onward (Unstuck AI) — Autonomous Voice-Guided Web Navigation Agent

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18%2F19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![AI: Groq Llama 3.3](https://img.shields.io/badge/LLM-Groq%20Llama%203.3%2070B-F05032)](https://groq.com/)
[![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-4285F4?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Zero Cost](https://img.shields.io/badge/API%20Cost-%240.00%20(100%25%20Free)-success)](#-zero-cost-api-architecture)

> **Turn any website into a voice-interactive, self-navigating experience.**  
> Onward (Unstuck AI) bridges natural voice commands and web interfaces using intelligent DOM extraction, multi-step LLM planning, and autonomous visual guidance with animated cursors and element highlights.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Zero-Cost API Architecture](#-zero-cost-api-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Client Setup](#2-frontend-client-setup)
  - [3. Chrome Extension Setup](#3-chrome-extension-setup)
- [API Endpoints](#-api-endpoints)
- [Embedding in Any React App](#-embedding-in-any-react-app)
- [Roadmap & Future Enhancements](#-roadmap--future-enhancements)
- [License](#-license)

---

## 🌟 Overview

Navigating complex SaaS portals, booking engines, and multi-step web dashboards can be overwhelming for users. **Onward (Unstuck AI)** acts as an autonomous digital co-pilot:

1. **You speak naturally** — e.g., *"Find me a luxury cabin in Lake Tahoe for next weekend under $300."*
2. **Onward scans the viewport** — Sanitizes the DOM, tags interactive elements (`buttons`, `inputs`, `selects`), captures page layout context, and maps site structure.
3. **The AI agent plans actions** — Evaluates your intent against available controls, determining intermediate steps and target element selectors.
4. **Autonomous Visual Guidance** — Moves a fluid, Bézier-animated **GhostCursor** to the target element, scrolls it smoothly into view, renders pulsing highlight bounding boxes, and executes clicks/inputs.
5. **Spoken Narration** — Provides real-time spoken audio updates explaining each step as it happens.

Available both as a **drop-in React SDK component** (3 lines of code) and a **universal Manifest V3 Chrome Extension** that works across the open web.

---

## ✨ Key Features

- 🎙️ **Full Voice-to-Action Loop**: Hands-free interaction powered by the browser's native Web Speech API and Whisper speech recognition with Voice Activity Detection (VAD).
- 🧠 **Spatial DOM & Context Engine**:
  - Dynamically discovers interactive DOM elements (`<button>`, `<a>`, `<input>`, custom ARIA roles).
  - Assigns collision-free IDs (`data-unstuck-id`) with bounding box tracking.
  - Strips non-semantic markup and trims payloads to stay within token budgets.
- 🤖 **Agentic Multi-Step Reasoning**:
  - Leverages Groq's high-throughput Llama 3.3 70B (or Google Gemini 1.5/2.0) to parse complex multi-step user intentions into sequential UI actions.
  - Returns structured JSON plans including reasoning, target actions, narration, and completion flags.
- 🎯 **GhostCursor & Visual Direction**:
  - Custom canvas/SVG cursor moving along realistic human-like Bézier motion curves.
  - 60 FPS throttled viewport repositioning and scrolling synchronization.
  - Highlight overlays outlining buttons, inputs, and cards to direct user focus.
- 🔊 **Natural Voice Synthesis (TTS)**: Real-time text-to-speech audio feedback powered by Google Translate TTS / ElevenLabs.
- 🧩 **Dual Implementation Modes**:
  - **React Provider SDK**: Add `<UnstuckProvider>` to embed within your own React/Next.js application.
  - **Chrome Extension (Manifest V3)**: Run Onward on **any website** on the internet via background service workers and content scripts.
- 💸 **100% Free-Tier Architecture**: Engineered from the ground up to operate with **$0.00 infrastructure costs** utilizing generous free tiers (Groq 14,400 req/day, Web Speech API, Google Translate TTS).

---

## 🏗️ System Architecture

```
                                  ┌────────────────────────┐
                                  │      USER / VOICE      │
                                  └───────────┬────────────┘
                                              │ Voice / Text Input
                                              ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT / BROWSER RUNTIME                                │
│                                                                                        │
│   ┌──────────────────────────┐    ┌──────────────────────────┐    ┌─────────────────┐ │
│   │     Web Speech API       │    │      DOM Extractor       │    │   html2canvas   │ │
│   │ (Browser Speech-to-Text) │    │  (Tagging & Sanitization)│    │(Viewport Snap)  │ │
│   └────────────┬─────────────┘    └────────────┬─────────────┘    └────────┬────────┘ │
│                │                               │                           │          │
│                └───────────────────────┬───────┴───────────────────────────┘          │
│                                        │ Context Payload                              │
│                                        ▼                                              │
│                            ┌───────────────────────┐                                  │
│                            │   Unstuck Context     │                                  │
│                            │    Agent Executor     │                                  │
│                            └───────────┬───────────┘                                  │
└────────────────────────────────────────┼──────────────────────────────────────────────┘
                                         │ REST API Calls
                                         ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                BACKEND (Node.js / Express)                             │
│                                                                                        │
│     POST /asr                      POST /analyze                      POST /tts        │
│   (Speech Parsing)            (Prompt Engine & Planner)             (Audio Stream)     │
│          │                                 │                               │          │
└──────────┼─────────────────────────────────┼───────────────────────────────┼──────────┘
           │                                 │                               │
           ▼                                 ▼                               ▼
┌──────────────────────┐         ┌───────────────────────┐       ┌──────────────────────┐
│    Web Speech API    │         │       Groq AI         │       │   Google Translate   │
│    (In-Browser /     │         │   (Llama 3.3 70B /    │       │     TTS Engine       │
│     Whisper API)     │         │     Gemini Flash)     │       │   (Audio Streams)    │
└──────────────────────┘         └───────────────────────┘       └──────────────────────┘
                                             │ Action Sequence
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              ACTION EXECUTION & FEEDBACK                               │
│                                                                                        │
│   ┌──────────────────────────────┐                ┌────────────────────────────────┐   │
│   │         GhostCursor          │                │     BoundingBoxHighlight       │   │
│   │ (Bézier Curve Mouse Pointer) │                │  (Target Pulse & Auto-Scroll)  │   │
│   └──────────────────────────────┘                └────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔬 How It Works

### 1. DOM Analysis & Interactive Element Indexing
When the user triggers a command, the frontend client scans the visible DOM tree for interactive controls:
```typescript
function isInteractive(el: Element): boolean {
  const interactiveTags = ["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"];
  const interactiveRoles = ["button", "link", "menuitem", "tab", "checkbox", "radio"];
  return (
    interactiveTags.includes(el.tagName) ||
    interactiveRoles.includes(el.getAttribute("role") || "") ||
    el.hasAttribute("onClick")
  );
}
```
Each matching element is assigned a unique `data-unstuck-id` and its viewport bounding rectangle (`getBoundingClientRect()`) is computed.

### 2. Context Sanitization & Token Optimization
Raw HTML trees often contain tens of thousands of tokens. Onward strips scripts, styles, non-semantic SVGs, and hidden containers, truncating the sanitized DOM representation to a compact budget (~24,000 characters / ~6,000 tokens) before transmitting it to the LLM.

### 3. Agent Planning & Structured JSON Output
The backend packages the user's query, current DOM tree, and site navigation hierarchy into an engineered prompt for Groq (Llama 3.3 70B). The model outputs a strict JSON schema:
```json
{
  "reasoning": "The user wants to filter properties by price. Clicking the 'Price' dropdown reveals min/max inputs.",
  "actions": ["filter-price-btn-12", "input-max-price-4"],
  "narration": "Opening the price filter to set your budget.",
  "taskAccomplished": false
}
```

### 4. Visual Guidance & Auto-Execution
The `WorkflowCreator` engine receives the target element IDs:
- **Smooth Auto-Scroll**: Scrolls the page so the target element is positioned within the top quarter of the viewport.
- **GhostCursor Animation**: Animates an SVG cursor to the target coordinate at 60 FPS using smooth Bézier interpolations.
- **Highlight Overlay**: Projects an animated highlight box over the target element.
- **Interaction**: Triggers the DOM click event or prompts the user to enter data.

---

## 🛠️ Tech Stack

| Domain | Technologies Used |
|---|---|
| **Frontend Web Client** | React 18/19, TypeScript, Vite, Tailwind CSS, Shadcn UI / Radix UI, TanStack Query |
| **Backend Server** | Node.js, Express.js, Cloudflare Workers / Wrangler |
| **AI / LLM Planning** | Groq SDK (Llama 3.3 70B Versatile), Google Gemini API (gemini-1.5-flash / gemini-2.0-flash) |
| **Voice & Audio** | Web Speech API (Client-side SpeechRecognition), Google Translate TTS, Whisper API, ElevenLabs |
| **Browser Extension** | Chrome Extensions Manifest V3 (Service Workers, Content Scripts, ActiveTab, Chrome Storage) |
| **Animation & Graphics** | HTML5 Canvas, Bézier Curve interpolation, DOM Matrix Bounding Boxes, `html2canvas` |

---

## 📁 Project Structure

```
Onward-main/
├── client/                     # React 18/19 Demo Application (Travel Booking Platform)
│   ├── src/
│   │   ├── components/
│   │   │   ├── unstuck/chat/   # Floating ChatWidget, NeedHelpButton, Maximized/Minimized UI
│   │   │   └── WorkflowCreator.tsx  # Step executor, GhostCursor & Highlight coordinator
│   │   ├── contexts/
│   │   │   └── UnstuckContext.tsx   # Core context: DOM scanner, screenshot capture, state
│   │   ├── lib/
│   │   │   ├── GhostCursor.ts       # Human-like animated cursor engine
│   │   │   ├── BoundingBoxHighlight.ts # Element outline and pulsing overlay
│   │   │   ├── sanitize.ts          # DOM stripper for token optimization
│   │   │   └── extract.ts           # JSON extractor for LLM responses
│   │   └── pages/                   # Demo pages (Search, Listings, Bookings, Settings)
│   └── package.json
│
├── server/                     # Express & Cloudflare Workers Backend
│   ├── src/
│   │   ├── server.js           # Express API server (100% Free API edition)
│   │   └── services/
│   │       ├── groq.js         # Groq AI analysis service (Llama 3.3 70B)
│   │       ├── gemini.ts       # Google Gemini analysis service
│   │       └── gemini.js       # Gemini JS runtime implementation
│   └── package.json
│
├── extension/                  # Universal Manifest V3 Chrome Extension
│   ├── manifest.json           # Manifest V3 configuration & permissions
│   ├── background/
│   │   └── service-worker.js   # Background service worker coordinating AI API calls
│   ├── content/
│   │   ├── content-script.js   # Injected DOM analyzer, overlay injector & speech handler
│   │   └── content-styles.css  # Overlay and highlight UI styles
│   ├── popup/                  # Extension settings & API key configuration popup
│   └── lib/                    # DOM extractors and response parsers
│
└── guide/                      # Comprehensive technical guides, API specs & diagrams
```

---

## 💰 Zero-Cost API Architecture

Onward is pre-configured to run with zero recurring costs using top-tier free tiers:

| Service | Provider | Free Tier Limit | Cost |
|---|---|---|---|
| **LLM Reasoning** | [Groq Cloud](https://console.groq.com/) (Llama 3.3 70B) | **14,400 requests / day** | **$0.00** |
| **Speech Recognition** | Browser Web Speech API | **Unlimited** (runs locally on client) | **$0.00** |
| **Text to Speech** | Google Translate TTS API | **Unlimited** (public client endpoint) | **$0.00** |
| **Optional Multimodal** | Google AI Studio (Gemini Flash) | **15 requests / min** free | **$0.00** |

*No credit cards required to get started.*

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- A free [Groq API Key](https://console.groq.com/) (takes 30 seconds to generate)

---

### 1. Backend Setup

1. Navigate to the server folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your environment:
   Create a `.dev.vars` file inside the `server/` directory:
   ```env
   GROQ_API_KEY=gsk_your_groq_api_key_here
   PORT=8787
   ```

4. Start the backend:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:8787`.*

---

### 2. Frontend Client Setup

1. In a new terminal, navigate to the client folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`.
5. Click the floating **"Need Help?"** microphone button and speak a command:
   > *"Show me homes in San Francisco with a hot tub"*  
   > Watch Onward autonomously analyze the screen, guide the cursor, highlight filters, and talk you through the interface!

---

### 3. Chrome Extension Setup

Want to use Onward on any website? Load the extension:

1. Open Google Chrome and navigate to:
   ```
   chrome://extensions
   ```
2. Enable **"Developer mode"** in the top-right toggle.
3. Click **"Load unpacked"** in the top-left corner.
4. Select the `extension/` directory from this repository.
5. Click the **Unstuck Voice Guide** puzzle icon in your Chrome toolbar, enter your Groq API key, and test voice navigation on any live website!

---

## 📡 API Endpoints

The Express server exposes the following REST routes:

### `GET /health`
Returns the status of the server and active API adapters.

### `POST /analyze`
Analyzes user intent against current viewport DOM elements.
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "userQuery": "How do I filter by price?",
    "domString": "<div data-unstuck-id=\"1\" ...>...</div>",
    "sitemap": "Home > Listings > Filters",
    "previousMessages": []
  }
  ```
- **Response:**
  ```json
  {
    "result": "{\"reasoning\": \"...\", \"actions\": [\"filter-btn-1\"], \"narration\": \"Opening filters\", \"taskAccomplished\": false}",
    "messages": [...]
  }
  ```

### `POST /tts`
Converts text into natural spoken MP3 audio streaming.
- **Body:** `{ "text": "Clicking the search button now.", "language": "en" }`
- **Response:** `audio/mpeg` binary stream.

---

## 📦 Embedding in Any React App

Integrate Onward into an existing React application in 3 steps:

```tsx
import { UnstuckProvider } from "@/contexts/UnstuckContext";
import { ChatWidget } from "@/components/unstuck/chat/ChatWidget";

export default function App() {
  return (
    <UnstuckProvider config={{ serverUrl: "http://localhost:8787" }}>
      <YourAppRoutes />
      {/* Floating AI voice assistant and workflow executor */}
      <ChatWidget />
    </UnstuckProvider>
  );
}
```

---

## 🗺️ Roadmap & Future Enhancements

- [x] Web Speech API real-time voice input & transcription.
- [x] Token-optimized DOM extraction with collision-resistant element tagging.
- [x] Groq Llama 3.3 70B & Gemini 1.5/2.0 planning loop.
- [x] Bézier curve GhostCursor animation engine and highlight overlays.
- [x] Manifest V3 Chrome Extension for universal web navigation.
- [ ] Multimodal computer vision verification (comparing before/after action screenshots).
- [ ] Cross-tab navigation support for complex multi-page flows.
- [ ] Support for Shadow DOM and cross-origin `<iframe>` element inspection.

---

## 📄 License

This project is licensed under the MIT License — feel free to use, modify, and distribute it for personal and commercial projects.
