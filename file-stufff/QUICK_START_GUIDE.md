# 🚀 UNSTUCK - QUICK SETUP & CODE EXAMPLES

## ⚡ Quick Start (5 Minutes)

### Prerequisites
- Node.js 24+ installed
- Windows 10+ or Mac/Linux
- Git (optional, for version control)

### Setup Steps

**Step 1: Navigate to Backend**
```bash
cd server
```

**Step 2: Install Dependencies**
```bash
npm install
```

**Step 3: Create Configuration**
Create a file named `.dev.vars` in the `server` folder:
```env
GROQ_API_KEY="your_groq_api_key_here"
```

**Step 4: Start Backend**
```bash
npm run dev
```

**Expected Output:**
```
╔══════════════════════════════════════╗
║   UNSTUCK Backend - 100% FREE       ║
║   Server running on port 8787       ║
║   Status: ✅ Ready                  ║
╚══════════════════════════════════════╝

Available Endpoints:
├─ GET  /health
├─ POST /asr
├─ POST /analyze
└─ POST /tts
```

**Step 5: Open Another Terminal for Frontend**
```bash
cd client
npm install
npm run dev
```

**Step 6: Open Browser**
```
http://localhost:3000
```

---

## 📋 COMMON CODE PATTERNS

### Pattern 1: Making a Request to Backend

**Frontend (React/TypeScript):**
```typescript
// Send text to ASR endpoint
async function sendToASR(text: string, confidence: number) {
  const response = await fetch(`${serverUrl}/asr`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "X-API-Key": apiKey 
    },
    body: JSON.stringify({ 
      text, 
      confidence,
      isFinal: true 
    })
  });
  
  if (!response.ok) {
    throw new Error(`ASR failed: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
}
```

### Pattern 2: Sending Page Data for Analysis

**Frontend (React/TypeScript):**
```typescript
// Send DOM + user query to AI analysis
async function analyzePageWithAI(userQuery: string) {
  const domString = document.documentElement.outerHTML;
  const screenshot = await captureScreenshot(); // html2canvas
  const sitemap = getSitemap(); // Your sitemap generator
  
  const response = await fetch(`${serverUrl}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userQuery,
      domString,
      screenshot,
      sitemap,
      previousMessages: chatHistory
    })
  });
  
  const { result, messages } = await response.json();
  return { actions, reasoning, narration } = JSON.parse(result);
}
```

### Pattern 3: Playing Audio Response

**Frontend (React/TypeScript):**
```typescript
// Convert text to speech and play
async function playAudioResponse(text: string) {
  const response = await fetch(`${serverUrl}/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language: "en" })
  });
  
  if (!response.ok) return;
  
  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  
  const audio = new Audio(audioUrl);
  audio.play();
}
```

### Pattern 4: Executing DOM Actions

**Frontend (React/TypeScript):**
```typescript
// Execute action sequence from AI
async function executeActions(actions: string[]) {
  for (const elementId of actions) {
    const element = document.querySelector(
      `[data-unstuck-id="${elementId}"]`
    );
    
    if (!element) {
      console.warn(`Element not found: ${elementId}`);
      continue;
    }
    
    // Click element
    (element as HTMLElement).click();
    
    // Wait for page to respond
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}
```

---

## 🧪 TESTING EXAMPLES

### Test 1: Health Check
```bash
curl http://localhost:8787/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-28T04:00:00.000Z"
}
```

### Test 2: ASR Endpoint
```bash
curl -X POST http://localhost:8787/asr \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Find hotels in New York",
    "confidence": 0.95,
    "isFinal": true
  }'
```

**Expected Response:**
```json
{
  "text": "Find hotels in New York",
  "confidence": 0.95,
  "isFinal": true,
  "source": "Web Speech API (browser)",
  "requestId": "0.12345..."
}
```

### Test 3: TTS Endpoint (Save Audio)
```bash
curl -X POST http://localhost:8787/tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world, this is a test",
    "language": "en"
  }' \
  --output test-audio.mp3
```

**Result:** `test-audio.mp3` file created, playable in any audio player

### Test 4: Analyze Endpoint (Full Flow)
```bash
curl -X POST http://localhost:8787/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "userQuery": "Click the search button",
    "domString": "<html><body><button id=\"search\">Search</button></body></html>",
    "screenshot": "data:image/png;base64,iVBORw0KG...",
    "previousMessages": [],
    "sitemap": "Home > Search"
  }'
```

**Expected Response:**
```json
{
  "result": "{\"reasoning\":\"...\",\"actions\":[...],\"narration\":\"...\"}"
}
```

---

## 🔍 DEBUG LOGS EXPLANATION

### Backend Console Output Examples

**Normal Startup:**
```
✅ Environment file loaded
✅ Groq API key configured
🔌 Server listening on port 8787
```

**Voice Input Received:**
```
🎤 Received transcription from browser Web Speech API
   Text: Find flights to New York
   Confidence: 0.95
✅ Response: 200 OK
```

**AI Analysis:**
```
🧠 Analyzing with Groq (Llama 3.3 70B)...
   API Key present: gsk_csfl18Pno...
   Calling Groq API...
✅ Analysis complete (1.2 seconds)
   Actions: ["search-btn", "input-field", "submit"]
✅ Response: 200 OK
```

**Audio Generation:**
```
🔊 Generating audio for: "I found 10 flights..."
   Language: en
   Calling Google Translate TTS...
✅ Audio generated (28.5 KB)
✅ Response: 200 OK (audio/mpeg)
```

**Error Example:**
```
❌ Analyze Error: Groq API key not valid
   Status: 401
   Message: Invalid API key format
```

---

## 🛠️ COMMON MODIFICATIONS

### Change 1: Modify AI Prompt

**File:** `server/src/services/groq.js`

Find the system prompt (starts with "You are an AI assistant...") and modify:

```javascript
// Current instruction:
"Your goal is to determine the best sequence of actions..."

// Change to:
"Your goal is to explain what's on the page in simple terms..."
```

### Change 2: Add a New Backend Endpoint

**File:** `server/src/server.js`

Add after line 150:

```javascript
// ============================================
// MY NEW ENDPOINT
// ============================================
app.post("/my-endpoint", async (req, res) => {
  try {
    const { data } = req.body;
    console.log("📝 Processing:", data);
    
    // Your logic here
    const result = data.toUpperCase();
    
    return res.json({ success: true, result });
  } catch (error) {
    console.error("❌ Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
});
```

Then test:
```bash
curl -X POST http://localhost:8787/my-endpoint \
  -H "Content-Type: application/json" \
  -d '{"data": "hello"}'
```

### Change 3: Support Different Language

**Frontend (ChatWidget.tsx):**

Find Web Speech API initialization:
```typescript
// Current
const recognition = new window.SpeechRecognition();
recognition.lang = "en-US";

// Change to Spanish
recognition.lang = "es-ES";

// Or make it dynamic
recognition.lang = selectedLanguage;
```

**Backend (groq.js):**

Modify TTS endpoint call:
```javascript
// In /tts endpoint
const language = req.body.language || "en";

// Send to Google Translate with language code
const ttsUrl = `https://translate.google.com/translate_tts?...&tl=${language}`;
```

---

## 📊 PERFORMANCE OPTIMIZATION TIPS

### Tip 1: Cache Common Queries
```javascript
// In server.js, add a simple cache
const queryCache = new Map();

app.post("/analyze", async (req, res) => {
  const cacheKey = req.body.userQuery;
  
  // Check cache first
  if (queryCache.has(cacheKey)) {
    console.log("📦 Cache hit!");
    return res.json(queryCache.get(cacheKey));
  }
  
  // Process normally
  const result = await processQuery(...);
  
  // Store in cache
  queryCache.set(cacheKey, result);
  
  return res.json(result);
});
```

### Tip 2: Reduce DOM Size
```typescript
// In groq.js, before sending to AI
function minifyDOM(htmlString) {
  return htmlString
    .replace(/>\s+</g, "><")           // Remove whitespace
    .replace(/<!--.*?-->/g, "")        // Remove comments
    .replace(/\s{2,}/g, " ");         // Collapse spaces
}
```

### Tip 3: Implement Request Timeout
```javascript
// In server.js
const TIMEOUT = 30000; // 30 seconds

app.post("/analyze", async (req, res) => {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), TIMEOUT)
  );
  
  try {
    const result = await Promise.race([
      processQuery(...),
      timeoutPromise
    ]);
    return res.json(result);
  } catch (error) {
    return res.status(408).json({ error: "Request timeout" });
  }
});
```

---

## 🔧 ENVIRONMENT SETUP CHECKLIST

### Windows Setup
- [ ] Download Node.js from nodejs.org (v24+)
- [ ] Run installer, accept defaults
- [ ] Open PowerShell in project folder
- [ ] Run: `npm --version` (verify installation)
- [ ] Create `.dev.vars` with API key
- [ ] Run: `npm install` in server folder
- [ ] Run: `npm run dev` to start backend
- [ ] Run: `npm install` in client folder
- [ ] Run: `npm run dev` to start frontend
- [ ] Open: http://localhost:3000

### Mac Setup
```bash
# Install Node.js using Homebrew
brew install node

# Verify
node --version
npm --version

# Navigate to project
cd server
npm install
npm run dev

# In another terminal
cd client
npm install
npm run dev
```

### Linux Setup
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Fedora/RHEL
sudo dnf install nodejs npm

# Follow Mac instructions after installation
```

---

## 📞 API REFERENCE QUICK LINK

| Endpoint | Method | Input | Output | Use Case |
|----------|--------|-------|--------|----------|
| `/health` | GET | None | `{status}` | Server status check |
| `/asr` | POST | `{text, confidence}` | `{text, source}` | Log voice input |
| `/analyze` | POST | `{query, dom, screenshot}` | `{result, messages}` | AI analysis |
| `/tts` | POST | `{text, language}` | MP3 audio | Generate speech |

---

## 🎓 UNDERSTANDING THE AI RESPONSE

**Example Groq Response:**
```json
{
  "reasoning": "The user wants to find flights. I can see the page has a search box with id 'search-input' and a submit button with id 'find-flights'. The sequence is: (1) Click search box, (2) Type destination, (3) Click submit button.",
  
  "actions": ["search-input", "find-flights"],
  
  "narration": "Let me search for flights to New York. I'll click the search box and then search.",
  
  "taskAccomplished": false
}
```

**Breaking it down:**
- `reasoning`: Why the AI chose these actions
- `actions`: Array of element IDs to click (from `data-unstuck-id` attribute)
- `narration`: What to say to the user (gets converted to speech)
- `taskAccomplished`: Whether the task is complete (loop continues if false)

---

## 🐛 DEBUGGING TIPS

### Enable Verbose Logging
```javascript
// Add at top of server.js
const DEBUG = true;

// Then use:
if (DEBUG) console.log("Detailed info");
```

### Check Port Usage
```powershell
# Windows - Check if port 8787 is in use
netstat -ano | findstr :8787

# Kill process using port
taskkill /PID <PID> /F
```

### Monitor Frontend Requests
```typescript
// Add interceptor in ChatWidget.tsx
fetch(`${serverUrl}/analyze`, {
  // ... options
}).then(res => {
  console.log("Response status:", res.status);
  return res.json();
}).then(data => {
  console.log("Response data:", data);
});
```

---

## ✅ SUCCESS INDICATORS

When everything is working correctly, you should see:

**Backend Console:**
- ✅ "Server listening on port 8787"
- ✅ "Environment file loaded"
- ✅ "Groq API key configured"

**Frontend (Browser):**
- ✅ Chat widget visible
- ✅ Microphone button clickable
- ✅ No console errors

**Voice Input:**
- ✅ Microphone starts recording on click
- ✅ Text appears in chat after speaking
- ✅ "Analyzing..." message shows while processing

**Audio Output:**
- ✅ Speaker icon visible
- ✅ Audio plays after AI response
- ✅ Natural sounding voice (Google Translate)

**Logging:**
- ✅ "🎤 Received transcription" in backend console
- ✅ "🧠 Analyzing with Groq" message
- ✅ "🔊 Generating audio" message
- ✅ Response times 2-4 seconds total

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-28  
**Status:** Production Ready
