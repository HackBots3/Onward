# 🎧 POSTMAN TESTING GUIDE - Audio & API Endpoints

## 🎯 OVERVIEW - What Each API Does

### 1️⃣ **WEB SPEECH API** (Runs in Browser)
```
User speaks in microphone
    ↓
Browser's Web Speech API (free, built-in)
    ↓
Converts audio → text
    ↓
Sends text to backend /asr endpoint
```
**WHY:** Free speech recognition (no API key needed)
**QUALITY:** Good, works in all modern browsers
**COST:** $0.00

---

### 2️⃣ **GEMINI API** (Backend Analysis)
```
Text arrives: "Find hotels in New York"
DOM structure: <button>Search</button>
Screenshot: Current page
    ↓
Sent to Gemini AI
    ↓
Gemini analyzes and returns:
  "Click the search button, then type 'hotels in New York'"
    ↓
Actions sent back to frontend
```
**WHY:** AI brain that decides what buttons to click
**QUALITY:** Excellent, state-of-the-art AI
**COST:** $0.00 (FREE tier: 60 requests/minute)
**KEY NEEDED:** Yes (you already have it!) ✅

---

### 3️⃣ **GOOGLE TRANSLATE TTS** (Speech Synthesis)
```
Text: "I found 5 hotels for you"
    ↓
Sent to Google Translate API
    ↓
Google converts text → MP3 audio
    ↓
Audio played to user via speaker 🔊
```
**WHY:** Free text-to-speech (no alternatives needed)
**QUALITY:** Very good, natural sounding
**COST:** $0.00 (completely free, no billing)
**KEY NEEDED:** No! (Free API, no authentication)

---

## 📊 COST COMPARISON TABLE

| API | What It Does | Cost | Auth Key? | Setup Time |
|-----|-------------|------|-----------|------------|
| **Web Speech** | Audio → Text | FREE | ❌ No | 0 min (browser) |
| **Gemini** | Text → Actions | FREE | ✅ Yes* | 2 min |
| **Google Translate TTS** | Text → Audio | FREE | ❌ No | 0 min |
| **TOTAL SYSTEM** | Voice navigation | **$0.00** | 1 key only | 2 min |

*You already have Gemini key! ✅

---

## 🔧 TESTING SETUP

### Prerequisites
- Postman installed (free version ok)
- Backend running: `npm run dev` on port 8787 ✅
- Gemini API key in `.dev.vars` ✅

---

## 📝 ENDPOINT 1: HEALTH CHECK (Test Connection)

**Purpose:** Verify backend is responding

**Request:**
```
GET http://localhost:8787/health
```

**In Postman:**
1. Create new request
2. Method: `GET`
3. URL: `http://localhost:8787/health`
4. Click **Send**

**Expected Response:**
```json
{
    "status": "ok",
    "timestamp": "2026-05-28T12:34:56.789Z"
}
```

✅ If you see this, backend is working!

---

## 📝 ENDPOINT 2: ASR (Text Input from Web Speech API)

**Purpose:** Receive text that was already transcribed by browser Web Speech API

**Key Point:** Your browser already did the audio → text conversion using Web Speech API (free, built-in). This endpoint just receives that text.

**Request:**
```
POST http://localhost:8787/asr
Content-Type: application/json

{
  "text": "Find hotels in New York",
  "confidence": 0.95,
  "isFinal": true
}
```

**In Postman:**
1. Create new request
2. Method: `POST`
3. URL: `http://localhost:8787/asr`
4. Headers tab: Add `Content-Type: application/json`
5. Body tab → raw → paste:
```json
{
  "text": "Find hotels in New York",
  "confidence": 0.95,
  "isFinal": true
}
```
6. Click **Send**

**Expected Response:**
```json
{
    "text": "Find hotels in New York",
    "chunks": [],
    "confidence": 0.95,
    "isFinal": true,
    "source": "Web Speech API (browser)",
    "requestId": "0.123456789"
}
```

✅ This confirms text was received!

---

## 🧠 ENDPOINT 3: ANALYZE (AI Analysis - Gemini)

**Purpose:** Send DOM + user text → get back action sequence

**What Gemini does:**
- Reads the DOM structure
- Understands the user's query
- Returns list of buttons/elements to click in order

**Request:**
```
POST http://localhost:8787/analyze
Content-Type: application/json
```

**In Postman:**
1. Create new request
2. Method: `POST`
3. URL: `http://localhost:8787/analyze`
4. Headers tab: Add `Content-Type: application/json`
5. Body tab → raw → paste:

```json
{
  "userQuery": "Find flights to New York for next week",
  "screenshot": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "domString": "<html><body><div class='search-container'><input id='destination' type='text' placeholder='Destination'/><button id='search-btn' class='btn-primary'>Search Flights</button><button id='filters-btn'>Filters</button></div><div class='results'></div></body></html>",
  "previousMessages": [],
  "sitemap": "Home > Flights > Search > Results"
}
```

6. Click **Send**

**Expected Response (from Gemini):**
```json
{
    "result": "Looking at the search interface, I'll help you find flights to New York. Let me start by clicking the destination field and entering your search criteria.",
    "messages": [...]
}
```

✅ Gemini understood and provided analysis!

---

## 🔊 ENDPOINT 4: TTS (Text to Speech - Google Translate)

**Purpose:** Convert text → MP3 audio file (then save and play)

**How to test:**

1. Create new request
2. Method: `POST`
3. URL: `http://localhost:8787/tts`
4. Headers tab: Add `Content-Type: application/json`
5. Body tab → raw → paste:

```json
{
  "text": "I found 5 hotels in New York. The first option is a luxury 5-star hotel with excellent reviews. Would you like more details?",
  "language": "en"
}
```

6. Click **Send**

**What happens:**
- Backend calls Google Translate TTS API (FREE)
- Gets back MP3 audio
- Sends MP3 to Postman

**How to HEAR the audio in Postman:**

**Option A: Save Response as MP3 File**
1. After clicking Send, look at the **Response** section
2. Click the download icon (💾 Save Response)
3. Choose filename: `response.mp3`
4. Save to your computer
5. Open the MP3 file with any media player
6. 🔊 Listen to the audio!

**Option B: View Response Body**
1. Response section → Body tab
2. You'll see binary data (the MP3 file)
3. Right-click → Send to file → Save

**Option C: Check Response Headers**
1. Response section → Headers tab
2. You should see:
```
Content-Type: audio/mpeg
Content-Length: 45000
```

✅ This confirms audio was generated!

---

## 🎤 COMPLETE END-TO-END FLOW

### Step 1: Browser Records Audio (Web Speech API)
```
User clicks mic button
    ↓
Browser: "Say your query..."
User: "Find flights to New York"
    ↓
Web Speech API converts audio → text
    ↓
JavaScript sends to backend
```

### Step 2: Backend Analyzes (Gemini)
```
POST /analyze
Body: {
  "userQuery": "Find flights to New York",
  "domString": "<html>...</html>",
  ...
}
    ↓
Gemini API analyzes (FREE)
    ↓
Returns: "Click search box, type 'New York', click search"
```

### Step 3: Backend Returns Speech (Google Translate)
```
POST /tts
Body: {
  "text": "I found flights to New York..."
}
    ↓
Google Translate API converts to audio (FREE)
    ↓
Sends MP3 back
    ↓
Browser plays audio 🔊
```

---

## 🎧 HOW TO TEST AUDIO IN POSTMAN - 3 METHODS

### Method 1: Manual Audio Test (EASIEST) ✅

1. **Start the backend:** `npm run dev`
2. **Open Postman**
3. **Create TTS request** (as shown above)
4. **Click Send**
5. **See Response** → Binary MP3 data
6. **Click Save** → Download as MP3
7. **Open MP3** → Listen! 🔊

### Method 2: Use Collection Runner

1. Import `server/Postman-Collection.json` into Postman
2. Click **Collections** panel
3. Find "Unstuck Backend"
4. Click **Run** (triangle icon)
5. Click **Run Collection**
6. Watch all requests execute
7. Check TTS response for audio

### Method 3: Use Pre-Request Scripts (Advanced)

You can automate this with scripts, but **Method 1 is easiest for testing!**

---

## ✅ TESTING CHECKLIST

- [ ] **Health Check:** `GET /health` returns `{"status":"ok"}`
- [ ] **ASR:** `POST /asr` with text returns transcript
- [ ] **Analyze:** `POST /analyze` returns Gemini analysis
- [ ] **TTS:** `POST /tts` returns MP3 audio
- [ ] **Audio playback:** Save TTS response → play in media player
- [ ] **Total cost:** $0.00 ✅
- [ ] **API keys needed:** Only Gemini (you have it!)

---

## 🆓 WHY THESE APIs?

| API | Why Free? | Why This One? |
|-----|-----------|---------------|
| **Web Speech** | Browser built-in | No API calls needed, instant |
| **Gemini** | Google's free tier | Best AI quality for task planning |
| **Google Translate TTS** | Free service | Reliable, no auth needed |

---

## 🚀 NEXT STEPS

1. ✅ Test Health Check endpoint
2. ✅ Test ASR endpoint with sample text
3. ✅ Test Analyze endpoint with DOM
4. ✅ Test TTS endpoint and save MP3
5. ✅ Play the MP3 file
6. Start frontend: `cd ../client && npm run dev`
7. Test full end-to-end in browser

---

## 🆘 TROUBLESHOOTING

### Problem: "Cannot reach localhost:8787"
**Solution:** Make sure server is running: `npm run dev` in server folder

### Problem: /analyze returns error about Gemini key
**Solution:** Check `.dev.vars` has `GEMINI_API_KEY="..."`

### Problem: /tts returns empty response
**Solution:** Google Translate API might be rate-limited, wait 1 second and try again

### Problem: MP3 file plays no audio
**Solution:** Try another language or shorter text, some characters might not work

### Problem: "CORS error"
**Solution:** Backend CORS is enabled, but check browser console for details

---

## 📋 QUICK REFERENCE - Curl Commands

If you want to test from terminal instead of Postman:

```bash
# Health check
curl http://localhost:8787/health

# ASR (text input)
curl -X POST http://localhost:8787/asr \
  -H "Content-Type: application/json" \
  -d '{"text":"Find hotels in New York","confidence":0.95}'

# Analyze (Gemini)
curl -X POST http://localhost:8787/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "userQuery":"Find hotels",
    "domString":"<div>...</div>",
    "previousMessages":[],
    "sitemap":"Home"
  }'

# TTS (save to file)
curl -X POST http://localhost:8787/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world"}' \
  --output audio.mp3

# Play the audio
# macOS/Linux:
open audio.mp3
# Windows:
start audio.mp3
```

---

**You're all set!** 🚀 $0.00, no credit card, fully functional. Good luck!
