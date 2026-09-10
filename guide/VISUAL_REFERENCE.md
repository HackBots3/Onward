# Unstuck Project - Visual Reference Card

## 🎯 What is Unstuck?

A **voice-guided website navigation AI** that helps users get unstuck on any website.

**In 3 Lines of Code:**
```jsx
<UnstuckProvider config={{...}}>
  <YourApp />
</UnstuckProvider>
```

✅ Users can now ask: *"Show me bookings"* and the AI will navigate them there automatically!

---

## 🔀 Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        USER INTERACTION                          │
│                                                                  │
│  Voice: "Find me a property"  Text: "Show bookings"              │
└──────────────┬───────────────────────────────────────────────────┘
               │
               ↓
     ┌─────────────────────────┐
     │   BROWSER (React)       │
     │                         │
     │  1. Voice Detection ── ┐ │
     │  2. Screenshot ────── │ │ ChatWidget
     │  3. DOM Analysis ──── │ │ Component
     │  4. Send to API ────┐ │ │
     │                    ↓ ↓ │
     └────────────────────────┘
               │
               │ HTTP POST
               │
               ↓
     ┌──────────────────────────────┐
     │ CLOUDFLARE WORKERS (Backend) │
     │                              │
     │  1. Receive voice stream     │
     │  2. Convert to text (ASR)   │
     │  3. Call Gemini AI         │
     │  4. Generate actions       │
     │  5. Convert to speech      │
     │                            │
     └────────────────────────────┘
               │
    ┌──────────┼──────────┐
    ↓          ↓          ↓
┌────────┐ ┌─────────┐ ┌──────────┐
│ Gemini │ │ Whisper │ │ ElevenLabs│
│  API   │ │  API    │ │  API     │
└────────┘ └─────────┘ └──────────┘
    │          │          │
    └──────────┼──────────┘
               │
               ↓ HTTP Response
               │
     ┌─────────────────────┐
     │  BROWSER (React)    │
     │                    │
     │  • Show highlights  │
     │  • Play audio       │
     │  • Execute actions  │
     │  • Display response │
     │                    │
     └─────────────────────┘
               │
               ↓
        ┌────────────┐
        │  SUCCESS!  │
        │ User guided│
        │   to goal  │
        └────────────┘
```

---

## 🗂️ File Structure at a Glance

```
PROJECT ROOT
│
├── client/                          (React Frontend)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                 → 40+ ready-made UI components
│   │   │   ├── unstuck/
│   │   │   │   └── chat/
│   │   │   │       ├── ChatWidget.tsx      ⭐ Main chat component
│   │   │   │       ├── MaximizedChat.tsx
│   │   │   │       ├── MinimizedChat.tsx
│   │   │   │       └── NeedHelpButton.tsx
│   │   │   ├── Filters.tsx, Navbar.tsx, ListingCard.tsx
│   │   │
│   │   ├── contexts/
│   │   │   ├── UnstuckContext.tsx  ⭐ Core logic provider
│   │   │   └── CurrencyContext.tsx
│   │   │
│   │   ├── lib/
│   │   │   ├── extract.ts          → Parse AI responses
│   │   │   ├── sanitize.ts         → Clean HTML
│   │   │   ├── GhostCursor.ts      → Highlight animation
│   │   │   └── BoundingBoxHighlight.ts
│   │   │
│   │   ├── pages/                  → Route components
│   │   │   ├── Index.tsx
│   │   │   ├── PropertyDetails.tsx
│   │   │   ├── BookingHistory.tsx
│   │   │   └── ...
│   │   │
│   │   ├── utils/
│   │   │   ├── screenshot.ts       → Capture screen
│   │   │   └── siteMetadata.ts     → Generate sitemap
│   │   │
│   │   ├── App.tsx                 → Main app & routes
│   │   ├── main.tsx                → Entry point
│   │   └── index.css               → Global styles
│   │
│   ├── vite.config.ts              → Build config
│   ├── tsconfig.json               → TypeScript config
│   ├── tailwind.config.ts          → TailwindCSS config
│   └── package.json                → Dependencies
│
├── server/                          (Cloudflare Workers Backend)
│   ├── src/
│   │   ├── index.ts                ⭐ API routes & endpoints
│   │   │   ├─ POST /asr  (Speech-to-Text)
│   │   │   ├─ POST /analyze (Gemini AI)
│   │   │   └─ POST /tts (Text-to-Speech)
│   │   │
│   │   └── services/
│   │       └── gemini.ts           ⭐ AI service
│   │           └─ processQuery() → Main logic
│   │
│   ├── wrangler.jsonc              → Cloudflare config
│   ├── tsconfig.json               → TypeScript config
│   ├── .dev.vars                   → Environment variables
│   └── package.json                → Dependencies
│
├── PROJECT_GUIDE.md                ← Read first (complete guide)
├── QUICK_START.md                  ← Read second (quick ref)
├── TECH_SKILLS_ROADMAP.md          ← Learning path
├── GETTING_STARTED.md              ← Implementation guide
├── package.json                    → Root config
└── bun.lockb                       → Dependency lock
```

---

## 💾 Key Data Structures

### **1. Chat Message**
```typescript
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  error?: string;
}
```

### **2. Interactive Element**
```typescript
interface InteractiveElement {
  id: string;                  // data-unstuck-id="div-nav-button-1"
  label: string;               // "Click here"
  type: string;                // "BUTTON", "INPUT", "A"
  boundingBox: DOMRect;        // { x, y, width, height, ... }
}
```

### **3. Gemini Response**
```typescript
interface AIResponse {
  reasoning: string;           // Explanation of analysis
  actions: string[];           // ["element-id-1", "element-id-2"]
  narration: string;           // "Let me help you..."
  taskAccomplished: boolean;   // true if done
}
```

### **4. API Request/Response**
```typescript
// Request to /analyze
{
  userQuery: "Find bookings",
  screenshot: "data:image/png;base64,...",
  domString: "<sanitized-html>",
  previousMessages: [],
  sitemap: "page structure"
}

// Response from /analyze
{
  reasoning: "User wants to see bookings...",
  actions: ["navbar-link-5"],
  narration: "Let's go to your bookings!",
  taskAccomplished: false
}
```

---

## 🚀 Technology Stack Overview

| Component | Technology | Purpose | Version |
|-----------|-----------|---------|---------|
| **UI Framework** | React | Component-based UI | 18+ |
| **Language** | TypeScript | Type safety | 5+ |
| **Build Tool** | Vite | Fast bundling | 4+ |
| **Styling** | TailwindCSS | Utility classes | 3+ |
| **UI Components** | Shadcn/UI | Pre-built components | Latest |
| **State Mgmt** | Context API | State provider | Built-in |
| **Data Fetching** | TanStack Query | API caching | 5+ |
| **Routing** | React Router | Page navigation | 6+ |
| **Backend** | Hono | API framework | 4+ |
| **Hosting** | Cloudflare Workers | Serverless | Latest |
| **AI** | Google Gemini | Query analysis | Latest |
| **Speech-to-Text** | OpenAI Whisper | Audio transcription | Latest |
| **Text-to-Speech** | ElevenLabs | Voice synthesis | Latest |
| **Voice Detection** | VAD React | Speech detection | 0.0.28 |
| **Screenshots** | html2canvas | Screen capture | 1.4+ |

---

## 🔧 API Endpoints Reference

```
BASE URL: http://localhost:8787  (local)
         https://your-worker.workers.dev  (production)

┌─────────────────────────────────────────────────────┐
│ 1. SPEECH-TO-TEXT (ASR)                             │
├─────────────────────────────────────────────────────┤
│ POST /asr                                           │
│                                                     │
│ Headers:                                            │
│   Content-Type: application/json                    │
│   X-API-Key: your_api_key                          │
│                                                     │
│ Body:                                               │
│ {                                                   │
│   "audio_data": "base64_encoded_webm_audio",       │
│   "language": "en"                                 │
│ }                                                   │
│                                                     │
│ Response:                                           │
│ {                                                   │
│   "text": "transcribed text here",                 │
│   "confidence": 0.95                               │
│ }                                                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 2. QUERY ANALYSIS (AI)                              │
├─────────────────────────────────────────────────────┤
│ POST /analyze                                       │
│                                                     │
│ Headers:                                            │
│   Content-Type: application/json                    │
│   X-API-Key: your_api_key                          │
│                                                     │
│ Body:                                               │
│ {                                                   │
│   "userQuery": "user's question",                  │
│   "screenshot": "base64_encoded_image",            │
│   "domString": "<sanitized-html>",                 │
│   "previousMessages": [],                          │
│   "sitemap": "page structure"                      │
│ }                                                   │
│                                                     │
│ Response:                                           │
│ {                                                   │
│   "reasoning": "detailed explanation",             │
│   "actions": ["element-id-1", "element-id-2"],    │
│   "narration": "friendly description",             │
│   "taskAccomplished": false                        │
│ }                                                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 3. TEXT-TO-SPEECH (TTS)                             │
├─────────────────────────────────────────────────────┤
│ POST /tts                                           │
│                                                     │
│ Headers:                                            │
│   Content-Type: application/json                    │
│   X-API-Key: your_api_key                          │
│                                                     │
│ Body:                                               │
│ {                                                   │
│   "text": "text to speak"                          │
│ }                                                   │
│                                                     │
│ Response:                                           │
│ {                                                   │
│   "audio": "base64_encoded_mp3",                   │
│   "mimeType": "audio/mpeg"                         │
│ }                                                   │
└─────────────────────────────────────────────────────┘
```

---

## 📖 How to Read the Code

### **Start Here** (in order):
```
1. PROJECT_GUIDE.md        ← Big picture
2. QUICK_START.md          ← Quick reference
3. App.tsx                 ← Routes & structure
4. UnstuckContext.tsx      ← Core logic
5. ChatWidget.tsx          ← UI component
6. server/index.ts         ← API setup
7. server/services/gemini.ts ← AI logic
```

### **By Role**:

**Frontend Developer:**
```
Priority:
1. App.tsx
2. ChatWidget.tsx
3. Components in /components
4. Styling (Tailwind)
5. Context usage
```

**Backend Developer:**
```
Priority:
1. server/index.ts
2. server/services/gemini.ts
3. API endpoints
4. Error handling
5. Environment config
```

**Full Stack:**
```
Priority:
1. All of the above!
2. Integration between both
3. Deployment configs
4. Testing setup
```

---

## 🎯 Setup Checklist

```
SETUP (Day 1):
□ Clone repository
□ npm install (root, client, server)
□ Get API keys (Gemini, ElevenLabs, FAL)
□ Create .env files
□ npm run dev (both servers)
□ Test in browser
□ ✅ Celebrate starting!

LEARNING (Day 2-3):
□ Read core files
□ Understand data flow
□ Trace a request end-to-end
□ Test different commands
□ Read through components
□ ✅ Understand architecture

CUSTOMIZATION (Day 4-7):
□ Modify AI prompts
□ Change styling
□ Add new pages/features
□ Test thoroughly
□ ✅ Build something custom

DEPLOYMENT (Week 2):
□ Optimize performance
□ Set up error tracking
□ Deploy frontend (Vercel)
□ Deploy backend (Cloudflare)
□ Monitor production
□ ✅ Live on internet!
```

---

## 🔐 Environment Variables

**Create These Files:**

### `client/.env.local`
```env
VITE_API_URL=http://localhost:8787
VITE_GEMINI_API_KEY=your_key_here
```

### `server/.dev.vars` (local)
```env
GEMINI_API_KEY=your_key
ELEVENLABS_API_KEY=your_key
FAL_API_KEY=your_key
```

### Cloudflare Dashboard (production)
```
Set the same env vars in:
Workers → Settings → Environment Variables
```

---

## 💡 Quick Customization Ideas

```
Color Theme:
  search for: bg-blue, text-white
  change to: bg-purple, text-yellow

AI Personality:
  edit: server/services/gemini.ts
  change: prompts & tone

Add Feature:
  create: client/src/pages/FeatureName.tsx
  add route in: App.tsx
  wire up: Use UnstuckContext

Add Language:
  modify: VAD language setting
  modify: Gemini system prompt
  test: voiceLanguage parameter
```

---

## 🐛 Debug Like a Pro

```
Chrome DevTools (F12):
├─ Console → See all logs/errors
├─ Network → Watch API calls
├─ Elements → Inspect DOM/elements
├─ Sources → Set breakpoints
└─ Application → Check storage

Check Server:
├─ npm run dev (in server folder)
├─ Watch console for requests
├─ Check env vars loaded
└─ Use Postman to test endpoints

Check Client:
├─ npm run dev (in client folder)
├─ Console for JavaScript errors
├─ Network tab for API calls
├─ Open ChatWidget and test
└─ Browser permissions for mic

Common Checks:
□ API keys correct?
□ API key in right env vars?
□ Both servers running?
□ Microphone permission granted?
□ Using HTTPS for TTS?
```

---

## 📚 Learning Resources (Bookmarks)

```
React:                    https://react.dev
TypeScript:               https://www.typescriptlang.org/docs
TailwindCSS:              https://tailwindcss.com/docs
Shadcn/UI:                https://ui.shadcn.com/docs
React Router:             https://reactrouter.com
TanStack Query:           https://tanstack.com/query

Hono:                     https://hono.dev
Cloudflare Workers:       https://developers.cloudflare.com/workers
Google Gemini:            https://ai.google.dev
OpenAI Whisper:           https://platform.openai.com/docs/api-reference/audio
ElevenLabs:               https://elevenlabs.io/docs

Web APIs:                 https://developer.mozilla.org
Node.js:                  https://nodejs.org/docs
```

---

## 🎓 One-Page Learning Path

```
Week 1: JavaScript & TypeScript Fundamentals
  → MDN Guides (20-40 hrs)

Week 2-3: React Core
  → react.dev + Build projects (30-50 hrs)

Week 4: Advanced Frontend
  → React Router, Query, Context (25-40 hrs)

Week 5: Backend Basics
  → Node.js, Hono, Cloudflare (20-32 hrs)

Week 6: AI APIs
  → Gemini, Whisper, ElevenLabs (15-25 hrs)

Week 7: Project-Specific
  → DOM, Audio, Speech, Screenshots (20-30 hrs)

Week 8: Polish & Deploy
  → Performance, Deployment, Monitoring (15-20 hrs)

TOTAL: 140-237 hours (~4-6 weeks full time)
```

---

**Print this page and keep it on your desk! Reference it while learning. Good luck! 🚀**
