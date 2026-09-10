# 🔑 GEMINI API KEY - SETUP GUIDE (FIXES 400 ERROR)

## 🚨 THE PROBLEM

The Gemini API key you have (AIzaSyCrWm...) is returning:
```
"API key not valid. Please pass a valid API key."
```

This means the key either:
- ❌ Is not enabled for the Gemini API
- ❌ Is old/expired
- ❌ Has API restrictions
- ❌ Is from the wrong project

## ✅ SOLUTION - Create a Fresh API Key

### Step 1: Go to Google AI Studio
1. Open: https://aistudio.google.com/
2. Click **"Get API key"** in the top bar
3. Select **"Create API key in new Google Cloud project"**
4. A new window will open showing your API key

### Step 2: Copy the NEW API Key
```
The key looks like: AIzaSy... (your new one)
```

### Step 3: Update `.dev.vars`
Replace the old key with the new one:
```
GEMINI_API_KEY="AIzaSy_YOUR_NEW_KEY_HERE"
```

### Step 4: Restart Server
```bash
npm run dev
```

### Step 5: Test Again
```bash
node test-gemini.js
```

---

## 📋 STEP-BY-STEP WITH SCREENSHOTS

### 1. Open Google AI Studio
```
URL: https://aistudio.google.com/
```

You should see:
```
┌─────────────────────────────────────┐
│  Welcome to Google AI Studio        │
│  Get API key                    [▼] │
└─────────────────────────────────────┘
```

### 2. Click "Get API key"
Look for the button/menu in the top right corner

### 3. Select "Create API key"
Choose: "Create API key in new Google Cloud project"

### 4. Copy the Key
Google will show:
```
Your API Key:
┌──────────────────────────────────┐
│ AIzaSy_xxxxxxxxxxxxxxxxxxxx      │ ← Copy this!
└──────────────────────────────────┘
```

### 5. Paste in `.dev.vars`

Find this file: `server/.dev.vars`

Replace:
```
# OLD (doesn't work)
 GEMINI_API_KEY="your_old_gemini_api_key_here"

# NEW (from aistudio.google.com)
GEMINI_API_KEY="AIzaSy_YOUR_FRESH_KEY"
```

### 6. Save and Restart
```bash
# Stop server: Ctrl+C
# Then restart:
npm run dev
```

### 7. Test Gemini
```bash
node test-gemini.js
```

Expected output:
```
🧪 Testing Gemini API...
API Key: AIzaSy...
Response status: 200
Response: { choices: [...], model: "gemini-2.0-flash" }
```

---

## 🆘 STILL NOT WORKING?

### Issue: "Still getting 400 error"

**Try this alternative method:**

```bash
# 1. Delete current key from .dev.vars
# 2. Go to: https://console.cloud.google.com/
# 3. Create new Project
# 4. Enable "Generative Language API"
# 5. Create API Key (Credentials → Create Credentials)
# 6. Paste new key in .dev.vars
# 7. Restart server
```

### Issue: "Can't find Get API key button"

**Try this:**
1. Go to: https://ai.google.dev/
2. Look for "Get API Key" or "Get started"
3. Click that button
4. Choose "Create API key"

### Issue: "Key still not working after trying everything"

**Use fallback mode (no AI, but system still works):**
```javascript
// Edit server/src/server.js line 80
// Change ANALYZE endpoint to return mock response
// This lets you test other parts while you fix Gemini
```

---

## ✅ VERIFY THE KEY WORKS

Once you add the new key, test with this command:

```bash
node test-gemini.js
```

You should see:
```
🧪 Testing Gemini API...
API Key: AIzaSy...
Response status: 200
Response: {
  "id": "...",
  "model": "gemini-2.0-flash",
  "choices": [...]
}
```

If you see status `200` - **SUCCESS!** ✅

Then restart server:
```bash
npm run dev
```

And test endpoints:
```bash
node test-endpoints.js
```

All 4 should pass now! ✅

---

## 💡 WHY IS THIS HAPPENING?

The Gemini API is managed by Google Cloud. Even though it's free, Google needs to:
1. Verify you have a Google account
2. Make sure you're not a bot
3. Track API usage (so they know it's free tier)

This requires creating a proper API key through their official system.

---

## 🎯 QUICK CHECKLIST

- [ ] Open https://aistudio.google.com/
- [ ] Click "Get API key"
- [ ] Select "Create API key in new project"
- [ ] Copy the NEW key
- [ ] Paste into `server/.dev.vars`
- [ ] Save file
- [ ] Run: `npm run dev`
- [ ] Run: `node test-gemini.js`
- [ ] Verify you see status `200`
- [ ] Run: `node test-endpoints.js`
- [ ] All 4/4 tests should pass! ✅

---

**Once this is fixed, your system is 100% operational!** 🚀

Estimated time: **5 minutes**
