// server/src/server.js - Express Backend with 100% FREE APIs
// No credit card needed! All APIs are completely free.

const express = require("express");
const cors = require("cors");
const { processQuery } = require("./services/groq"); // ← changed
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Load .dev.vars file manually
function loadEnvFile() {
  const envPath = path.join(__dirname, "../.dev.vars");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    const lines = envContent.split("\n");
    lines.forEach((line) => {
      if (!line.trim().startsWith("#") && line.includes("=")) {
        const eqIndex = line.indexOf("=");
        const key = line.substring(0, eqIndex).trim();
        const value = line
          .substring(eqIndex + 1)
          .replace(/\r/g, "")           // ← fix Windows line endings
          .replace(/^["']|["']$/g, "")
          .trim();
        process.env[key] = value;
      }
    });
  }
}

loadEnvFile();

// ============================================
// HEALTH CHECK
// ============================================
app.get("/", (req, res) => {
  res.json({
    message: "Unstuck Backend - 100% FREE APIs Edition",
    status: "✅ Running",
    endpoints: {
      asr: "POST /asr (Web Speech API preprocessing)",
      analyze: "POST /analyze (Groq FREE API)",       // ← changed
      tts: "POST /tts (Google Translate FREE API)",
      health: "GET /health",
    },
    apis: {
      groq: "FREE - 14,400 req/day",                  // ← changed
      googleTranslateTTS: "FREE - no auth needed",
      webSpeechAPI: "FREE - browser built-in",
    },
    totalCost: "$0.00",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ============================================
// ASR - SPEECH-TO-TEXT Endpoint
// ============================================

app.post("/asr", async (req, res) => {
  try {
    const { text, audio_data, confidence = 1.0, isFinal = true } = req.body;

    // Old client sent audio_data blob — now handled in browser via Web Speech API
    if (audio_data && !text) {
      return res.status(400).json({
        error:
          "Server-side audio transcription is not supported. " +
          "Speech is now transcribed in the browser using Web Speech API.",
        text: "",
      });
    }

    if (!text) {
      return res.status(400).json({
        error: "Text is required.",
        text: "",
      });
    }

    console.log("🎤 Received transcription from browser Web Speech API");
    console.log("   Text:", text);
    console.log("   Confidence:", confidence);

    return res.json({
      text,
      chunks: [],
      confidence,
      isFinal,
      source: "Web Speech API (browser)",
      requestId: Math.random().toString(),
    });
  } catch (error) {
    console.error("❌ ASR Error:", error.message);
    return res.status(500).json({
      error: "Speech processing failed: " + error.message,
      text: "",
    });
  }
});

// ============================================
// AI ANALYSIS Endpoint (Groq)                  ← changed
// ============================================
app.post("/analyze", async (req, res) => {
  try {
    const request = req.body;

    console.log("🧠 Analyzing with Groq (Llama 3.3 70B)...");  // ← changed

    const response = await processQuery(request, process.env.GROQ_API_KEY); // ← changed

    console.log("✅ Analysis complete");

    return res.json(response);
  } catch (error) {
    console.error("❌ Analysis Error:", error.message);
    return res.status(500).json({
      error: "Failed to analyze query: " + error.message,
    });
  }
});

// ============================================
// TTS - TEXT-TO-SPEECH Endpoint
// ============================================
app.post("/tts", async (req, res) => {
  try {
    const { text, language = "en" } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    console.log("🔊 Converting text to speech with Google Translate API...");
    console.log("   Text:", text.substring(0, 50) + "...");

    if (text.length > 1000) {
      return res.status(400).json({
        error: "Text too long (max 1000 characters)",
      });
    }

    const encodedText = encodeURIComponent(text);
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${language}&client=tw-ob`;

    const audioResponse = await fetch(ttsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!audioResponse.ok) {
      throw new Error(`Google Translate API failed: ${audioResponse.status}`);
    }

    const audioArrayBuffer = await audioResponse.arrayBuffer();
    const audioBuffer = Buffer.from(audioArrayBuffer);

    if (audioBuffer.length === 0) {
      throw new Error("No audio content generated");
    }

    console.log("✅ TTS successful");
    console.log(`   Audio size: ${(audioBuffer.length / 1024).toFixed(2)} KB`);

    res.set("Content-Type", "audio/mpeg");
    res.set("Content-Length", audioBuffer.length);
    res.set("Cache-Control", "no-cache");
    res.send(audioBuffer);
  } catch (error) {
    console.error("❌ TTS Error:", error.message);
    return res.status(500).json({
      error: "TTS failed: " + error.message,
    });
  }
});

// ============================================
// ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 8787;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║  🚀 Unstuck Backend - 100% FREE Edition        ║
║  Port: ${PORT}                                 ║
║  Status: ✅ READY                              ║
║  Cost: $0.00 (No credit card needed!)          ║
╚════════════════════════════════════════════════╝

💰 FREE APIs being used:
  • Groq AI (Llama 3.3 70B): 14,400 req/day FREE
  • Google Translate TTS: Unlimited FREE
  • Web Speech API: Browser built-in FREE

📍 Endpoints:
  • Health:  GET  http://localhost:${PORT}/health
  • ASR:     POST http://localhost:${PORT}/asr
  • Analyze: POST http://localhost:${PORT}/analyze
  • TTS:     POST http://localhost:${PORT}/tts
`);
});

module.exports = app;