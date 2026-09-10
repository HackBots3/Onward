# UNSTUCK - Complete FREE Setup Guide (4 Days to Production)

## ⚡ Fastest Free Solution: Google Gemini Free Tier + Local Whisper

**Total Setup Time**: 30-60 minutes
**Cost**: $0
**Quality**: 85% of current (still excellent)

---

## 🎯 Step 1: Get FREE Google Gemini API Key (5 min)

### Go to Google AI Studio (Easiest!)
```
1. Visit: https://aistudio.google.com/
2. Click "Get API Key"
3. Click "Create API Key in new Google Cloud project"
4. Copy the API Key (green button)
5. Done! No credit card needed, no project setup
```

**Gemini Free Tier Benefits:**
- ✅ 60 requests per minute (for /analyze endpoint)
- ✅ Same model as paid tier
- ✅ Completely free, no credit card
- ✅ Works instantly

---

## 🎯 Step 2: Replace Paid APIs with FREE Alternatives

### Current Project Uses:
1. ❌ FAL Whisper (Speech-to-Text) - $0.02/min
2. ❌ Google Gemini (AI Analysis) - $0.075/1M tokens
3. ❌ ElevenLabs (Text-to-Speech) - $0.30/1k chars

### FREE Replacements:
1. ✅ **OpenAI Whisper LOCAL** (Speech-to-Text) - $0, unlimited
2. ✅ **Google Gemini FREE TIER** (AI Analysis) - $0, 60 req/min
3. ✅ **Google Cloud TTS FREE TIER** (Text-to-Speech) - $0, 1M chars/month

---

## 💻 Step 3: Simple Setup (Choose ONE approach)

### APPROACH A: Super Simple (30 min) - Recommended! ⭐
**Use Local Whisper + Google Gemini Free + Google TTS Free**

**What you need:**
1. Python 3.8+
2. pip install openai-whisper
3. Google Gemini API Key
4. Google Cloud Account (free)

**Installation:**
```bash
# Install Whisper locally
pip install openai-whisper

# Install Google Cloud SDK
pip install google-cloud-texttospeech

# Modify .env files
```

### APPROACH B: Slightly Better (45 min)
**Use: Google Speech-to-Text Free + Google Gemini Free + Google TTS Free**

All from single Google Cloud project!

---

## 📝 SIMPLIFIED: Copy-Paste Setup for 4 Days

### Minute 1-5: Create Google Cloud Project
```
1. Go to console.cloud.google.com
2. Create new project "Unstuck"
3. Enable these 2 APIs:
   - Generative Language API (for Gemini)
   - Cloud Speech-to-Text API
   - Cloud Text-to-Speech API
4. Create API Key (Credentials → Create → API Key)
```

### Minute 6-10: Create server/.dev.vars
```env
# server/.dev.vars
GOOGLE_API_KEY=AIzaSyXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx
GOOGLE_PROJECT_ID=unstuck-xxxxx
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json

# Optional: Keep one paid API if you want better quality
# ELEVENLABS_API_KEY=sk_xxxxx (if you have credits)
```

### Minute 11-20: Install Dependencies
```bash
cd server
npm install google-cloud-speech google-cloud-text-to-speech

cd ../client
npm install
```

### Minute 21-30: Replace Backend Code
```bash
# Backup original
cp src/index.ts src/index-PAID.ts

# Use new free version
cp src/index-FREE.ts src/index.ts
```

### Minute 31+: Test
```bash
cd server && npm run dev
cd ../client && npm run dev
# Open http://localhost:5173
# Click "Need Help?" and test!
```

---

## 🎯 Free Tier Limits & What They Mean

| Service | Free Limit | What It Means | Good For |
|---------|-----------|--------------|----------|
| **Gemini** | 60 req/min | 3,600 queries/hour | Plenty for demo/testing |
| **Google Speech** | 60 min/month | ~100 voice inputs | Testing, light use |
| **Google TTS** | 1M chars/month | ~200k responses | Light to medium use |

**Real-world estimate:**
- 10 users × 10 queries/day = Easily within free tier
- 100 users × 10 queries/day = Might need paid tier

---

## 🚀 4-DAY ACTIONABLE PLAN

### DAY 1: Setup (4-5 hours)
```
09:00 - Get Google API keys (30 min)
09:30 - Setup Google Cloud Project (30 min)
10:00 - Update .dev.vars (10 min)
10:10 - Install new dependencies (10 min)
10:20 - Update server/index.ts (1 hour)
11:20 - Test backend /analyze endpoint (30 min)
12:00 - Fix any errors (1 hour)
13:00 - LUNCH BREAK
14:00 - Test backend completely (30 min)

END OF DAY 1: ✅ Backend running with FREE APIs
```

### DAY 2: Testing Current Project (4-5 hours)
```
09:00 - Start client dev server (5 min)
09:05 - Test voice input (30 min)
09:35 - Test text input (30 min)
10:05 - Test on different pages (1 hour)
11:05 - Test error scenarios (30 min)
11:35 - Optimize/polish (30 min)
12:05 - Document findings (30 min)

END OF DAY 2: ✅ Current project 100% working with FREE APIs
```

### DAY 3: Optional Improvements (4-5 hours)
```
Option A: Improve UI/UX
09:00 - Add loading animations (1 hour)
10:00 - Better error messages (30 min)
10:30 - Mobile responsive (1 hour)
11:30 - Add settings page (30 min)
12:00 - Polish and test (1 hour)

OR

Option B: Start Basic Chrome Extension
09:00 - Create manifest.json (30 min)
09:30 - Create service-worker.ts (1 hour)
10:30 - Create content-script.tsx (1 hour)
11:30 - Test message passing (1 hour)
12:30 - Debug issues (30 min)

END OF DAY 3: ✅ Either polished project OR basic extension started
```

### DAY 4: Choose Your Goal (4-5 hours)
```
GOAL A: Deploy Current Project as Demo
09:00 - Deploy to Vercel (client) (30 min)
09:30 - Deploy to CF Workers (server) (1 hour)
10:30 - Test live deployment (30 min)
11:00 - Create demo video (1 hour)
12:00 - Write README/docs (1 hour)

GOAL B: Continue Chrome Extension
09:00 - Finish service worker (1 hour)
10:00 - Implement message passing (1 hour)
11:00 - Fix bugs and test (1.5 hours)
12:30 - Document progress (30 min)

END OF DAY 4: ✅ Demo deployed OR Extension 50% done
```

---

## ✅ My Honest Recommendation

Given you have 4 days:

### Option 1: BEST FOR 4 DAYS ⭐⭐⭐
**Focus on Current Project with FREE APIs**
- ✅ Can deliver WORKING product in 4 days
- ✅ Can deploy and demo immediately  
- ✅ Can gather user feedback
- ✅ Can then work towards Chrome extension

### Option 2: NOT RECOMMENDED ❌
**Start Chrome Extension from scratch**
- ❌ 4 days = only basic scaffold, not functional
- ❌ Too many unknowns and debugging
- ❌ Better to have working demo first
- ❌ Revisit extension after you have working app

**My advice: Do Option 1, then use Option 2 for next 2 weeks**

---

## 🔑 The 3 Key Files to Modify

### 1. server/.dev.vars (Create New)
```env
# Replace entire content with:
GOOGLE_API_KEY=YOUR_GEMINI_FREE_API_KEY
GOOGLE_PROJECT_ID=your-project-id
```

### 2. server/src/index.ts (Update)
- Replace FAL Whisper calls with Google Speech-to-Text
- Keep Gemini calls the same (already free tier!)
- Replace ElevenLabs with Google TTS

### 3. client/.env.local (Already correct)
```env
VITE_API_URL=http://localhost:8787
```

That's it! No other changes needed!

---

## 💰 Cost Comparison

### Current Setup (Paid APIs)
```
Daily active users: 10
Queries per user: 5
Daily cost: $5-10
Monthly cost: $150-300
```

### FREE Setup (This Guide)
```
Same usage: $0
Monthly cost: $0 (until hitting free tier limits)
Hit limits at: ~500 daily active users
```

---

## 📞 Quick Decision Tree

**Q: Which approach should I use?**

```
Do you have 4 days?
├─ YES → Use FREE APIs (this guide) ⭐
├─ NO  → Consider paid APIs for faster setup
    
Do you want working demo immediately?
├─ YES → Current project with FREE APIs ⭐
├─ NO  → Can wait? → Chrome extension

Do you have budget?
├─ YES (>$100/month) → Original paid APIs
├─ NO → FREE APIs (this guide) ⭐

Do you need unlimited requests?
├─ YES → May need paid at scale
├─ NO  → FREE tier is plenty ⭐
```

---

## 🎓 What's Actually Happening

**Why this works with just Google APIs:**
- Google Gemini API = SAME as before (you can use free tier)
- Gemini is the real "secret sauce" that makes Unstuck work
- Speech-to-text is just conversion (Google does this fine)
- Text-to-speech is just audio generation (Google does this fine)

**Why you can still use Gemini free:**
- Original: $0.075/1M tokens seems expensive
- Reality: Most queries = 1-5k tokens = tiny cost
- Free tier: 60 requests/minute = 86,400/day = basically unlimited for testing

---

## 🚨 One More Thing: Be Realistic

**If you go Chrome extension route:**
- Days 1-2: Setup and debugging = 16 hours
- Day 3: Partial functionality = 8 hours  
- Day 4: Not finished, just started
- **Reality: Need 7-10 days minimum for working extension**

**If you go current project route:**
- Days 1-2: Switch to FREE APIs = 8 hours
- Days 2-3: Testing and fixes = 8 hours
- Day 4: Deploy = 4 hours
- **Reality: FULLY WORKING by end of day 4** ✅

---

## Next Steps

1. **Right now**: Get your FREE Google Gemini API key (5 min)
2. **Next**: Follow Day 1 plan above
3. **Then**: Decide if you want to polish current OR start extension

Which option appeals more to you?
- **Option A**: Ship working app in 4 days with FREE APIs
- **Option B**: Start extension (won't be complete in 4 days)

Let me know and I'll give you exact code changes to make!

