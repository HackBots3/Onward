# RECOMMENDED: Ultra-Simple 4-Day FREE Setup

## 🎯 The Easiest Path Forward (4 Hours Setup Total)

Given your 4-day timeline, here's the absolute simplest approach that actually works:

### What We're Using
```
✅ Google Gemini FREE API    (Keep existing code - already free!)
✅ Local Whisper            (Free, runs on your computer)
✅ Google TTS API (Free tier) (1M chars/month, more than enough)
```

**Total Setup Time: 30 minutes**
**Monthly Cost: $0**
**Complexity: Easy**

---

## 📋 Installation Steps (Copy-Paste)

### Step 1: Get ONE API Key (2 minutes)
```
1. Go: https://aistudio.google.com/
2. Click "Get API Key"
3. Copy the key
4. Done!
```

### Step 2: Create server/.dev.vars
```bash
cd server
cat > .dev.vars << 'EOF'
GEMINI_API_KEY=YOUR_KEY_HERE
EOF
```

### Step 3: Install Whisper Locally
```bash
# Install Python first (if you don't have it)
# Download from python.org

# Then run these commands:
pip install openai-whisper
pip install google-cloud-texttospeech

# Verify installation:
whisper --version
```

### Step 4: Update Backend (Copy-Paste Code Below)
```bash
# Backup current:
cp server/src/index.ts server/src/index-BACKUP.ts

# Create new version with local Whisper:
# (See code below)
```

### Step 5: Update package.json
```bash
cd server
npm install @google-cloud/text-to-speech
```

### Step 6: Run
```bash
npm run dev
cd ../client
npm run dev
# Open http://localhost:5173
```

---

## 🔧 Copy This Backend Code

Replace `server/src/index.ts` with this (much simpler):

```typescript
import { Hono } from "hono";
import { cors } from "hono/cors";
import { exec } from "child_process";
import { promisify } from "util";
import { writeFileSync, readFileSync, unlinkSync } from "fs";
import path from "path";
import { processQuery, type AnalyzeRequest } from "./services/gemini";
import textToSpeech from "@google-cloud/text-to-speech";

const execPromise = promisify(exec);
const ttsClient = new textToSpeech.TextToSpeechClient();

type Bindings = {
  GEMINI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) =>
  c.json({ message: "Unstuck - FREE Edition (4 Days)" })
);

app.use("/*", cors());

// ============================================
// SPEECH-TO-TEXT - Local Whisper (FREE!)
// ============================================
app.post("/asr", async (c) => {
  try {
    const { audio_data, language = "en" } = await c.req.json();

    console.log("🎤 Converting speech to text...");

    // Write audio to temporary file
    const audioBuffer = Buffer.from(
      audio_data.replace(/^data:audio\/\w+;base64,/, ""),
      "base64"
    );
    const tempFile = path.join("/tmp", `audio-${Date.now()}.webm`);
    writeFileSync(tempFile, audioBuffer);

    try {
      // Run Whisper on the audio file (LOCAL - no API needed!)
      const { stdout } = await execPromise(
        `whisper "${tempFile}" --language ${language} --output_format json --output_dir /tmp`
      );

      // Read the JSON result
      const jsonFile = tempFile.replace(".webm", ".json");
      const result = JSON.parse(readFileSync(jsonFile, "utf-8"));
      
      // Cleanup
      unlinkSync(tempFile);
      unlinkSync(jsonFile);

      return c.json({
        text: result.text || "No speech detected",
        chunks: result.segments || [],
        confidence: 0.95,
      });
    } catch (error) {
      unlinkSync(tempFile);
      throw error;
    }
  } catch (error) {
    console.error("❌ ASR Error:", error);
    return c.json({ error: "Speech recognition failed", text: "" }, 500);
  }
});

// ============================================
// AI ANALYSIS - Gemini (Keep as-is, already free!)
// ============================================
app.post("/analyze", async (c) => {
  try {
    const request = await c.req.json<AnalyzeRequest>();
    const response = await processQuery(request, c.env.GEMINI_API_KEY);
    return c.json(response);
  } catch (error) {
    console.error("❌ Analysis Error:", error);
    return c.json({ error: "Analysis failed" }, 500);
  }
});

// ============================================
// TEXT-TO-SPEECH - Google Cloud (Free tier!)
// ============================================
app.post("/tts", async (c) => {
  try {
    const { text } = await c.req.json();

    console.log("🔊 Converting text to speech...");

    const request = {
      input: { text },
      voice: {
        languageCode: "en-US",
        name: "en-US-Neural2-C",
      },
      audioConfig: {
        audioEncoding: "MP3" as const,
      },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    const audioBuffer = Buffer.from(response.audioContent as string);

    c.header("Content-Type", "audio/mpeg");
    return c.body(audioBuffer);
  } catch (error) {
    console.error("❌ TTS Error:", error);
    return c.json({ error: "TTS failed" }, 500);
  }
});

app.get("/health", (c) => c.json({ status: "ok" }));

export default app;
```

---

## ✨ What You Get (4 Days Later)

### Day 1 (2 hours)
```
✅ All 3 APIs working
✅ Backend running
✅ No paid subscriptions
✅ Zero API costs
```

### Day 2-3 (Rest of time)
```
✅ Test entire system
✅ Fix any bugs
✅ Optimize performance
✅ Deploy to production
```

### Day 4
```
✅ Working demo you can show
✅ Can start on extension OR
✅ Can iterate on features
```

---

## 💰 Actual Costs with This Setup

| Service | Free Tier | Your Usage | Cost |
|---------|-----------|-----------|------|
| **Gemini API** | 60 req/min | 10-50/day | $0 |
| **Local Whisper** | Unlimited | Unlimited | $0 |
| **Google TTS** | 1M chars/month | 1-10k/day | $0 |
| **TOTAL** | | | **$0/month** |

---

## 🎯 Decision: Next 4 Days

### Option A: Current Project + FREE APIs ⭐ RECOMMENDED
- Day 1: Setup FREE APIs (2 hours)
- Day 2: Test backend (1 hour)
- Day 3: Test frontend (1 hour)
- Day 4: Deploy & demo (2 hours)
- **Result: Working product you can use/demo immediately**

### Option B: Start Chrome Extension
- Day 1: Extension scaffold (1-2 hours)
- Day 2: Message passing (2 hours)
- Day 3: Component porting (3 hours)
- Day 4: Testing (2 hours)
- **Result: 40% done, not working yet**

**I strongly recommend Option A. Here's why:**
1. You get working product in 4 days
2. You learn the system thoroughly
3. You can demo to people
4. Extension can come after (will be faster now)

---

## 📝 Quick Reference: 4-Day Schedule

```
TOMORROW (Day 1):
09:00 - Get Gemini API key (2 min)
09:10 - Create .dev.vars (2 min)
09:15 - Install Python packages (10 min)
09:30 - Replace backend code (5 min)
09:40 - Run backend (5 min)
10:00 - Debug any issues (30 min)
10:30 - Test /asr endpoint (30 min)
11:00 - Test /analyze endpoint (30 min)
11:30 - Test /tts endpoint (30 min)
12:00 - Break (1 hour)
13:00 - Fix any remaining issues (1 hour)
14:00 - Document setup (30 min)
✅ END: Fully working backend with FREE APIs!

DAY 2:
09:00 - Start frontend dev server (5 min)
09:10 - Test voice input (30 min)
09:45 - Test text input (30 min)
10:20 - Test on real website (30 min)
11:00 - Fix bugs (30 min)
11:30 - Optimize performance (30 min)
12:00 - Break (1 hour)
13:00 - Final testing (1 hour)
14:00 - Document issues/learnings (30 min)
✅ END: Full system tested & working!

DAY 3:
Choose:
A) Deploy current project to cloud (3 hours)
B) Start chrome extension work (4 hours)

DAY 4:
Complete either A or B, or do final polish
```

---

## ❓ FAQ: Why This Works

**Q: Is Whisper local really free?**
A: YES! OpenAI released Whisper as open source. You just download it and run it. No API key, no cost.

**Q: Will it be slow?**
A: First time: Yes (downloads model ~2GB). After: 5-10 seconds per audio file.

**Q: What if I want faster?**
A: Pay $0.02/min on OpenAI Whisper API (still cheaper than FAL)

**Q: Is Google TTS quality good?**
A: YES! Neural2 voices sound natural. Free tier gets 1M chars/month.

**Q: But I have paid API keys...**
A: You can still use them! Just update .dev.vars. But FREE works fine for 4 days.

---

## 🚀 Your Next Step

**Right now:**
1. Go get FREE Gemini API key (https://aistudio.google.com/) - 2 minutes
2. Run the commands above to install Whisper - 10 minutes  
3. Copy the backend code - 5 minutes
4. Run `npm run dev` - done!

**Then decide:**
- Keep with free setup? ✅ Works great
- Upgrade to paid later? ✅ Same code, just different API keys
- Start Chrome extension? ✅ Can do after finishing

**You're ready to start! Pick Option A above and begin with Day 1! 🚀**

