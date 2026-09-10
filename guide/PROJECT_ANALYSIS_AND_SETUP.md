# UNSTUCK Project - Complete Analysis & Current Setup Guide

## 🎯 Project Overview

**Unstuck** is an intelligent voice-based website navigation assistant that uses AI to help users navigate any website without getting stuck or confused. It works by:

1. **Listening** to user voice commands or text queries
2. **Understanding** what the user wants to accomplish
3. **Analyzing** the current webpage and its interactive elements
4. **Planning** the optimal sequence of clicks/actions
5. **Guiding** the user visually with cursor animations and highlights
6. **Executing** the actions automatically
7. **Speaking** back natural language responses using text-to-speech

Currently, it's implemented as a React component that can be embedded in any React application (demonstrated on a travel website).

---

## 📋 Current Project Structure Analysis

### Root Files
```
unstuck-main/
├── QUICK_START.md              # 10-minute setup guide
├── GETTING_STARTED.md          # Step-by-step tutorial
├── PROJECT_GUIDE.md            # Complete project documentation
├── README_DOCS.md              # Documentation index
├── TECH_SKILLS_ROADMAP.md      # Learning path for new developers
├── VISUAL_REFERENCE.md         # Quick visual reference
├── package.json                # Root package (monorepo setup with bun)
└── bun.lockb                   # Bun package lock file
```

### Client Folder (`/client`)
**Purpose**: React frontend application (Travel booking site with Unstuck AI widget)

```
client/
├── package.json                # Frontend dependencies
├── vite.config.ts             # Vite build configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── index.html                 # Entry HTML file
├── components.json            # Shadcn/UI component config
├── eslint.config.js           # ESLint configuration
│
├── src/
│   ├── App.tsx                # Main app component (entry point)
│   ├── main.tsx               # React root
│   ├── App.css                # App styles
│   ├── index.css              # Global styles
│   ├── vite-env.d.ts          # Vite type definitions
│   │
│   ├── components/
│   │   ├── Navbar.tsx         # Navigation bar
│   │   ├── Filters.tsx        # Property filters
│   │   ├── ListingCard.tsx    # Property card display
│   │   ├── WorkflowCreator.tsx # ⭐ Auto-click executor with visual guidance
│   │   │
│   │   ├── unstuck/
│   │   │   └── chat/
│   │   │       ├── ChatWidget.tsx          # ⭐ Main chat interface
│   │   │       ├── MaximizedChat.tsx       # Full chat view
│   │   │       ├── MinimizedChat.tsx       # Minimized chat view
│   │   │       ├── NeedHelpButton.tsx      # Floating help button
│   │   │       └── types.ts                # Chat type definitions
│   │   │
│   │   └── ui/                # Shadcn/UI components (40+ components)
│   │       ├── button.tsx, input.tsx, form.tsx, etc.
│   │       ├── alert.tsx, dialog.tsx, popover.tsx
│   │       └── sonner.tsx (toast notifications)
│   │
│   ├── contexts/
│   │   ├── UnstuckContext.tsx   # ⭐ Core AI navigation logic provider
│   │   ├── CurrencyContext.tsx  # Currency exchange context
│   │
│   ├── hooks/
│   │   ├── use-toast.ts       # Toast notification hook
│   │   └── use-mobile.tsx     # Mobile detection hook
│   │
│   ├── lib/
│   │   ├── extract.ts         # Parse Gemini API responses into actions
│   │   ├── GhostCursor.ts     # ⭐ Animated cursor that moves to elements
│   │   ├── BoundingBoxHighlight.ts  # ⭐ Highlight boxes around elements
│   │   ├── sanitize.ts        # Sanitize DOM for AI analysis
│   │   └── utils.ts           # General utility functions
│   │
│   ├── pages/
│   │   ├── Index.tsx          # Homepage with property listings
│   │   ├── PropertyDetails.tsx # Single property view
│   │   ├── BookingDetails.tsx  # Booking details view
│   │   ├── BookingHistory.tsx  # User booking history
│   │   ├── Settings.tsx       # User settings
│   │   ├── Support.tsx        # Support page
│   │   └── NotFound.tsx       # 404 page
│   │
│   ├── data/
│   │   ├── mockBookingHistory.ts # Sample booking data
│   │   └── mockListings.ts       # Sample property listings
│   │
│   ├── utils/
│   │   ├── screenshot.ts      # Screenshot capture with html2canvas
│   │   └── siteMetadata.ts    # Generate website sitemap
│   │
│   └── public/                # Static assets
```

### Server Folder (`/server`)
**Purpose**: Cloudflare Workers serverless backend

```
server/
├── package.json               # Backend dependencies
├── tsconfig.json             # TypeScript config
├── wrangler.jsonc            # Cloudflare Wrangler config
├── .dev.vars.template        # Template for environment variables
│
└── src/
    ├── index.ts              # ⭐ Main API routes (Hono server)
    │   ├── POST /asr         # Speech-to-text endpoint
    │   ├── POST /analyze     # AI query analysis
    │   ├── POST /tts         # Text-to-speech endpoint
    │   └── GET /            # Health check
    │
    └── services/
        └── gemini.ts         # ⭐ AI analysis service (core logic)
```

---

## 🔌 How It Works - Complete Data Flow

### Step 1: User Interaction
```
User clicks "Need Help?" button or says wake word
         ↓
ChatWidget opens and enables microphone access
         ↓
VAD (Voice Activity Detection) listens for speech
```

### Step 2: Voice Input Processing
```
User speaks: "Find me a property in New York"
         ↓
@ricky0123/vad-react detects voice
         ↓
Audio converted to WebM/Opus format
         ↓
Sent to /asr endpoint via: fetch(`${serverUrl}/asr`, {...})
         ↓
Backend calls FAL AI Whisper API
         ↓
Returns: { text: "Find me a property in New York" }
```

### Step 3: Context Gathering
```
UnstuckContext.getCurrentContext() is called
         ↓
Collects:
├─ Screenshot (via html2canvas)
├─ DOM structure (via sanitizeDom)
├─ Sitemap (via getSitemap)
├─ Interactive element IDs (from DOM mutation observer)
└─ Chat history (previousMessages)
```

### Step 4: AI Analysis (Gemini)
```
Request to /analyze endpoint with:
{
  userQuery: "Find me a property in New York",
  screenshot: "base64_image",
  domString: "sanitized_html",
  sitemap: "website_structure",
  previousMessages: []
}
         ↓
Backend calls Google Gemini 2.0 Flash API with system prompt:
"You are an AI assistant designed to help users navigate this website.
Analyze the user query and DOM structure.
Return step-by-step actions as data-unstuck-id values."
         ↓
Gemini analyzes and returns:
{
  "reasoning": "The user wants to search for properties in New York...",
  "actions": ["button-search-1", "input-location-2", "button-submit-3"],
  "narration": "I'll help you search for properties in New York.",
  "taskAccomplished": false
}
```

### Step 5: Element Identification & Preparation
```
WorkflowCreator component receives firstAction: "button-search-1"
         ↓
Finds element with data-unstuck-id="button-search-1"
         ↓
Calculates bounding box and coordinates
         ↓
Scrolls to make element visible
```

### Step 6: Visual Guidance
```
GhostCursor animates from current position to element
         ↓
BoundingBoxHighlight shows red box around element
         ↓
Bounding box pulses to draw attention
```

### Step 7: Action Execution
```
Click executed on element
         ↓
Wait for page to stabilize (mutations settle)
         ↓
New screenshot captured
         ↓
Loop back to Step 4 if taskAccomplished = false
```

### Step 8: Agent Loop Continues
```
Multiple iterations until taskAccomplished = true
Each iteration:
1. New screenshot
2. New Gemini analysis
3. Next action extracted
4. Element found and clicked
5. Result feedback to user
```

### Step 9: Response to User
```
When taskAccomplished = true
         ↓
Final narration generated
         ↓
Sent to /tts endpoint
         ↓
ElevenLabs converts to speech
         ↓
Audio played through speaker
         ↓
Success message displayed in chat
```

---

## 🔑 API Keys & Services Required

### 1. Google Gemini API
**What it does**: Understands user queries and plans action sequences
**Where to get**: [Google AI Studio](https://aistudio.google.com/)
**Cost**: ~$0.075 per 1 million input tokens
**Setup**:
1. Go to aistudio.google.com
2. Click "Get API Key"
3. Create new project or select existing
4. Generate API key
5. Copy key to `.dev.vars` (server)

**Usage in code**:
```typescript
// server/src/services/gemini.ts
const openai = new OpenAI({
  apiKey: "sk-proj-xxxxxxxx...",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// Uses OpenAI SDK but with Gemini endpoint!
const completion = await openai.chat.completions.create({
  model: "gemini-2.0-flash",
  messages: [...]
});
```

### 2. ElevenLabs API
**What it does**: Converts text responses to natural speech
**Where to get**: [ElevenLabs Dashboard](https://elevenlabs.io/)
**Cost**: ~$0.30 per 1000 characters synthesized
**Setup**:
1. Sign up at elevenlabs.io
2. Go to dashboard → API Keys
3. Copy API key
4. Add to `.dev.vars`
5. Choose a voice ID (default: iP95p4xoKVk53GoZ742B)

**Usage in code**:
```typescript
// server/src/index.ts - POST /tts endpoint
const response = await fetch(
  "https://api.elevenlabs.io/v1/text-to-speech/" + VOICE_ID,
  {
    method: "POST",
    headers: {
      "xi-api-key": c.env.ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text: "I'll help you find a property",
      model_id: "eleven_monolingual_v1",
    }),
  }
);
```

### 3. FAL AI (for Whisper Speech-to-Text)
**What it does**: Converts voice to text (audio transcription)
**Where to get**: [FAL AI Dashboard](https://fal.ai/)
**Cost**: ~$0.02 per minute of audio
**Setup**:
1. Sign up at fal.ai
2. Go to API Keys
3. Create and copy API key
4. Add to `.dev.vars`

**Usage in code**:
```typescript
// server/src/index.ts - POST /asr endpoint
const result = await fal.subscribe("fal-ai/wizper", {
  input: {
    audio_url: audioUrl,
    task: "transcribe",
    language: "en",
  },
});

return { text: result.data.text };
```

---

## 📦 Installation & Setup Instructions

### Prerequisites
```
✅ Node.js 18+ (LTS recommended)
✅ npm 9+ or bun 1.0+
✅ Git
✅ VS Code or any editor
✅ Chrome browser (for testing)
✅ All 3 API keys obtained
```

### Step 1: Clone and Install
```bash
# Clone the repository
git clone <your-repo-url> unstuck
cd unstuck

# Install root dependencies (if using bun)
bun install

# OR with npm
npm install
```

### Step 2: Setup Client
```bash
cd client

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
VITE_API_URL=http://localhost:8787
EOF

# Optional (Gemini API for client-side calls)
# VITE_GEMINI_API_KEY=sk-proj-xxxxxxxx
```

### Step 3: Setup Server
```bash
cd ../server

# Install dependencies
npm install

# Create .dev.vars file with API keys
cat > .dev.vars << EOF
GEMINI_API_KEY=sk-proj-xxxxxxxx
ELEVENLABS_API_KEY=sk_xxxxxxx_xxxxxxx
FAL_API_KEY=xxxxx-xxxxx-xxxxx-xxxxx-xxxxx
EOF
```

### Step 4: Run Locally
```bash
# Terminal 1 - Start backend
cd server
npm run dev
# Runs on http://localhost:8787

# Terminal 2 - Start frontend
cd client
npm run dev
# Runs on http://localhost:5173
```

### Step 5: Test
1. Open `http://localhost:5173` in browser
2. Look for property listings
3. Click "Need Help?" button (bottom-right)
4. Say "Find a property in New York"
5. Watch as AI guides you through the website

---

## 🏗️ Architecture Deep Dive

### Frontend Architecture

```
┌────────────────────────────────────────────────────────┐
│                 App.tsx (Root)                         │
│  Providers:                                            │
│  ├─ QueryClientProvider (TanStack Query)               │
│  ├─ TooltipProvider (UI)                               │
│  ├─ CurrencyProvider (Currency context)                │
│  └─ UnstuckProvider (AI Navigation)                    │
└────────────┬───────────────────────────────────────────┘
             │
      ┌──────▼──────────┐
      │ UnstuckProvider │
      ├─────────────────┤
      │ • DOM scanner   │ ← MutationObserver watches DOM
      │ • Element ID    │ ← Assigns data-unstuck-id to every button,
      │   assignment    │   input, link, etc.
      │ • Screenshot    │ ← Captures full page with html2canvas
      │   capture       │
      │ • Context       │ ← Gathers DOM, screenshot, chat history
      │   gathering     │
      │ • API calls     │ ← Calls backend /analyze, /asr, /tts
      └──────┬──────────┘
             │
      ┌──────▼──────────────┐
      │ ChatWidget.tsx      │
      ├─────────────────────┤
      │ • Voice Input (VAD) │ ← Listens to microphone
      │ • Chat UI           │ ← Shows messages
      │ • Agent Loop        │ ← Iteratively achieves goals
      │ • Error Handling    │ ← Shows errors to user
      └──────┬──────────────┘
             │
             └─────────────────┐
                               ▼
                    ┌──────────────────────┐
                    │ WorkflowCreator.tsx  │
                    ├──────────────────────┤
                    │ • Ghost Cursor       │ ← Animated cursor
                    │ • Bounding Box       │ ← Highlight elements
                    │ • Scrolling          │ ← Smooth scroll
                    │ • Clicking           │ ← Execute actions
                    │ • Wait for stability │ ← DOM ready check
                    └──────────────────────┘
```

### State Management Flow
```
UnstuckContext
├─ interactives: InteractiveElement[]  ← All clickable elements
├─ getCurrentContext(): Promise        ← Gather page state
├─ userQuery: string | null            ← Current user question
├─ previousMessages: ChatMessage[]     ← Chat history for context
├─ apiKey: string                      ← API authentication
└─ serverUrl: string                   ← Backend URL

ChatWidget State
├─ chatState: 'open' | 'closed' | 'minimized'
├─ chatMessages: ChatMessage[]         ← Visible chat
├─ isVoiceEnabled: boolean
├─ isRecording: boolean
├─ isCallActive: boolean              ← VAD is listening
├─ loading: LoadingState
└─ error: ErrorState
```

### Backend Architecture
```
┌─────────────────────────────────────────────┐
│ Hono Server (Cloudflare Workers)            │
├─────────────────────────────────────────────┤
│                                             │
│ POST /asr                                   │
│ ├─ Input: audio_data (base64), language    │
│ ├─ Upload to FAL storage                   │
│ ├─ Call fal-ai/wizper API                  │
│ └─ Return: { text, chunks }                │
│                                             │
│ POST /analyze                               │
│ ├─ Input: userQuery, screenshot, DOM,      │
│ │         previousMessages, sitemap         │
│ ├─ Call Gemini 2.0 Flash                   │
│ ├─ Parse response                          │
│ └─ Return: { result, messages }            │
│                                             │
│ POST /tts                                   │
│ ├─ Input: text                             │
│ ├─ Call ElevenLabs API                     │
│ └─ Return: audio blob (MP3)                │
│                                             │
│ GET /health                                 │
│ └─ Check if backend is running             │
│                                             │
└─────────────────────────────────────────────┘
        │ External API Calls
        ▼
┌──────────────────────┐
│ Google Gemini API    │
│ (AI Analysis)        │
└──────────────────────┘

┌──────────────────────┐
│ ElevenLabs API       │
│ (Text-to-Speech)     │
└──────────────────────┘

┌──────────────────────┐
│ FAL AI Whisper       │
│ (Speech-to-Text)     │
└──────────────────────┘
```

---

## 🔄 Agent Loop Explained

The core intelligence is in the **agent loop** - it keeps asking Gemini "what to do next?" until the task is complete.

```
Iteration 1:
- Screenshot captured
- DOM sent to Gemini
- Gemini says: "Click search button"
- Action: Click search button
- Wait for page update

Iteration 2:
- New screenshot captured
- DOM sent to Gemini (with chat history)
- Gemini says: "Type 'New York' in location field"
- Action: Type text
- Wait for page update

Iteration 3:
- New screenshot captured
- Gemini says: "Click search to find properties"
- Action: Click
- Wait for results to load

Iteration 4:
- New screenshot shows search results
- Gemini says: "Task accomplished! I found several properties in New York"
- taskAccomplished = true
- Loop exits
- TTS plays response
```

**Key Features**:
- Each iteration includes new screenshot (context-aware)
- Chat history maintained for continuity
- Loop continues until taskAccomplished = true
- Prevents infinite loops (max iterations configurable)
- Handles dynamic pages and SPAs

---

## 💾 Environment Files Reference

### `.dev.vars` (Server) - Template
```env
# Google Gemini API Key
# Get from: https://aistudio.google.com/
# Cost: ~$0.075 per 1M input tokens
GEMINI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx

# ElevenLabs API Key
# Get from: https://elevenlabs.io/
# Cost: ~$0.30 per 1k characters
# Used for Text-to-Speech
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxx

# FAL AI API Key
# Get from: https://fal.ai/
# Cost: ~$0.02 per minute of audio
# Used for Speech-to-Text (Whisper)
FAL_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### `.env.local` (Client)
```env
# Backend API URL (for development)
VITE_API_URL=http://localhost:8787

# Optional: Gemini API Key (if making client-side calls)
# Usually the backend handles this
VITE_GEMINI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📊 Key Files & Their Roles

| File | Purpose | Key Functions |
|------|---------|---------------|
| **App.tsx** | App entry point | Wraps with providers |
| **UnstuckContext.tsx** | Core logic provider | DOM scanning, context gathering |
| **ChatWidget.tsx** | Main UI component | Voice input, agent loop |
| **WorkflowCreator.tsx** | Visual guidance | Ghost cursor, clicking |
| **extract.ts** | Response parsing | Parses Gemini JSON |
| **GhostCursor.ts** | Cursor animation | Moves cursor to elements |
| **BoundingBoxHighlight.ts** | Visual highlight | Shows boxes around elements |
| **screenshot.ts** | Screenshot capture | Uses html2canvas |
| **siteMetadata.ts** | Sitemap generation | Creates website structure map |
| **sanitize.ts** | DOM sanitization | Cleans HTML for AI |
| **server/index.ts** | API routes | /asr, /analyze, /tts endpoints |
| **services/gemini.ts** | AI analysis | Calls Gemini API |

---

## 🎯 What Gets Sent to Gemini API

### Input to Gemini
```json
{
  "userQuery": "Find me a property under $200 in New York",
  "screenshot": "data:image/png;base64,iVBORw0KGgo...",
  "domString": "<!DOCTYPE html><html>...(sanitized HTML)...</html>",
  "sitemap": "Home → Browse → Search → Results → Details",
  "previousMessages": [
    { "role": "user", "content": "Find me a property" },
    { "role": "assistant", "content": "I'll help you search..." }
  ]
}
```

### Output from Gemini
```json
{
  "reasoning": "The user wants to find properties in NY under $200/night. I need to: 1) Click the search button 2) Enter location 3) Set price filter 4) Search",
  "actions": ["button-search-open-1", "input-location-2", "input-price-max-3", "button-search-submit-4"],
  "narration": "I'll help you find affordable properties in New York.",
  "taskAccomplished": false
}
```

---

## 🧪 Testing & Debugging

### Browser DevTools
- **Console**: Check for errors, see logs
- **Network**: Monitor API calls to backend
- **Elements**: Inspect element IDs assigned
- **Application**: Check localStorage for chat history

### Debugging Messages
- When VAD detects speech: "Speech detected, listening..."
- When sending to API: "Transcribing audio..."
- Gemini response: `parsedGemini:` logged to console
- Element clicks: Logged with element ID

### Common Issues
1. **Microphone not working**: Check browser permissions
2. **API key errors**: Verify .dev.vars and API validity
3. **Element not found**: Check data-unstuck-id assignment
4. **Timeouts**: API taking too long (Gemini can be slow)
5. **Navigation not working**: Page might have custom event listeners

---

## 📈 Performance Metrics

### Typical Flow Times
- VAD speech detection: ~500ms
- Audio transcription: 2-5 seconds
- Gemini analysis: 3-8 seconds
- Element finding: <100ms
- Screenshot capture: 1-2 seconds
- Ghost cursor animation: 2-3 seconds
- **Total per iteration**: 8-20 seconds

### Optimization Tips
- Cache screenshots when possible
- Debounce DOM mutations
- Lazy load UI components
- Batch message passing
- Use local storage for frequent data

---

## 🔐 Security Considerations

1. **API Keys**: Never expose in frontend code
   - Always keep in `.dev.vars` (server)
   - Use environment variables
   - For Chrome extension: Use chrome.storage

2. **DOM Sanitization**: Critical before sending to AI
   - Remove sensitive data (credit cards, emails)
   - Remove personal info
   - Keep sanitize.ts updated

3. **CORS Handling**: Backend handles CORS
   - Cloudflare Workers set headers
   - Frontend doesn't make direct API calls

4. **User Privacy**: 
   - Document what data is sent
   - Allow users to disable features
   - Implement data deletion

---

## ✅ Running Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] All 3 API keys obtained and verified
- [ ] `.dev.vars` created in server folder with all keys
- [ ] `.env.local` created in client folder
- [ ] Dependencies installed (`npm install` in both folders)
- [ ] Backend running on `http://localhost:8787`
- [ ] Frontend running on `http://localhost:5173`
- [ ] Can access frontend in browser
- [ ] Can click "Need Help?" button
- [ ] Can speak and hear responses
- [ ] AI successfully guides through website

