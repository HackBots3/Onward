# 🏗️ UNSTUCK - DEVELOPER EXTENSION GUIDE

## 📖 Overview

This guide explains how to modify, extend, and improve the Unstuck system. It's designed for AI agents and developers who need to understand the codebase structure and make changes.

---

## 🔑 CORE COMPONENTS DEEP DIVE

### 1. Backend Server Structure (server/src/server.js)

**File Size:** ~200 lines  
**Purpose:** Main HTTP server handling all requests  
**Dependencies:** express, cors, groq service

**Architecture:**
```
HTTP Request → CORS Check → Route Handler → Service → Response
```

**Key Functions:**

#### a) loadEnvFile()
```javascript
function loadEnvFile() {
  // Why manual parsing?
  // - .dev.vars is custom format (not dotenv compatible)
  // - Handles Windows line endings (\r\n)
  // - Removes quotes from values
  // - Skips comment lines (starting with #)
}
```

**To Modify:** If you want to support different env formats
- File: `server/src/server.js`, lines 15-31
- Change: The parsing logic in the forEach loop

#### b) POST /asr Endpoint
```javascript
app.post("/asr", (req, res) => {
  // Purpose: Receive transcribed text from browser
  // Why: Allows logging and preprocessing before analysis
  // Input: text, confidence, isFinal
  // Output: Confirmation + metadata
})
```

**To Extend:**
- Add transcription preprocessing
- Implement audio quality scoring
- Add multi-language detection

#### c) POST /analyze Endpoint
```javascript
app.post("/analyze", async (req, res) => {
  // Core endpoint for AI analysis
  // Calls processQuery from groq.js
  // Returns action sequence
})
```

**To Modify:**
- Change which AI service is called (line 117)
- Add pre/post processing
- Implement caching
- Add request validation

#### d) POST /tts Endpoint
```javascript
app.post("/tts", async (req, res) => {
  // Text-to-Speech endpoint
  // Calls Google Translate API
  // Returns MP3 audio
})
```

**To Replace:**
- Switch to Azure Speech Services
- Use IBM Watson TTS
- Use ElevenLabs API
- Use native OS TTS (Windows SAPI, macOS NSSpeechSynthesizer)

**Current Implementation (Google Translate):**
```javascript
const ttsUrl = "https://translate.google.com/translate_tts";
const audioResponse = await fetch(ttsUrl, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    client: "tw-ob",
    idx: "0",
    prev: "input",
    q: text,
    textlen: text.length,
    total: 1,
    tk: encodeURIComponent(
      Array.from(text).reduce((a, char) => (a = (a << 5) - a + char.charCodeAt(0)), 0)
    ),
    tl: language,
  })
});
```

---

### 2. AI Service Integration (server/src/services/groq.js)

**File Size:** ~100 lines  
**Purpose:** Handles all communication with Groq API  
**Authentication:** API key from environment

**Key Function: processQuery(request, apiKey)**

**Input Structure:**
```typescript
{
  userQuery: string;           // "Find flights to New York"
  screenshot: string;          // base64 encoded image
  domString: string;           // HTML of entire page
  previousMessages: array;     // Chat history for context
  sitemap: string;             // Page structure info
}
```

**Processing Steps:**
1. Validate API key
2. Trim DOM if too large (token optimization)
3. Build message history with system prompt
4. Call Groq API
5. Parse and return response

**System Prompt Location:**
Lines 42-82 in groq.js

**To Modify System Prompt:**
```javascript
// Current instruction tells AI to:
// 1. Analyze user query
// 2. Look at DOM structure
// 3. Identify clickable elements
// 4. Return action sequence

// To change behavior, modify these sections:
- "Your goal is to..." (line 45)
- "Here is the sitemap..." (line 48)
- "Wrap your analysis inside..." (line 66)
- "Remember:" (line 80)
```

**DOM Trimming Logic:**
```javascript
function trimDOM(domString, maxChars = 24000) {
  // Rule: 1 token ≈ 4 characters
  // 24000 chars ≈ 6000 tokens
  // This leaves room for query and response
  
  if (domString.length > maxChars) {
    console.log(`Trimming DOM from ${domString.length} to ${maxChars}`);
    return domString.substring(0, maxChars) + 
           "\n<!-- DOM truncated -->";
  }
}
```

**To Adjust:** Change `maxChars` parameter based on your token needs

**Groq API Configuration:**
```javascript
const openai = new OpenAI({
  apiKey: apiKey.trim(),
  baseURL: "https://api.groq.com/openai/v1",  // ← Different from OpenAI
  defaultHeaders: { "Accept-Encoding": "gzip" }
});

const completion = await openai.chat.completions.create({
  model: "mixtral-8x7b-32768",  // ← Specific Groq model
  messages: messages,
  // Optional parameters:
  // temperature: 0.5,  // Lower = more focused, Higher = more creative
  // top_p: 0.9,        // Diversity control
  // max_tokens: 1000   // Response length limit
});
```

**To Upgrade Model:**
- Change model name (line 41)
- Available: "llama-3.3-70b-versatile", "mixtral-8x7b-32768"
- Larger models = better quality but slower

---

### 3. Frontend Chat Widget (client/src/components/unstuck/chat/ChatWidget.tsx)

**File Size:** ~400 lines  
**Purpose:** Main user interface for voice interaction  
**Framework:** React 18 + TypeScript

**State Variables:**
```typescript
chatState: "closed" | "minimized" | "maximized"  // UI state
isRecording: boolean                              // Mic on/off
isCallActive: boolean                             // Active session
chatMessages: ChatMessage[]                       // Chat history
isAnalyzing: boolean                              // Processing
loading: LoadingState | undefined                 // Loading status
error: ErrorState | undefined                     // Error display
isVoiceEnabled: boolean                           // Audio toggle
```

**Key Functions:**

#### a) useRecognition()
```typescript
// Initializes Web Speech API
const SpeechRecognition = window.SpeechRecognition || 
                          window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

// Events:
recognition.onstart = () => setIsRecording(true);
recognition.onresult = (event) => {
  // Transcript building from events
};
recognition.onend = () => setIsRecording(false);
```

**To Modify:**
- Change language: `recognition.lang = "es-ES"` (Spanish)
- Add interim result display
- Implement confidence filtering

#### b) playTextToSpeech(text: string)
```typescript
// Calls /tts endpoint and plays audio
async function playTextToSpeech(text: string) {
  if (!isVoiceEnabled) return;
  
  const response = await fetch(`${serverUrl}/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  
  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  
  const audio = new Audio(audioUrl);
  audio.play();
}
```

**To Customize:**
- Add audio volume control
- Add speed adjustment
- Implement audio effects
- Queue multiple audio playback

#### c) executeWorkflow(actions: string[])
```typescript
// Executes action sequence from AI
for (const actionId of actions) {
  const element = document.querySelector(
    `[data-unstuck-id="${actionId}"]`
  );
  if (element) (element as HTMLElement).click();
  await delay(500); // Wait between actions
}
```

**To Enhance:**
- Add hover effects before clicking
- Take screenshots between actions
- Validate element exists before click
- Add click animation
- Implement smart waits (wait for element to load)

#### d) Context Integration
```typescript
// Accesses global context
const { getCurrentContext, setUserQuery, apiKey, serverUrl } = useUnstuck();

// Use to:
// - Store user query globally
// - Access API key
// - Get server URL
// - Manage navigation state
```

**To Add Context:**
1. Modify `contexts/UnstuckContext.tsx`
2. Add new state variable
3. Add to context hook return
4. Use in ChatWidget

---

## 🔄 REQUEST/RESPONSE FLOW DIAGRAMS

### Complete Voice Query Flow

```
Step 1: User Interface
┌─────────────────────┐
│  Click Microphone   │
│   "Recording..."    │
└──────────┬──────────┘
           │
Step 2: Web Speech API (Browser)
┌─────────────────────────────────┐
│ Audio → Text conversion         │
│ "Find hotels in New York"       │
│ Confidence: 0.95                │
└──────────┬──────────────────────┘
           │
Step 3: Send to Backend
        POST /asr
┌─────────────────────────────────┐
│ Request Body:                   │
│ {                               │
│   "text": "Find hotels...",     │
│   "confidence": 0.95,           │
│   "isFinal": true               │
│ }                               │
└──────────┬──────────────────────┘
           │
Step 4: Backend Logs
├─ 🎤 Received transcription
├─ Text: Find hotels in New York
├─ Confidence: 0.95
└─ ✅ Response: 200 OK
           │
Step 5: Collect Page Data
├─ Capture full DOM
├─ Take screenshot
├─ Generate sitemap
└─ Include chat history
           │
Step 6: Send to AI Analysis
        POST /analyze
┌──────────────────────────────────┐
│ Request Body:                    │
│ {                                │
│   "userQuery": "Find hotels...", │
│   "domString": "<html>...",      │
│   "screenshot": "data:image...", │
│   "sitemap": "Home > Hotels",    │
│   "previousMessages": [...]      │
│ }                                │
└──────────┬───────────────────────┘
           │
Step 7: Backend Calls Groq
├─ Trim DOM if needed
├─ Build message prompt
├─ Call Groq API
└─ Parse response
           │
Step 8: AI Response
┌──────────────────────────────────┐
│ {                                │
│   "reasoning": "I see a search", │
│   "actions": ["search-btn"],     │
│   "narration": "Searching...",   │
│   "taskAccomplished": false      │
│ }                                │
└──────────┬───────────────────────┘
           │
Step 9: Execute Actions
├─ Find element [data-unstuck-id="search-btn"]
├─ Click it
├─ Wait for page to load
└─ Capture new state
           │
Step 10: Generate Response Text
└─ "I found 10 hotels for you"
           │
Step 11: Convert to Speech
        POST /tts
├─ Text → Google Translate TTS
├─ Generate MP3 (28KB)
└─ Return audio stream
           │
Step 12: Play Audio
├─ Browser receives MP3
├─ Creates Audio element
├─ Plays: 🔊 "I found 10 hotels..."
└─ User hears response
           │
Step 13: Chat History Update
└─ Add to chatMessages array
           │
Step 14: Ready for Next Input
└─ User can speak again
```

---

## 🧪 TESTING GUIDE

### Unit Testing Pattern

```typescript
// Test a function in isolation
import { trimDOM } from "./services/groq";

describe("trimDOM", () => {
  test("should trim large DOM", () => {
    const largeDom = "x".repeat(50000);
    const result = trimDOM(largeDom);
    
    expect(result.length).toBeLessThanOrEqual(24000);
    expect(result).toContain("<!-- DOM truncated -->");
  });
  
  test("should not trim small DOM", () => {
    const smallDom = "x".repeat(1000);
    const result = trimDOM(smallDom);
    
    expect(result).toBe(smallDom);
  });
});
```

### Integration Testing Pattern

```typescript
// Test entire flow
describe("Voice Query Flow", () => {
  test("should process voice query end-to-end", async () => {
    // 1. Send ASR request
    const asrResponse = await fetch("/asr", {
      method: "POST",
      body: JSON.stringify({ text: "Find hotels" })
    });
    expect(asrResponse.status).toBe(200);
    
    // 2. Send analyze request
    const analyzeResponse = await fetch("/analyze", {
      method: "POST",
      body: JSON.stringify({
        userQuery: "Find hotels",
        domString: "<html>...</html>"
      })
    });
    expect(analyzeResponse.status).toBe(200);
    
    // 3. Request TTS
    const ttsResponse = await fetch("/tts", {
      method: "POST",
      body: JSON.stringify({ text: "Here are hotels" })
    });
    expect(ttsResponse.headers.get("content-type")).toBe("audio/mpeg");
  });
});
```

### Manual Testing with curl

```bash
# Test all endpoints in sequence
echo "1. Testing health..."
curl http://localhost:8787/health

echo "2. Testing ASR..."
curl -X POST http://localhost:8787/asr \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","confidence":0.9}'

echo "3. Testing TTS..."
curl -X POST http://localhost:8787/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world"}' \
  --output audio.mp3

echo "4. Testing Analyze..."
curl -X POST http://localhost:8787/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "userQuery":"Click button",
    "domString":"<button id=\"btn\">Click</button>",
    "screenshot":"",
    "previousMessages":[]
  }'
```

---

## 🔧 COMMON EXTENSIONS

### Extension 1: Add Retry Logic

**Where:** `server/src/server.js` in `/analyze` endpoint

```javascript
async function analyzeWithRetry(request, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries}`);
      return await processQuery(request, process.env.GROQ_API_KEY);
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) throw error;
      
      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

app.post("/analyze", async (req, res) => {
  try {
    const response = await analyzeWithRetry(req.body);
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
```

### Extension 2: Add Caching

**Where:** `server/src/services/groq.js`

```javascript
const queryCache = new Map();
const CACHE_TTL = 3600000; // 1 hour

async function processQuery(request, apiKey) {
  const cacheKey = JSON.stringify({
    query: request.userQuery,
    dom: request.domString.substring(0, 100) // First 100 chars
  });
  
  // Check cache
  const cached = queryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("📦 Cache hit!");
    return cached.data;
  }
  
  // Process normally
  const result = await callGroqAPI(...);
  
  // Store in cache
  queryCache.set(cacheKey, {
    data: result,
    timestamp: Date.now()
  });
  
  return result;
}
```

### Extension 3: Add Rate Limiting

**Where:** `server/src/server.js`

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000,     // 1 minute
  max: 30,                 // 30 requests per minute
  message: "Too many requests, try again later"
});

app.post("/analyze", limiter, async (req, res) => {
  // ... existing code
});
```

### Extension 4: Add Request Validation

**Where:** `server/src/server.js`

```javascript
function validateAnalyzeRequest(req) {
  const { userQuery, domString, screenshot } = req.body;
  
  const errors = [];
  
  if (!userQuery || typeof userQuery !== "string") {
    errors.push("userQuery is required and must be string");
  }
  
  if (!domString || domString.length < 10) {
    errors.push("domString is required and should be substantial");
  }
  
  if (domString.length > 1000000) {
    errors.push("domString is too large (max 1MB)");
  }
  
  return errors;
}

app.post("/analyze", async (req, res) => {
  const validationErrors = validateAnalyzeRequest(req);
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }
  
  // ... rest of endpoint
});
```

---

## 🚀 PERFORMANCE OPTIMIZATION

### Optimization 1: Parallel Processing

```javascript
// Instead of sequential
await processQuery1();
await processQuery2();

// Do parallel
const [result1, result2] = await Promise.all([
  processQuery1(),
  processQuery2()
]);
```

### Optimization 2: Stream Large Responses

```javascript
app.post("/analyze", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  
  // For large responses, stream chunks
  const result = await processQuery(req.body);
  
  res.write('{"result":"');
  // Write in chunks
  for (let i = 0; i < result.length; i += 1000) {
    res.write(JSON.stringify(result.substring(i, i + 1000)));
  }
  res.write('"}');
  res.end();
});
```

### Optimization 3: Compress Responses

```javascript
const compression = require("compression");
app.use(compression());
```

---

## 🔐 SECURITY HARDENING

### Security 1: API Key Rotation

```javascript
// Instead of static key
const apiKey = process.env.GROQ_API_KEY;

// Implement rotation
class KeyManager {
  constructor() {
    this.keys = [
      process.env.GROQ_API_KEY_1,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3
    ];
    this.currentIndex = 0;
  }
  
  getKey() {
    const key = this.keys[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    return key;
  }
}
```

### Security 2: Input Sanitization

```javascript
const DOMPurify = require("isomorphic-dompurify");

function sanitizeDOM(htmlString) {
  return DOMPurify.sanitize(htmlString, { 
    ALLOWED_TAGS: ["button", "input", "a", "div", "span"],
    ALLOWED_ATTR: ["id", "class", "data-unstuck-id"]
  });
}
```

### Security 3: HTTPS Enforcement

```javascript
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      return res.redirect(`https://${req.header("host")}${req.url}`);
    }
    next();
  });
}
```

---

## 📋 MODIFICATION CHECKLIST

When making changes, follow this checklist:

- [ ] **Plan** - Write down what you're changing
- [ ] **Backup** - Copy original file
- [ ] **Code** - Make the changes
- [ ] **Test** - Verify with curl/Postman
- [ ] **Log** - Add debug logs
- [ ] **Document** - Comment your changes
- [ ] **Rollback** - Keep original version
- [ ] **Review** - Check for errors
- [ ] **Deploy** - Test in real scenario

---

## 🎓 LEARNING RESOURCES

**To Understand Better:**

1. **Groq API Docs** - https://console.groq.com/docs
2. **Express.js Guide** - https://expressjs.com/
3. **Web Speech API** - https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
4. **React Hooks** - https://react.dev/reference/react/hooks
5. **TypeScript Handbook** - https://www.typescriptlang.org/docs/

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-28  
**Purpose:** Developer Extension Guide
