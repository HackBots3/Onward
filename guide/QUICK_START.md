# Unstuck - Quick Start & Technical Reference

## ⚡ TL;DR - Start in 10 Minutes

### **Installation**
```bash
git clone <repo> && cd unstuck
npm install && cd client && npm install && cd ../server && npm install
```

### **Configuration**
1. Create `client/.env.local`:
```env
VITE_API_URL=http://localhost:8787
VITE_GEMINI_API_KEY=your_key_here
```

2. Create `server/.dev.vars`:
```env
GEMINI_API_KEY=your_key
ELEVENLABS_API_KEY=your_key
FAL_API_KEY=your_key
```

### **Run**
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

Open `http://localhost:5173` → Click "Need Help?" button ✅

---

## 🔧 Tech Stack at a Glance

| Layer | Tech | Role |
|-------|------|------|
| **Frontend** | React 18 + TypeScript + Vite | UI & Voice Interface |
| **Styling** | TailwindCSS + Shadcn/UI | Beautiful Components |
| **State** | React Context + TanStack Query | Data Management |
| **Backend** | Hono + Cloudflare Workers | API Server |
| **AI** | Google Gemini API | Query Understanding |
| **Speech** | OpenAI Whisper | Speech-to-Text |
| **Voice** | ElevenLabs | Text-to-Speech |
| **Hosting** | Cloudflare Workers | Serverless Backend |

---

## 📊 System Architecture (Simple View)

```
┌─────────────────┐
│   User Voice    │
└────────┬────────┘
         │ (speak)
         ↓
┌─────────────────────────────────────┐
│     Browser / React Client          │
│  • Captures voice (MediaRecorder)    │
│  • Extracts DOM elements            │
│  • Takes screenshots                │
│  • Displays results                 │
└────────┬────────────────────────────┘
         │ (REST API)
         ↓
┌─────────────────────────────────────┐
│   Cloudflare Workers Backend        │
│  • Handles speech recognition       │
│  • Calls Gemini for AI analysis     │
│  • Generates voice response         │
│  • Manages API keys securely        │
└────────┬────────────────────────────┘
         │ (External APIs)
         ↓
┌─────────────────────────────────────┐
│    Third-Party Services             │
│  • Google Gemini (AI)               │
│  • OpenAI Whisper (Speech-to-Text)  │
│  • ElevenLabs (Text-to-Speech)      │
│  • FAL AI (Image Processing)        │
└─────────────────────────────────────┘
         │ (Responses)
         ↓
┌─────────────────────────────────────┐
│  UI Updates & Voice Output          │
│  ✅ Highlights click targets        │
│  ✅ Plays spoken response           │
│  ✅ Shows next steps                │
└─────────────────────────────────────┘
```

---

## 🎯 Key Features Explained

### **1. Voice Input (VAD)**
```
Real-time voice activity detection
├─ User speaks → Audio captured
├─ Silence detected → Send to API
└─ Whisper API → Convert to text
```

### **2. Context Collection**
```
Gather everything about current page
├─ Screenshot with html2canvas
├─ Sanitized DOM structure
├─ Interactive elements extracted
└─ Website sitemap generated
```

### **3. AI Analysis (Gemini)**
```
Understand what user wants
├─ Analyze user query
├─ Find relevant UI elements
├─ Plan action sequence
└─ Return step-by-step instructions
```

### **4. Visual Guidance**
```
Show user what to do
├─ Highlight next element
├─ Animate cursor to it
├─ Show user-friendly narration
└─ Execute click/interaction
```

### **5. Voice Response**
```
Tell user what's happening
├─ Generate narration text
├─ Convert to speech (ElevenLabs)
└─ Play audio response
```

---

## 📱 Main Components

### **App.tsx** (Entry Point)
```typescript
// Wraps app with providers
<QueryClientProvider>
  <TooltipProvider>
    <CurrencyProvider>
      <UnstuckProvider config={{...}}>
        {/* Routes & UI */}
      </UnstuckProvider>
    </CurrencyProvider>
  </TooltipProvider>
</QueryClientProvider>
```

### **UnstuckContext.tsx** (Core Logic)
```typescript
// Provides:
- DOM analysis & element extraction
- Screenshot capture
- API communication
- Query processing
- Chat history management
```

### **ChatWidget.tsx** (Chat Interface)
```typescript
// Manages:
- Voice input (VAD + MediaRecorder)
- Chat UI states (open/closed/minimized)
- Message display
- Loading/error states
- Audio playback
```

### **server/index.ts** (API Endpoints)
```typescript
// Endpoints:
POST /asr → Speech-to-text (Whisper)
POST /analyze → AI analysis (Gemini)
POST /tts → Text-to-speech (ElevenLabs)
GET /health → Health check
```

### **server/services/gemini.ts** (AI Service)
```typescript
// Main function:
processQuery() → Analyzes user query & DOM
                → Returns action sequence
                → Generates narration
```

---

## 🔑 Important Functions & Patterns

### **Pattern 1: Getting Context**
```typescript
// In ChatWidget or any component using UnstuckContext
const { getCurrentContext } = useUnstuck();

const context = await getCurrentContext();
// Returns:
// {
//   domString: "<sanitized-html>",
//   screenshot: "data:image/png;base64,...",
//   userQuery: "user's question"
// }
```

### **Pattern 2: Sending Query to Server**
```typescript
const response = await fetch(`${serverUrl}/analyze`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": apiKey,
  },
  body: JSON.stringify({
    userQuery: "Find me a property",
    screenshot: context.screenshot,
    domString: context.domString,
    previousMessages: chatHistory,
    sitemap: siteMap,
  }),
});

const result = await response.json();
// Returns:
// {
//   reasoning: "Step-by-step explanation",
//   actions: ["element-id-1", "element-id-2"],
//   narration: "Let me help you find a property...",
//   taskAccomplished: false
// }
```

### **Pattern 3: Element Interaction**
```typescript
// Find element by unstuck ID
const element = document.querySelector(
  `[data-unstuck-id="${actionId}"]`
);

// Execute interaction
if (element) {
  element.scrollIntoView({ behavior: "smooth" });
  const bbox = element.getBoundingClientRect();
  
  // Show visual indicator
  showGhostCursor(bbox);
  
  // Perform action
  setTimeout(() => element.click(), 500);
}
```

### **Pattern 4: Voice Input Flow**
```typescript
// VAD detects speech ended
useMicVAD({
  onSpeechEnd: async (audioData) => {
    // Convert to WebM
    const blob = await audioToWebM(audioData);
    
    // Send to ASR endpoint
    const response = await fetch(`${serverUrl}/asr`, {
      method: "POST",
      headers: { "X-API-Key": apiKey },
      body: JSON.stringify({
        audio_data: await blobToBase64(blob),
        language: "en",
      }),
    });
    
    const { text } = await response.json();
    // Process text query...
  },
});
```

---

## 🎨 Styling & Theming

### **TailwindCSS Integration**
```typescript
// Use Tailwind classes directly
<div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
  <button className="px-4 py-2 bg-white text-blue-600 rounded hover:shadow-lg">
    Click me
  </button>
</div>
```

### **Shadcn/UI Components**
```typescript
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Components already styled and accessible
<Button variant="outline" size="lg">
  Submit
</Button>
```

---

## 🚀 API Endpoints Reference

### **1. Speech-to-Text (ASR)**
```
POST /asr
Content-Type: application/json
X-API-Key: your_key

{
  "audio_data": "base64_encoded_audio",
  "language": "en"
}

Response:
{
  "text": "transcribed text",
  "confidence": 0.95
}
```

### **2. Query Analysis**
```
POST /analyze
Content-Type: application/json
X-API-Key: your_key

{
  "userQuery": "Find properties",
  "screenshot": "base64_image",
  "domString": "<html>...</html>",
  "previousMessages": [],
  "sitemap": "page structure"
}

Response:
{
  "reasoning": "Detailed explanation",
  "actions": ["element-id-1"],
  "narration": "Let me help...",
  "taskAccomplished": false
}
```

### **3. Text-to-Speech (TTS)**
```
POST /tts
Content-Type: application/json
X-API-Key: your_key

{
  "text": "Hello, how are you?"
}

Response:
{
  "audio": "base64_audio_data",
  "mimeType": "audio/mpeg"
}
```

---

## 🔐 Environment Variables

### **Client (.env.local)**
```env
VITE_API_URL=http://localhost:8787
VITE_GEMINI_API_KEY=abc123...
```

### **Server (.dev.vars)**
```env
GEMINI_API_KEY=abc123...
ELEVENLABS_API_KEY=xyz789...
FAL_API_KEY=def456...
```

---

## 📦 Key Dependencies

```json
{
  "frontend": {
    "react": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "shadcn/ui": "latest",
    "@ricky0123/vad-react": "^0.0.28",
    "@11labs/react": "^0.0.7",
    "react-router-dom": "^6.0.0",
    "zod": "^3.20.0"
  },
  "backend": {
    "hono": "^4.0.0",
    "openai": "^4.85.4",
    "@fal-ai/client": "^1.2.3",
    "wrangler": "^3.0.0"
  }
}
```

---

## 🎯 Development Workflow

### **Day 1: Setup**
```
1. Clone repo
2. Install dependencies
3. Get API keys
4. Configure .env files
5. Start servers
6. Test basic flow
```

### **Day 2-3: Understand Code**
```
1. Read architecture.md
2. Trace ChatWidget flow
3. Study UnstuckContext
4. Understand server endpoints
5. Review AI prompts in gemini.ts
```

### **Day 4-5: Customization**
```
1. Modify UI colors/styling
2. Add custom prompts
3. Adjust element detection
4. Enhance error handling
5. Test thoroughly
```

### **Day 6-7: Testing & Deployment**
```
1. Unit tests
2. Integration tests
3. Build & deploy backend
4. Deploy frontend
5. Monitor in production
```

---

## 🐛 Debugging Tips

### **Chrome DevTools**
```
1. Open DevTools (F12)
2. Console → Check for errors
3. Network → Monitor API calls
4. Elements → Inspect DOM structure
5. Sources → Set breakpoints
```

### **Check Voice Input**
```
1. Verify microphone permissions
2. Open Chrome: chrome://flags → Search "permissions"
3. Test VAD with console: navigator.mediaDevices.getUserMedia()
4. Check audio format: WebM/Opus
```

### **Test API Calls**
```
Use Postman or curl:
curl -X POST http://localhost:8787/health \
  -H "X-API-Key: test-key"
```

### **DOM Inspection**
```
In Chrome Console:
document.querySelectorAll('[data-unstuck-id]').length
// See how many interactive elements detected
```

---

## 📊 Performance Optimization

```typescript
// 1. Lazy load components
const ChatWidget = lazy(() => import("@/components/.../ChatWidget"));

// 2. Memoize expensive computations
const context = useMemo(() => getCurrentContext(), [deps]);

// 3. Debounce API calls
const debouncedQuery = debounce((query) => sendQuery(query), 500);

// 4. Cache with React Query
const { data } = useQuery({
  queryKey: ["property", id],
  queryFn: fetchProperty,
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// 5. Code split routes
const Home = lazy(() => import("@/pages/Index"));
const Details = lazy(() => import("@/pages/PropertyDetails"));
```

---

## 🔒 Security Checklist

```
✅ Never hardcode API keys
✅ Use environment variables only
✅ Implement CORS properly
✅ Validate all user inputs
✅ Sanitize DOM before sending to API
✅ Use HTTPS for all API calls
✅ Implement rate limiting
✅ Log but don't expose sensitive data
✅ Regular security audits
✅ Keep dependencies updated
```

---

## 📞 Troubleshooting

### **Problem: "CORS error on /analyze"**
```
Fix: 
1. Check server has CORS enabled
2. Verify serverUrl in config
3. Check API key in headers
```

### **Problem: "Microphone not working"**
```
Fix:
1. Check browser permissions
2. Use HTTPS (required in production)
3. Test in Chrome first
4. Check VAD library version
```

### **Problem: "API returns 401"**
```
Fix:
1. Verify API key is valid
2. Check X-API-Key header is sent
3. Ensure no spaces in key
4. Regenerate key if old
```

### **Problem: "Gemini returns generic response"**
```
Fix:
1. Check DOM string is being sent
2. Verify elements have data-unstuck-id
3. Test with simple page first
4. Review Gemini prompt in server
```

---

## 📚 File-by-File Explanation

| File | Purpose | Key Code |
|------|---------|----------|
| `App.tsx` | Root component | Provider setup |
| `UnstuckContext.tsx` | Core logic | DOM analysis, API calls |
| `ChatWidget.tsx` | Chat UI | Voice input, message display |
| `server/index.ts` | API routes | Endpoint definitions |
| `server/services/gemini.ts` | AI service | Query processing |
| `lib/extract.ts` | Parse responses | JSON parsing |
| `lib/sanitize.ts` | Clean HTML | DOM sanitization |
| `utils/screenshot.ts` | Capture screen | html2canvas wrapper |
| `utils/siteMetadata.ts` | Get sitemap | Page structure |

---

## 🎓 Next Steps

1. **Understand the flow** → Read PROJECT_GUIDE.md
2. **Run locally** → Follow Quick Start above
3. **Explore components** → Study component files
4. **Test features** → Try voice input & interactions
5. **Customize** → Modify prompts & styling
6. **Deploy** → Push to production
7. **Monitor** → Track usage & errors
8. **Iterate** → Add new features

---

**Version**: 1.0.0  
**Last Updated**: March 31, 2026
