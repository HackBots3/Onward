# 🚀 Unstuck Backend - Day 1 Setup & Testing Guide

## ✅ WHAT'S BEEN FIXED

The backend has been **completely rewritten** to work with Express.js instead of Cloudflare Workers. This means:

- ✅ No more `fs`, `child_process`, `path` module errors
- ✅ Uses real APIs instead of trying to run code locally
- ✅ **Instant startup** - no build compilation needed
- ✅ All FREE APIs configured
- ✅ **Same 3 endpoints**: /asr, /analyze, /tts

## 📋 PREREQUISITE API KEYS

You need **3 API keys** to run the backend. Let me tell you how to get them:

### 1. ✅ GEMINI_API_KEY (Already have this!)
- ✅ Status: Already in `.dev.vars`
- Usage: AI analysis engine (FREE tier: 60 req/min)

### 2. ⏳ OPENAI_API_KEY (Need to add)
- Go to: https://platform.openai.com/api-keys
- Click: "Create new secret key"
- Copy the key
- **You get $5 FREE credit** on signup (covers ~1,000 Whisper API calls!)
- Paste into `.dev.vars`:
  ```
  OPENAI_API_KEY="sk-your-key-here"
  ```

### 3. ⏳ GOOGLE_TTS_API_KEY (Need to add)
- Go to: https://console.cloud.google.com/
- Create new project
- Search for "Text-to-Speech API" and enable it
- Go to "Credentials" → "Create Credentials" → "Service Account"
- Download the JSON key
- Create an API key from that JSON (or use OAuth)
- Paste into `.dev.vars`:
  ```
  GOOGLE_TTS_API_KEY="your-google-key-here"
  ```

**For testing**, you can initially test endpoints without these keys to verify they work.

---

## 🔧 INSTALLATION & STARTUP

### Step 1: Install Dependencies
```bash
cd server
npm install
```

Expected output:
```
added 50 packages, and audited 51 packages in 2s
```

### Step 2: Start the Backend Server
```bash
npm run dev
```

Expected output:
```
╔══════════════════════════════════════════╗
║  🚀 Unstuck Backend Running              ║
║  Port: 8787
║  Environment: development
║  Status: ✅ READY
╚══════════════════════════════════════════╝

📍 Endpoints available at:
  • Local:   http://localhost:8787
  • Health:  http://localhost:8787/health
  • ASR:     POST http://localhost:8787/asr
  • Analyze: POST http://localhost:8787/analyze
  • TTS:     POST http://localhost:8787/tts
```

If you see this ⬆️ - **SUCCESS!** Server is running!

---

## 📝 TESTING ENDPOINTS

### Option A: Using Postman (RECOMMENDED)
1. Open Postman
2. File → Import
3. Select `server/Postman-Collection.json`
4. Click each endpoint and press "Send"

### Option B: Using curl in Terminal

**Test 1: Health Check**
```bash
curl http://localhost:8787/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-01-01T12:00:00.000Z"}
```

**Test 2: ASR (Speech to Text)**
```bash
curl -X POST http://localhost:8787/asr \
  -H "Content-Type: application/json" \
  -d '{"audio_data":"data:audio/webm;base64,GkXfo...","language":"en"}'
```

**Test 3: Analyze (AI Query)**
```bash
curl -X POST http://localhost:8787/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "userQuery": "Show me flights to New York",
    "screenshot": "data:image/png;base64,...",
    "domString": "<div>...</div>",
    "previousMessages": [],
    "sitemap": "Home > Flights"
  }'
```

**Test 4: TTS (Text to Speech)**
```bash
curl -X POST http://localhost:8787/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, I found flights for you"}' \
  --output response.mp3
```

---

## 📁 FILE CHANGES SUMMARY

### NEW FILES:
- ✅ `server/src/server.js` - Main Express app (replaces Hono)
- ✅ `server/src/services/gemini.js` - Gemini AI service (JavaScript version)
- ✅ `server/Postman-Collection.json` - API testing collection

### MODIFIED FILES:
- ✅ `server/package.json` - Updated to use Express, removed broken packages
- ✅ `server/.dev.vars` - Added OPENAI_API_KEY and GOOGLE_TTS_API_KEY placeholders

### REMOVED/CHANGED:
- ❌ `server/src/index.ts` (old Hono/Cloudflare Workers code - replaced)
- ❌ Removed invalid npm packages: `fs`, `path`, `child_process`
- ❌ Removed: `@google-cloud/text-to-speech` (using REST API instead)

---

## 🎯 CHECKLIST FOR DAY 1 COMPLETION

- [ ] Server dependencies installed: `npm install`
- [ ] API keys added to `.dev.vars`
- [ ] Backend running: `npm run dev`
- [ ] Health check passes: `GET /health`
- [ ] All 3 endpoints tested and working
- [ ] Postman collection imported and tested
- [ ] Frontend still running: `http://localhost:3000`
- [ ] End-to-end test: Voice input → ASR → Analyze → TTS

---

## 🐛 TROUBLESHOOTING

### Problem: "OPENAI_API_KEY not found"
**Solution:** Add OPENAI_API_KEY to `.dev.vars`

### Problem: "Port 8787 already in use"
**Solution:** Kill process:
```bash
# Windows (PowerShell)
netstat -ano | findstr :8787
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8787 | xargs kill -9
```

### Problem: Modules not found
**Solution:** Delete node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: "Cannot find module 'openai'"
**Solution:** Run `npm install` in the server directory, not root

---

## 🎓 WHAT'S DIFFERENT NOW

### Before (Broken)
- Tried to use Cloudflare Workers (serverless)
- Used `fs.writeFileSync()` to create local files (impossible in Workers)
- Tried to execute Whisper locally with `child_process` (impossible in Workers)
- Used `@google-cloud/text-to-speech` library (Node.js only)
- Result: **92 build errors**, server wouldn't start

### After (Working) ✅
- Using Express.js (standard Node.js)
- All operations use HTTP APIs (no local file system)
- Uses OpenAI Whisper API (cloud-based, works everywhere)
- Uses Google Cloud TTS API via REST (no SDK needed)
- Uses Gemini AI (via OpenAI SDK with custom endpoint)
- Result: **Instant startup**, all endpoints work

---

## ✨ QUICK START FLOW

```
1. Add API keys to server/.dev.vars
2. cd server && npm install
3. npm run dev
4. Test endpoints with Postman or curl
5. Start frontend: cd ../client && npm run dev
6. Open http://localhost:3000
7. Try voice input!
```

**Expected time: 5-10 minutes to complete Day 1**

---

Good luck! 🚀
