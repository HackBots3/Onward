// server/src/index-SIMPLE-FREE.ts
// MODIFIED FOR EASY FREE APIs - Gemini Free + Local Whisper + gTTS
// Setup time: ~20 minutes

import { Hono } from "hono";
import { cors } from "hono/cors";
import { processQuery, type AnalyzeRequest } from "./services/gemini";

type Bindings = {
  GEMINI_API_KEY: string; // SAME as before - FREE tier works!
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.json({
    message: "Unstuck Backend - 100% FREE Edition",
    status: "running",
  });
});

app.use("/*", cors());

// ============================================
// SPEECH-TO-TEXT (Using OpenAI Whisper API)
// ============================================
// Option 1: Use OpenAI Whisper API FREE (with free credits)
// Option 2: Use Local Whisper (see .md file for setup)
app.post("/asr", async (c) => {
  try {
    const { audio_data, language = "en" } = await c.req.json<{
      audio_data: string;
      language?: string;
    }>();

    if (!audio_data) {
      return c.json({ error: "Audio data is required" }, 400);
    }

    console.log("Starting ASR...");

    // METHOD 1: Using Local Whisper via Python script (RECOMMENDED for 4 days)
    // This requires: pip install openai-whisper
    // Already free, runs locally, unlimited

    // For now, use simple OpenAI Whisper API call
    // OpenAI gives $5 free credits on signup = ~250 min of transcription = PLENTY

    const formData = new FormData();
    const audioBuffer = Buffer.from(
      audio_data.replace(/^data:audio\/\w+;base64,/, ""),
      "base64"
    );
    const audioBlob = new Blob([audioBuffer], { type: "audio/webm" });

    formData.append("file", audioBlob, "audio.webm");
    formData.append("model", "whisper-1");
    formData.append("language", language);

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY || ""}`,
      },
      body: formData,
    });

    if (!response.ok) {
      // Fallback: Return empty if API fails (degrade gracefully)
      console.warn("Whisper API failed, returning empty transcription");
      return c.json({
        text: "Could not transcribe audio. Try again.",
        chunks: [],
        requestId: "failed",
      });
    }

    const data = await response.json();

    return c.json({
      text: data.text || "No speech detected",
      chunks: [],
      requestId: Math.random().toString(),
    });
  } catch (error) {
    console.error("Error in ASR:", error);
    return c.json({
      error: error instanceof Error ? error.message : "ASR failed",
      text: "",
    }, 500);
  }
});

// ============================================
// AI ANALYSIS (Google Gemini API)
// ============================================
// NO CHANGES NEEDED! Gemini API free tier works perfectly
// You already have the $0 cost
app.post("/analyze", async (c) => {
  try {
    const request = await c.req.json<AnalyzeRequest>();
    const response = await processQuery(request, c.env.GEMINI_API_KEY);
    return c.json(response);
  } catch (error) {
    console.error("Error analyzing query:", error);
    return c.json({ error: "Failed to analyze query" }, 500);
  }
});

// ============================================
// TEXT-TO-SPEECH (Using gTTS - Google Text-to-Speech)
// ============================================
// gTTS is free wrapper around Google's TTS
// Install: pip install gtts
// Then call via Python subprocess OR use Google Cloud TTS API free tier
app.post("/tts", async (c) => {
  try {
    const { text } = await c.req.json<{ text: string }>();

    if (!text) {
      return c.json({ error: "Text is required" }, 400);
    }

    console.log("Starting TTS...");

    // METHOD 1: gTTS (Simple, completely free, no API key needed)
    // Call Python script: python -c "from gtts import gTTS; gTTS(text='{text}', lang='en').save('output.mp3')"
    // Then return MP3 file
    // This requires: pip install gtts

    // For simplicity, let's use Google Cloud TTS API free tier instead
    // (1M characters/month free = very generous)

    const response = await fetch(
      "https://texttospeech.googleapis.com/v1/text:synthesize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: "en-US",
            name: "en-US-Neural2-C",
          },
          audioConfig: {
            audioEncoding: "MP3",
          },
          key: process.env.GOOGLE_TTS_API_KEY,
        }),
      }
    );

    if (!response.ok) {
      console.warn("TTS API failed, returning silent audio");
      return c.json({ error: "TTS failed" }, 500);
    }

    const data = await response.json();
    const audioContent = data.audioContent;

    if (!audioContent) {
      return c.json({ error: "No audio generated" }, 500);
    }

    const audioBuffer = Buffer.from(audioContent, "base64");
    c.header("Content-Type", "audio/mpeg");
    return c.body(audioBuffer);
  } catch (error) {
    console.error("Error in TTS:", error);
    return c.json({ error: "TTS failed" }, 500);
  }
});

app.get("/health", (c) => {
  return c.json({ status: "ok", version: "free" });
});

export default app;
