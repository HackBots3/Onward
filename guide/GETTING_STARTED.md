# Unstuck - Implementation Guide & Next Steps

## 🎯 Current Project State

### **What's Already Built ✅**

#### **Frontend (Client)**
```
✅ React + TypeScript + Vite setup
✅ Shadcn/UI component library (40+ components)
✅ TailwindCSS styling
✅ Multiple pages (Index, PropertyDetails, BookingHistory, etc.)
✅ ChatWidget component with:
   ✅ Voice input (VAD)
   ✅ Minimized/Maximized states
   ✅ Message history
   ✅ Loading states
✅ UnstuckContext for DOM analysis
✅ Element extraction & ID assignment
✅ Screenshot capture
✅ API integration
```

#### **Backend (Server)**
```
✅ Hono framework setup
✅ Cloudflare Workers configured
✅ API endpoints:
   ✅ /asr (Speech-to-Text)
   ✅ /analyze (Query Analysis)
   ✅ /tts (Text-to-Speech)
✅ Gemini API integration
✅ Environment configuration
✅ Error handling & CORS
```

#### **Features Working**
```
✅ Voice recording & transmission
✅ Speech-to-text conversion
✅ DOM element detection & labeling
✅ Screenshot capture
✅ AI query analysis
✅ Action sequence generation
✅ Text-to-speech narration
✅ Chat UI display
```

---

## 🚀 What You Need to Do

### **Phase 1: Setup & Running (Today - Tomorrow)**

#### **Task 1.1: Clone & Install**
```bash
# 1. Clone the repository
git clone <your-repo-url>
cd unstuck-main

# 2. Install root dependencies
npm install
# or: bun install

# 3. Navigate to client and install
cd client
npm install

# 4. Navigate to server and install
cd ../server
npm install

# Verify all installed
npm list --depth=0  # In each folder
```

**Status**: ⏳ To-Do
**Time**: 5-10 minutes

---

#### **Task 1.2: Get API Keys**

**Step 1: Google Gemini API**
```
1. Go to: https://ai.google.dev/
2. Click "Get API Key"
3. Create a new project or select existing
4. Create API key
5. Copy and save securely
```

**Step 2: Cloudflare Account**
```
1. Go to: https://dash.cloudflare.com
2. Sign up or log in
3. Create new account if needed
4. Get API token from account area
5. Save for later
```

**Step 3: ElevenLabs**
```
1. Go to: https://www.elevenlabs.io/
2. Sign up (free tier available)
3. Go to API section
4. Copy API key
5. Get a voice ID (copy from "Voices")
```

**Step 4: FAL AI (Optional for now)**
```
1. Go to: https://www.fal.ai/
2. Sign up
3. Get API key from dashboard
4. Not critical for initial setup
```

**Status**: ⏳ To-Do
**Time**: 10-15 minutes

---

#### **Task 1.3: Configure Environment**

**Client Configuration**

Create `client/.env.local`:
```env
VITE_API_URL=http://localhost:8787
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional
VITE_LOG_LEVEL=debug
```

**Server Configuration**

Create `server/.dev.vars`:
```env
GEMINI_API_KEY=your_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_key
FAL_API_KEY=your_fal_ai_key
```

Create `server/.env.production` (for deployed version):
```env
# Will be set in Cloudflare dashboard
```

**Status**: ⏳ To-Do
**Time**: 5 minutes

---

#### **Task 1.4: Run Development Servers**

**Terminal Window 1: Backend**
```bash
cd server
npm run dev

# Expected output:
# ⛅ wrangler 3.101.0
# 🌍 Listening on http://localhost:8787
```

**Terminal Window 2: Frontend**
```bash
cd client
npm run dev

# Expected output:
# VITE v4.0.0 ready in 234 ms
# ➜ Local: http://localhost:5173/
```

**Step 5: Test in Browser**
```
1. Open: http://localhost:5173
2. You should see the app
3. Look for "Need Help?" button
4. Click it to open chat widget
```

**Status**: ⏳ To-Do
**Time**: 5 minutes

---

### **Phase 2: Understanding the Codebase (Rest of today)**

#### **Task 2.1: Read Core Files**

```typescript
// Start here (15 min each):

1. client/src/contexts/UnstuckContext.tsx
   ├─ Main logic for the whole system
   ├─ DOM analysis
   ├─ Element extraction
   └─ Context provider setup

2. client/src/components/unstuck/chat/ChatWidget.tsx
   ├─ UI component
   ├─ Voice input handling
   ├─ State management
   └─ API calls

3. server/src/index.ts
   ├─ API endpoints
   ├─ Hono setup
   └─ Error handling

4. server/src/services/gemini.ts
   ├─ AI service
   ├─ Prompt engineering
   └─ Response handling

5. client/src/lib/
   ├─ Utility functions
   ├─ DOM utilities
   └─ Helper functions
```

**Status**: ⏳ To-Do
**Time**: 1-2 hours

---

#### **Task 2.2: Test Basic Flow**

```
1. Open http://localhost:5173
2. Click  "Need Help?" button
3. Grant microphone permission
4. Say a simple command:
   "Show me the first property"
   or "Go to settings"
5. Watch the console for:
   ✅ Voice captured
   ✅ API called
   ✅ Gemini response
   ✅ Action executed
   ✅ Voice response played
```

**What to look for**:
- Console logs showing each step
- Network tab showing API calls
- Elements being highlighted
- Audio playing back

**Common Issues & Fixes**:
```
Issue: Microphone not working
Fix:
  1. Check browser permissions
  2. Refresh page
  3. Try in Chrome (best support)
  4. Check https in production

Issue: API returns 401
Fix:
  1. Verify API keys in .env files
  2. Restart dev server
  3. Check X-API-Key header

Issue: No response from Gemini
Fix:
  1. Check API quota
  2. Check if API key is valid
  3. Check network requests
  4. Check server console for errors

Issue: Screenshot looks blank
Fix:
  1. Wait for images to load
  2. Check html2canvas options
  3. Test with simple page first
```

**Status**: ⏳ To-Do
**Time**: 30 minutes

---

### **Phase 3: Customization (Tomorrow & Beyond)**

#### **Task 3.1: Customize the AI Prompt**

**Current Location**: `server/src/services/gemini.ts`

```typescript
// Look for the `userMessage` variable around line 80
// This is the system prompt

// Current structure:
const userMessage = `
You are an AI assistant designed to help users navigate...
[Long prompt with instructions]
`

// What you can customize:
1. Tone (more casual, professional, etc.)
2. Behavior (when to give up, retry logic)
3. Output format (change JSON structure if needed)
4. Instructions for specific domains
```

**Example Customization**:
```typescript
// Add domain-specific instructions
const userMessage = `
You are an AI assistant helping guests book vacation properties.
Your personality is friendly and helpful.

Key guidelines:
1. Always prioritize finding properties in the user's budget
2. Suggest filters: price, location, amenities
3. Highlight unique features of properties
4. Be conversational, not robotic
5. If confused, ask clarifying questions

[Rest of prompt...]
`
```

**Testing Customization**:
```
1. Edit the prompt
2. Restart server: npm run dev
3. Test the bot
4. Check if behavior changed
5. Iterate
```

**Status**: ⏳ To-Do
**Time**: 1-2 hours

---

#### **Task 3.2: Explore & Extend Components**

**Simple Customizations**:

```typescript
// 1. Change colors (Tailwind)
// In any component:
<div className="bg-blue-500">       → bg-purple-500
<button className="text-white">     → text-yellow-300

// 2. Change size
<h1 className="text-2xl">  → text-3xl or text-4xl

// 3. Add shadows/effects
<div className="shadow-md">  → shadow-lg or shadow-xl

// 4. Modify spacing
<div className="p-4">       → p-6 or p-8
```

**UI Component Library**:
```
All UI components are in: client/src/components/ui/

Browse them to understand what's available:
├─ button.tsx          → Reusable button
├─ card.tsx            → Card containers
├─ dialog.tsx          → Modal dialogs
├─ input.tsx           → Form inputs
├─ select.tsx          → Dropdown selects
├─ toast.tsx           → Notifications
└─ ... (40+ more)

Use in your components:
import { Button } from "@/components/ui/button";

<Button variant="outline" size="lg">
  Click me
</Button>
```

**Status**: ⏳ To-Do
**Time**: 1-2 hours

---

#### **Task 3.3: Add New Pages or Features**

**Example: Add a "Chat History" Page**

```typescript
// File: client/src/pages/ChatHistory.tsx

import { useUnstuck } from "@/contexts/UnstuckContext";
import { Card } from "@/components/ui/card";

export default function ChatHistory() {
  const { previousMessages } = useUnstuck();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Chat History</h1>
      
      {previousMessages.map((msg, idx) => (
        <Card key={idx} className="mb-4 p-4">
          <p className="font-semibold text-sm text-gray-600">
            {msg.role.toUpperCase()}
          </p>
          <p className="mt-2">{JSON.stringify(msg.content)}</p>
        </Card>
      ))}
    </div>
  );
}
```

**Add Route**:
```typescript
// In client/src/App.tsx
import ChatHistory from "./pages/ChatHistory";

<Routes>
  {/* ... existing routes ... */}
  <Route path="/chat-history" element={<ChatHistory />} />
</Routes>
```

**Status**: ⏳ To-Do
**Time**: 2-3 hours per feature

---

### **Phase 4: Optimization & Production (Next Week)**

#### **Task 4.1: Performance Optimization**

```typescript
// 1. Lazy load components
import { lazy, Suspense } from "react";

const ChatWidget = lazy(() => 
  import("@/components/unstuck/chat/ChatWidget")
);

// 2. Memoize expensive operations
const DOMAnalysis = useMemo(() => {
  return analyzeDOM(document.body);
}, []);

// 3. Debounce API calls
const debouncedSearch = useCallback(
  debounce((query) => sendQuery(query), 500),
  []
);

// 4. Cache with React Query
useQuery({
  queryKey: ["property", id],
  queryFn: fetchProperty,
  staleTime: 5 * 60 * 1000, // 5 min cache
});
```

**Status**: ⏳ To-Do (Week 2)
**Time**: 2-3 hours

---

#### **Task 4.2: Deploy to Production**

**Frontend (Vercel - Recommended)**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
cd client
vercel

# 3. Set environment variables in Vercel dashboard
# VITE_API_URL=https://your-worker.workers.dev
# VITE_GEMINI_API_KEY=...
```

**Backend (Cloudflare Workers)**
```bash
# 1. Login to Cloudflare
wrangler login

# 2. Configure wrangler.jsonc
# Set your account_id and workers_dev

# 3. Deploy
cd server
npm run deploy

# 4. Set environment variables in Cloudflare dashboard
# GEMINI_API_KEY=...
# ELEVENLABS_API_KEY=...
# FAL_API_KEY=...
```

**Status**: ⏳ To-Do (Week 2)
**Time**: 30 minutes - 1 hour

---

#### **Task 4.3: Monitoring & Error Tracking**

```typescript
// Install Sentry for error tracking
npm install @sentry/react

// Configure in client/src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

**Status**: ⏳ To-Do (Week 2+)
**Time**: 1-2 hours

---

## 📋 Step-by-Step Getting Started Checklist

### **Today (Day 1)**
- [ ] Clone repository
- [ ] Install dependencies
- [ ] Get all API keys
- [ ] Configure .env files
- [ ] Run backend server
- [ ] Run frontend server
- [ ] Test basic voice input
- [ ] Read this guide completely

### **Tomorrow (Day 2)**
- [ ] Read UnstuckContext.tsx
- [ ] Read ChatWidget.tsx
- [ ] Read server/index.ts
- [ ] Test different voice commands
- [ ] Explore component library
- [ ] Open DevTools and watch network requests
- [ ] Try to break something and fix it

### **This Week (Days 3-5)**
- [ ] Customize prompts
- [ ] Change colors/styling
- [ ] Add a new page
- [ ] Create a custom hook
- [ ] Test on different pages
- [ ] Document findings

### **Next Week**
- [ ] Add new features
- [ ] Optimize performance
- [ ] Deploy to production
- [ ] Gather user feedback
- [ ] Iterate & improve

---

## 🏗️ Project Architecture Quick Reference

```
Browser (React Client)
│
├─ App.tsx (Root)
│  └─ Providers (Query, Tooltip, Currency, Unstuck)
│     └─ Routes + UI Components
│
├─ UnstuckContext (Core Logic)
│  ├─ DOM Analysis
│  ├─ Element Extraction  
│  ├─ Screenshot Capture
│  └─ API Communication
│
└─ ChatWidget Component
   ├─ Voice Input (VAD)
   ├─ UI States
   ├─ Message Management
   └─ Audio Playback
       │
       ├─ (via HTTP)
       │
       ↓
  
Backend (Cloudflare Workers)
│
├─ Hono App (index.ts)
│  ├─ GET  /health
│  ├─ POST /asr (Speech-to-Text)
│  ├─ POST /analyze (AI Analysis)
│  └─ POST /tts (Text-to-Speech)
│
└─ Services
   └─ Gemini Service
      └─ Process Query
          │
          ├─ (external API calls)
          │
          ↓

External APIs
├─ Google Gemini (AI Analysis)
├─ OpenAI Whisper (Speech Recognition)
├─ ElevenLabs (Text-to-Speech)
└─ FAL AI (Image Services)
```

---

## 🎓 Learning Path for Different Roles

### **If You're a Frontend Developer**
```
Priority Order:
1. Understand ChatWidget
2. Understand UnstuckContext
3. Explore UI components
4. Customize styling
5. Add new pages/features
6. Learn basic backend (nice to have)

Time to productive: 1-2 days
```

### **If You're a Backend Developer**
```
Priority Order:
1. Understand server/index.ts
2. Understand gemini.ts
3. Learn Hono framework
4. Understand Cloudflare Workers
5. Customize prompts/APIs
6. Learn basic frontend (nice to have)

Time to productive: 1-2 days
```

### **If You're a Full Stack Developer**
```
Priority Order:
1. Understand entire flow
2. Run both servers locally
3. Test end-to-end
4. Customize AI prompts
5. Optimize performance
6. Deploy both parts

Time to productive: 2-3 days
```

### **If You're New to Web Dev**
```
Priority Order:
1. Learn JavaScript/TypeScript (online course: 1 week)
2. Learn React basics (online course: 1 week)
3. Understand this project architecture
4. Start with small tweaks
5. Build confidence
6. Add features

Time to productive: 2-4 weeks
```

---

## 🔗 Important Files Reference

| File | What It Does | Key Functions |
|------|------------|----------------|
| `App.tsx` | Main app | Routes & providers |
| `UnstuckContext.tsx` | Core logic | DOM analysis, APIs |
| `ChatWidget.tsx` | UI component | Voice, display, chat |
| `server/index.ts` | API server | Route handlers |
| `gemini.ts` | AI service | Query processing |
| `lib/extract.ts` | Parse responses | JSON extraction |
| `lib/sanitize.ts` | Clean HTML | DOM cleaning |
| `utils/screenshot.ts` | Capture screen | Image generation |
| `utils/siteMetadata.ts` | Get sitemap | Page structure |

---

## ❓ FAQ for Getting Started

**Q: Where do I start?**
A: Phase 1 - Set up locally. Then read Phase 2 to understand the code.

**Q: How long to get running?**
A: 30-60 minutes for initial setup + API keys

**Q: Do I need all API keys immediately?**
A: Yes, for the demo. You can simplify later.

**Q: Can I customize the AI behavior?**
A: Yes! Edit prompts in `server/services/gemini.ts`

**Q: How do I add new features?**
A: Create new components in React and integrate with UnstuckContext

**Q: How do I deploy?**
A: Frontend to Vercel, Backend to Cloudflare Workers

**Q: What if something breaks?**
A: Check the console, look at network tab, restart servers

**Q: Can I use this in my own project?**
A: Yes! The ChatWidget can be imported into any React app

---

## 🎯 Quick Wins (Easy Tasks to Start)**

```
✅ Change button colors
   File: client/src/components/unstuck/chat/ChatWidget.tsx
   Find: className="..." → Change to different Tailwind classes

✅ Modify success messages
   File: Same as above
   Find: successMessages array → Edit strings

✅ Change API endpoint
   File: client/.env.local
   Find: VITE_API_URL → Change to your server

✅ Add debug logs
   File: Any component
   Add: console.log("Debug message", data)

✅ Test with different queries
   Just open app and try different voice commands!
```

---

## 📞 Troubleshooting Guide

### **Setup Issues**
```
Error: "npm command not found"
→ Install Node.js from nodejs.org

Error: "Port 8787 already in use"
→ Change port: wrangler dev --port 3001

Error: "GEMINI_API_KEY not found"
→ Check .dev.vars file exists in server folder
```

### **Runtime Issues**
```
Error: "Microphone permission denied"
→ Check browser permissions
→ Open in Chrome (better support)
→ Use HTTPS (required for some APIs)

Error: "Screenshot is blank"
→ Wait for page to fully load
→ Try on simpler page first
→ Check browser console

Error: "API returns 429"
→ Rate limited, wait a minute
→ Check your quota
→ Implement exponential backoff
```

---

**You're all set! Now let's build something amazing! 🚀**
