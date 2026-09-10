# Unstuck Project - Complete Guide & Documentation

## 🎯 Project Overview

**Unstuck** is a voice-guided website navigation assistant that uses AI to help users navigate any website with voice commands and on-screen guidance. It's a React component that can be embedded into any website with just **3 lines of code**.

### Key Features
- ✅ **Voice-to-Action Navigation** - Users ask questions/give commands via voice
- ✅ **Visual Guidance** - Highlights interactive elements on screen
- ✅ **AI-Powered** - Uses Google Gemini API to understand user intent
- ✅ **Screen Understanding** - Captures screenshots and analyzes DOM structure
- ✅ **Chat Interface** - Minimizable chat widget with voice support
- ✅ **Multi-language** - Supports multiple languages via Whisper API
- ✅ **Easy Integration** - Wrap your app with UnstuckProvider (3 lines of code)

---

## 📊 Complete Project Flow & Architecture

### **High-Level Flow Diagram**

```
User Request (Voice/Text)
    ↓
Voice Activity Detection (VAD) → Speech-to-Text (Whisper)
    ↓
Context Collection
├─ Screenshot Capture (html2canvas)
├─ DOM Analysis (sanitize & extract interactive elements)
└─ Sitemap Generation
    ↓
AI Analysis (Google Gemini)
├─ Analyzes user query
├─ Identifies relevant UI elements
└─ Plans action sequence
    ↓
Action Execution
├─ Highlights elements (GhostCursor)
├─ Performs clicks/interactions
└─ Captures new screen state
    ↓
Text-to-Speech Response (ElevenLabs API)
    ↓
Display Results & Next Steps
```

### **System Architecture Layers**

```
┌─────────────────────────────────────────────────────┐
│          Frontend (React Client)                    │
│  ┌──────────────────────────────────────────────┐   │
│  │  App.tsx (Main Application)                  │   │
│  │  ├─ Multiple Pages (Index, BookingDetails)   │   │
│  │  ├─ Contexts (Currency, Unstuck)             │   │
│  │  └─ Routes (React Router)                    │   │
│  │                                              │   │
│  │  ChatWidget Component                        │   │
│  │  ├─ Voice Input (VAD + Audio Capture)        │   │
│  │  ├─ UI State Management                      │   │
│  │  ├─ Chat History                             │   │
│  │  └─ Call Management                          │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  UnstuckContext Provider                            │
│  ├─ DOM Analysis & Extraction                      │
│  ├─ Screenshot Management                         │
│  ├─ Query Processing                              │
│  └─ Interactive Element Tracking                  │
└─────────────────────────────────────────────────────┘
            ↓ REST API ↓
┌─────────────────────────────────────────────────────┐
│       Backend (Cloudflare Workers)                  │
│                                                     │
│  API Endpoints:                                    │
│  • POST /asr (Audio-to-Text)                       │
│  • POST /analyze (Query Analysis)                  │
│  • POST /tts (Text-to-Speech)                      │
│  • GET /health                                     │
│                                                     │
│  Services:                                         │
│  • Gemini Service (Query Analysis)                 │
│  • Whisper API (Speech Recognition)                │
│  • ElevenLabs (Text-to-Speech)                     │
│  • FAL AI (Image Processing)                       │
└─────────────────────────────────────────────────────┘
            ↓ External APIs ↓
┌─────────────────────────────────────────────────────┐
│       Third-Party Services                         │
│  • Google Gemini API (AI Analysis)                  │
│  • OpenAI Whisper (Speech-to-Text)                  │
│  • ElevenLabs API (Text-to-Speech)                  │
│  • FAL AI (Image Processing)                       │
└─────────────────────────────────────────────────────┘
```

### **Detailed Flow Steps**

#### **1. Initialization**
```typescript
// User wraps app with UnstuckProvider
<UnstuckProvider config={{ apiKey, serverUrl }}>
  <App />
</UnstuckProvider>

// UnstuckContext initializes:
// - Scans DOM for interactive elements
// - Assigns unique IDs to elements
// - Sets up event listeners
```

#### **2. User Interaction (Voice Input)**
```
User clicks "Help" or activates voice
    ↓
Voice Activity Detection triggers
    ↓
Audio captured as WebM/Opus format
    ↓
Audio sent to server (/asr endpoint)
    ↓
Whisper API transcribes to text
    ↓
Text processed by chatbot
```

#### **3. Context Gathering**
```
Current DOM → Sanitized & Analyzed
    ↓
Interactive elements extracted with IDs
    ↓
Screenshot captured with html2canvas
    ↓
Sitemap of website generated
    ↓
All packaged into context object
```

#### **4. AI Analysis (Gemini)**
```
System receives:
{
  userQuery: "Find me a property in New York",
  screenshot: "base64_encoded_image",
  domString: "sanitized_HTML",
  sitemap: "website_structure",
  previousMessages: ["chat_history"]
}
    ↓
Gemini analyzes and returns:
{
  reasoning: "Step-by-step analysis",
  actions: ["element-id-1", "element-id-2"],
  narration: "User-friendly description",
  taskAccomplished: boolean
}
```

#### **5. Action Execution**
```
For each action ID:
    ↓
Locate element in DOM
    ↓
Show cursor highlight (GhostCursor)
    ↓
Animate to element
    ↓
Execute interaction (click/type)
    ↓
Capture new screenshot
    ↓
Show progress to user
```

#### **6. Response Generation**
```
Narration text → ElevenLabs TTS
    ↓
Audio synthesized (with natural voice)
    ↓
Played to user
    ↓
Chat message displayed
    ↓
UI updates with current state
```

---

## 🛠️ Tech Stack & Skills Required

### **Frontend Stack**

| Technology | Purpose | Skill Level |
|-----------|---------|------------|
| **React 18** | UI Framework | ⭐⭐⭐ Advanced |
| **TypeScript** | Type Safety | ⭐⭐⭐ Advanced |
| **Vite** | Build Tool | ⭐⭐ Intermediate |
| **TailwindCSS** | Styling | ⭐⭐ Intermediate |
| **Shadcn/UI** | Component Library | ⭐⭐ Intermediate |
| **Radix UI** | Accessible Primitives | ⭐⭐ Intermediate |
| **React Router** | Client-side Routing | ⭐⭐⭐ Advanced |
| **TanStack Query** | Data Fetching | ⭐⭐⭐ Advanced |
| **React Hook Form** | Form Management | ⭐⭐ Intermediate |
| **html2canvas** | Screenshot Capture | ⭐⭐ Intermediate |
| **VAD React** | Voice Activity Detection | ⭐⭐⭐ Advanced |
| **ElevenLabs React** | Text-to-Speech | ⭐⭐ Intermediate |

### **Backend Stack**

| Technology | Purpose | Skill Level |
|-----------|---------|------------|
| **Hono** | Web Framework (Cloudflare) | ⭐⭐ Intermediate |
| **Cloudflare Workers** | Serverless Compute | ⭐⭐⭐ Advanced |
| **OpenAI SDK** | Gemini API Integration | ⭐⭐ Intermediate |
| **FAL AI Client** | Image Processing | ⭐ Beginner |
| **Wrangler** | CF Workers CLI | ⭐ Beginner |

### **External APIs**

| Service | Function | Pricing |
|---------|----------|---------|
| **Google Gemini API** | AI Query Analysis | ~$0.075/1M input tokens |
| **OpenAI Whisper** | Speech-to-Text | $0.02/min audio |
| **ElevenLabs** | Text-to-Speech | Credits-based (~$0.30/1k chars) |
| **FAL AI** | Image Processing | Pay-per-call (~$0.001-0.01) |

### **Required Developer Skills**

```
ESSENTIAL (Must Know)
├─ JavaScript/TypeScript fundamentals
├─ React hooks and component lifecycle
├─ DOM manipulation and events
├─ REST API integration
├─ Async/await and promises
└─ Git version control

IMPORTANT (Should Know)
├─ React Context API
├─ Form handling and validation
├─ CSS/Styling with Tailwind
├─ API design principles
├─ Browser APIs (MediaRecorder, Canvas)
└─ Debugging tools

NICE-TO-HAVE (Good to Know)
├─ WebRTC basics
├─ Audio processing
├─ Cloud deployment (Cloudflare)
├─ Advanced TypeScript generics
├─ Performance optimization
└─ Accessibility (a11y)
```

---

## 📋 Requirements to Start Development

### **System Requirements**

```
Hardware:
├─ 8GB RAM minimum (16GB recommended)
├─ 5GB disk space
└─ Modern processor

Operating System:
├─ Windows 10+, macOS 10.15+, or Linux
└─ Admin access for installations

Browser:
├─ Chrome/Brave 90+
├─ Firefox 88+
├─ Safari 14.1+
└─ Must support WebRTC & MediaRecorder
```

### **Software Prerequisites**

```
Required:
├─ Node.js 18+ (LTS recommended)
├─ npm 9+ or bun 1.0+
├─ Git 2.30+
└─ Text editor or IDE (VS Code recommended)

Recommended:
├─ VS Code extensions:
│  ├─ ES7+ React/Redux/React-Native snippets
│  ├─ Tailwind CSS IntelliSense
│  ├─ TypeScript Vue Plugin
│  ├─ Prettier - Code formatter
│  └─ ESLint
├─ Chrome DevTools
├─ Postman (API testing)
└─ Figma (design reference)
```

### **API Keys & Credentials**

```
Required APIs (Create accounts):
├─ Google Cloud (for Gemini API)
│  └─ Generate API key (free tier: 60 requests/min)
├─ Cloudflare (for Workers hosting)
│  └─ Account & API token
├─ ElevenLabs (for Text-to-Speech)
│  └─ API key (free tier: 10k characters/month)
├─ FAL AI (for image processing)
│  └─ API key
└─ OpenAI (for Whisper API - if using separately)
    └─ API key
```

### **Project Setup Instructions**

#### **Step 1: Clone & Install**
```bash
# Clone repository
git clone https://github.com/your-repo/unstuck.git
cd unstuck

# Install root dependencies
npm install
# or
bun install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

#### **Step 2: Environment Configuration**

**.env (Client - client/.env.local)**
```env
VITE_API_URL=http://localhost:8787
VITE_GEMINI_API_KEY=your_gemini_key_here
```

**.env (Server - server/.dev.vars)**
```env
GEMINI_API_KEY=your_gemini_key
ELEVENLABS_API_KEY=your_elevenlabs_key
FAL_API_KEY=your_fal_ai_key
```

#### **Step 3: Start Development**

```bash
# Terminal 1: Start backend server
cd server
npm run dev
# Runs on http://localhost:8787

# Terminal 2: Start frontend development
cd client
npm run dev
# Runs on http://localhost:5173
```

#### **Step 4: Build & Deploy**

```bash
# Build client for production
cd client
npm run build

# Deploy server to Cloudflare
cd ../server
npm run deploy
```

---

## 🔌 Integration - 3 Lines of Code!

### **Step 1: Wrap Your App**

```jsx
// src/main.tsx or src/index.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { UnstuckProvider } from './contexts/UnstuckContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UnstuckProvider 
      config={{
        apiKey: import.meta.env.VITE_GEMINI_API_KEY,
        serverUrl: import.meta.env.VITE_API_URL,
      }}
    >
      <App />
    </UnstuckProvider>
  </React.StrictMode>,
)
```

### **Step 2: Import ChatWidget (Already Done)**

The ChatWidget is automatically injected by UnstuckContext. It appears as a floating button on the page.

### **Result: 3 Lines of Code!**

```jsx
// That's it! Users can now:
// ✅ Click the "Need Help?" button
// ✅ Ask questions via voice or text
// ✅ Get AI-guided navigation
// ✅ Automatically click through steps
// ✅ Reach their destination faster
```

---

## 📁 Project File Structure Deep Dive

```
unstuck-main/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                    # Shadcn/UI components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   └── ... (40+ UI components)
│   │   │   │
│   │   │   ├── unstuck/
│   │   │   │   └── chat/
│   │   │   │       ├── ChatWidget.tsx         # Main chat component
│   │   │   │       ├── MaximizedChat.tsx      # Full screen chat
│   │   │   │       ├── MinimizedChat.tsx      # Minimized widget
│   │   │   │       ├── NeedHelpButton.tsx     # Trigger button
│   │   │   │       └── types.ts               # Type definitions
│   │   │   │
│   │   │   ├── Filters.tsx            # Property filters
│   │   │   ├── ListingCard.tsx         # Listing display
│   │   │   ├── Navbar.tsx              # Navigation bar
│   │   │   └── WorkflowCreator.tsx     # Workflow UI
│   │   │
│   │   ├── contexts/
│   │   │   ├── UnstuckContext.tsx      # 🔑 Core provider
│   │   │   │   ├─ DOM analysis
│   │   │   │   ├─ Element extraction
│   │   │   │   ├─ Screenshot capture
│   │   │   │   └─ API communication
│   │   │   └── CurrencyContext.tsx     # Currency state
│   │   │
│   │   ├── lib/
│   │   │   ├── extract.ts              # Parse AI responses
│   │   │   ├── BoundingBoxHighlight.ts # Draw element boxes
│   │   │   ├── GhostCursor.ts          # Animated cursor
│   │   │   ├── sanitize.ts             # Clean HTML
│   │   │   └── utils.ts                # Common utilities
│   │   │
│   │   ├── pages/
│   │   │   ├── Index.tsx               # Home page
│   │   │   ├── PropertyDetails.tsx     # Property info
│   │   │   ├── BookingDetails.tsx      # Booking details
│   │   │   ├── BookingHistory.tsx      # User history
│   │   │   ├── Settings.tsx            # User settings
│   │   │   ├── Support.tsx             # Support page
│   │   │   └── NotFound.tsx            # 404 page
│   │   │
│   │   ├── hooks/
│   │   │   ├── use-mobile.tsx          # Mobile detection
│   │   │   └── use-toast.ts            # Toast notifications
│   │   │
│   │   ├── utils/
│   │   │   ├── screenshot.ts           # Screenshot capture
│   │   │   └── siteMetadata.ts         # Sitemap generation
│   │   │
│   │   ├── data/
│   │   │   ├── mockListings.ts         # Sample property data
│   │   │   └── mockBookingHistory.ts   # Sample booking data
│   │   │
│   │   ├── App.tsx                     # Main app component
│   │   ├── main.tsx                    # Entry point
│   │   └── index.css                   # Global styles
│   │
│   ├── vite.config.ts                  # Vite configuration
│   ├── tsconfig.json                   # TypeScript config
│   ├── tailwind.config.ts              # Tailwind config
│   ├── postcss.config.js               # PostCSS config
│   ├── eslint.config.js                # ESLint config
│   ├── components.json                 # Shadcn config
│   ├── package.json                    # Dependencies
│   └── index.html                      # HTML template
│
├── server/
│   ├── src/
│   │   ├── index.ts                    # 🔑 Main server file
│   │   │   ├─ Hono app setup
│   │   │   ├─ CORS configuration
│   │   │   ├─ API endpoints
│   │   │   │  ├─ POST /asr (speech-to-text)
│   │   │   │  ├─ POST /analyze (query analysis)
│   │   │   │  └─ POST /tts (text-to-speech)
│   │   │   └─ Error handling
│   │   │
│   │   └── services/
│   │       └── gemini.ts               # 🔑 AI service
│   │           ├─ processQuery()
│   │           └─ Gemini API integration
│   │
│   ├── wrangler.jsonc                  # Cloudflare config
│   ├── tsconfig.json                   # TypeScript config
│   ├── package.json                    # Dependencies
│   └── .dev.vars.template              # Env vars template
│
├── package.json                        # Root package config
├── bun.lockb                           # Bun lock file
└── PROJECT_GUIDE.md                    # 📄 This file!
```

---

## 🔄 Data Flow Examples

### **Example 1: User Voice Query**

```
Input: User says "Show me bookings"
       ↓
VAD Detection → Audio captured
       ↓
POST /asr
```
Server Endpoint:
```json
{
  "audio_data": "base64_encoded_webm",
  "language": "en"
}
```
Response:
```json
{
  "text": "Show me bookings",
  "confidence": 0.95
}
```
       ↓
POST /analyze
```json
{
  "userQuery": "Show me bookings",
  "screenshot": "base64_image",
  "domString": "<sanitized_html>",
  "previousMessages": [],
  "sitemap": "website_structure"
}
```
Response (from Gemini API):
```json
{
  "reasoning": "User wants to see booking history. I found the 'Booking History' link in the navbar.",
  "actions": ["navbar-div-a-5"],
  "narration": "Let me take you to your booking history!",
  "taskAccomplished": false
}
```
       ↓
ChatWidget executes action (clicks element)
       ↓
POST /tts
```json
{
  "text": "Let me take you to your booking history!"
}
```
Response:
```json
{
  "audio": "base64_audio_data",
  "mimeType": "audio/mpeg"
}
```
       ↓
Audio played, UI updated
```

### **Example 2: Complex Multi-Step Navigation**

```
Input: "Find me the cheapest property in New York"
       ↓
POST /analyze (Step 1)
Response: "Click Search button"
       ↓
Execute Action #1
       ↓
Screenshot updated
       ↓
POST /analyze (Step 2)
Response: "Type 'New York' in search box"
       ↓
Execute Action #2
       ↓
Screenshot updated
       ↓
POST /analyze (Step 3)
Response: "Click filter by price - lowest first"
       ↓
Execute Action #3
       ↓
Screenshot updated
       ↓
POST /analyze (Step 4)
Response: "Success! Found properties sorted by price"
       ↓
taskAccomplished: true
```

---

## 🎨 UI Components & States

### **ChatWidget States**

```
1. CLOSED
   └─ Shows "Need Help?" floating button
   └─ Click to open

2. MINIMIZED
   └─ Shows compact chat window
   └─ Shows chat history
   └─ Input field visible
   └─ Can expand to full screen

3. MAXIMIZED
   └─ Full screen chat interface
   └─ Large message display
   └─ Full input area
   └─ Can minimize

4. LOADING
   └─ Shows "Analyzing..." message
   └─ Spinner animation
   └─ Prevents user input

5. ERROR
   └─ Shows error message
   └─ Retry button
   └─ Back to minimized state option
```

### **Key Component Props & Context**

```typescript
// UnstuckContext provides:
interface UnstuckContextType {
  // DOM element tracking
  interactives: InteractiveElement[];
  
  // Configuration
  apiKey: string;
  serverUrl: string;
  
  // Context gathering
  getCurrentContext: () => Promise<{
    domString: string;
    screenshot: string;
    userQuery: string | null;
  }>;
  
  // Chat history
  previousMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  setUserQuery: (query: string) => void;
  setPreviousMessages: (messages: ...) => void;
}

// ChatWidget receives context and manages:
├─ Voice input (VAD)
├─ Chat state
├─ Message history
├─ Loading states
├─ Error handling
└─ UI animations
```

---

## 🚀 Deployment Guide

### **Frontend (Vite Build)**

```bash
# Build production bundle
npm run build

# Output: dist/ folder with optimized files
# Size: ~500KB gzipped (with all components)

# Deploy to:
├─ Vercel        (recommended)
├─ Netlify
├─ GitHub Pages
├─ AWS S3
└─ Cloudflare Pages
```

### **Backend (Cloudflare Workers)**

```bash
# Deploy server
npm run deploy

# Environment setup in Cloudflare Dashboard:
├─ GEMINI_API_KEY
├─ ELEVENLABS_API_KEY
└─ FAL_API_KEY

# Your API becomes available at:
https://your-worker-name.workers.dev
```

---

## 📊 Performance Metrics

```
Frontend Performance:
├─ Initial Load: 2-3s (from CDN)
├─ Screenshot Capture: 500-800ms
├─ DOM Analysis: 100-200ms
└─ Total Time to First Response: 2-3 seconds

Backend Performance:
├─ Whisper API: 2-5s (depends on audio length)
├─ Gemini Analysis: 1-3s
├─ ElevenLabs TTS: 500ms-1s
└─ Total Response Time: 5-10 seconds

Optimization Tips:
├─ Use image compression
├─ Lazy load components
├─ Cache DOM analysis
├─ Batch API requests
└─ Implement request debouncing
```

---

## 🛡️ Security Considerations

```
API Key Security:
├─ ✅ Never expose API keys in frontend code
├─ ✅ Use server-side proxies only
├─ ✅ Implement request validation
├─ ✅ Rate limit API calls
└─ ✅ Rotate keys regularly

Data Privacy:
├─ ✅ Don't log personal information
├─ ✅ Encrypt sensitive data in transit
├─ ✅ Implement CORS properly
├─ ✅ Sanitize DOM before sending
└─ ✅ Clear chat history on logout

DOM Sanitization:
├─ ✅ Remove script tags
├─ ✅ Strip inline event listeners
├─ ✅ Remove sensitive attributes
└─ ✅ Keep only structure & labels
```

---

## 🐛 Common Issues & Solutions

### **Issue 1: Voice Detection Not Working**

```
Problem: No audio input
Solution:
├─ Check browser permissions (microphone)
├─ Ensure HTTPS (required for mediarecorder)
├─ Check VAD library version
└─ Test in chrome first (best support)
```

### **Issue 2: Gemini API Rate Limiting**

```
Problem: 429 Too Many Requests
Solution:
├─ Implement exponential backoff
├─ Add request throttling
├─ Upgrade API quota
└─ Cache responses with React Query
```

### **Issue 3: Screenshot Capture Issues**

```
Problem: Blank or incorrect screenshots
Solution:
├─ Wait for async images to load
├─ Use allowTaint: true in html2canvas
├─ Check z-index conflicts
└─ Test with simple elements first
```

---

## 📚 Learning Resources

```
React & TypeScript:
├─ Official React Docs: https://react.dev
├─ TypeScript Handbook: https://www.typescriptlang.org/docs/
└─ Advanced Patterns: https://epic-react.dev

Frameworks & Tools:
├─ Vite Guide: https://vitejs.dev/guide/
├─ Tailwind CSS: https://tailwindcss.com/docs
└─ Shadcn/UI: https://ui.shadcn.com/docs

APIs & Services:
├─ Google Gemini API: https://ai.google.dev/tutorials
├─ OpenAI Whisper: https://platform.openai.com/docs/api-reference/audio
├─ ElevenLabs: https://elevenlabs.io/docs
└─ Hono Framework: https://hono.dev/

Advanced Topics:
├─ WebRTC: https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API
├─ Audio Processing: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
└─ Cloudflare Workers: https://developers.cloudflare.com/workers/
```

---

## ✅ Development Checklist

```
[ ] Node.js 18+ installed
[ ] API keys obtained (Gemini, ElevenLabs, FAL)
[ ] Repository cloned
[ ] Dependencies installed
[ ] Environment variables configured
[ ] Local dev server running (backend)
[ ] Frontend dev server running
[ ] ChatWidget appearing on page
[ ] Voice input working
[ ] Microphone permissions granted
[ ] First query executing successfully
[ ] Actions executing on page
[ ] Text-to-speech working
[ ] Error handling tested
[ ] Build successful
[ ] Ready for deployment!
```

---

## 🎓 Next Steps to Get Started

### **Week 1: Setup & Understanding**
- [ ] Clone repository and install dependencies
- [ ] Configure all API keys
- [ ] Run both servers locally
- [ ] Test basic voice input
- [ ] Study the ChatWidget component

### **Week 2: Customization**
- [ ] Customize UI colors/styling
- [ ] Add custom prompts for Gemini
- [ ] Implement custom analytics
- [ ] Add more language support
- [ ] Create custom voice presets

### **Week 3: Enhancement**
- [ ] Add more interactive features
- [ ] Optimize performance
- [ ] Implement caching
- [ ] Add user preferences/settings
- [ ] Create admin dashboard

### **Week 4: Deployment & Scaling**
- [ ] Deploy to production
- [ ] Set up analytics/monitoring
- [ ] Implement error tracking (Sentry)
- [ ] Load testing
- [ ] Scale infrastructure

---

## 📞 Support & Community

```
Documentation: See architecture.md
GitHub Issues: Report bugs and feature requests
Community Chat: Discuss with other developers
Email: support@getunstuck.com
```

---

**Created**: March 31, 2026
**Project Version**: 1.0.0
**Last Updated**: [Today's Date]

---

*This is a comprehensive guide for the Unstuck project. Use this document to onboard new developers and understand the complete project architecture.*
