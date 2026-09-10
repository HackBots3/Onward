// server/src/index.ts - MODIFIED FOR FREE GOOGLE APIs
import { Hono } from "hono";
import { cors } from "hono/cors";
import { processQuery, type AnalyzeRequest } from "./services/gemini";
import speech from "@google-cloud/speech";
import textToSpeech from "@google-cloud/text-to-speech";

// Define environment bindings type
type Bindings = {
  GOOGLE_API_KEY: string; // Single API key for all Google services
};

const app = new Hono<{ Bindings: Bindings }>();

// Initialize Google clients
const speechClient = new speech.SpeechClient({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const ttsClient = new textToSpeech.TextToSpeechClient({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

app.get("/", (c) => {
  return c.json({ message: "Unstuck Backend - FREE APIs Edition" });
});

app.use("/*", cors());

// ============================================
// SPEECH-TO-TEXT Endpoint (Google Cloud Speech)
// ============================================
app.post("/asr", async (c) => {
  try {
    const { audio_data, language = "en-US" } = await c.req.json<{
      audio_data: string;
      language?: string;
    }>();

    if (!audio_data) {
      return c.json({ error: "Audio data is required" }, 400);
    }

    console.log("Starting ASR with Google Cloud Speech-to-Text...");

    // Convert base64 to binary
    const audioBuffer = Buffer.from(
      audio_data.replace(/^data:audio\/\w+;base64,/, ""),
      "base64"
    );

    // Request to Google Speech-to-Text API
    const request = {
      config: {
        encoding: "WEBM_OPUS" as const,
        sampleRateHertz: 48000,
        languageCode: language,
      },
      audio: {
        content: audioBuffer,
      },
    };

    console.log("Calling Google Cloud Speech-to-Text API...");
    const [response] = await speechClient.recognize(request);

    if (!response.results || response.results.length === 0) {
      return c.json({
        text: "",
        confidence: 0,
        error: "No speech detected",
      });
    }

    const transcription = response.results
      .map(
        (result) =>
          result.alternatives?.[0]?.transcript ||
          ""
      )
      .join("\n");

    const confidence = response.results[0].alternatives?.[0]?.confidence || 0;

    console.log("Transcription successful:", transcription);

    return c.json({
      text: transcription,
      confidence,
      requestId: Math.random().toString(),
    });
  } catch (error) {
    console.error("Error in ASR endpoint:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "ASR failed" },
      500
    );
  }
});

// ============================================
// AI ANALYSIS Endpoint (Google Gemini)
// ============================================
app.post("/analyze", async (c) => {
  try {
    const request = await c.req.json<AnalyzeRequest>();
    
    // Gemini endpoint remains the same - uses Google API Key
    const response = await processQuery(request, c.env.GOOGLE_API_KEY);
    
    return c.json(response);
  } catch (error) {
    console.error("Error analyzing query:", error);
    return c.json({ error: "Failed to analyze query" }, 500);
  }
});

// ============================================
// TEXT-TO-SPEECH Endpoint (Google Cloud TTS)
// ============================================
app.post("/tts", async (c) => {
  try {
    const { text } = await c.req.json<{ text: string }>();

    if (!text) {
      return c.json({ error: "Text is required" }, 400);
    }

    console.log("Starting TTS with Google Cloud Text-to-Speech...");

    const request = {
      input: { text },
      voice: {
        languageCode: "en-US",
        name: "en-US-Neural2-C", // Female voice
      },
      audioConfig: {
        audioEncoding: "MP3" as const,
        pitch: 0,
        speakingRate: 1,
      },
    };

    console.log("Calling Google Cloud Text-to-Speech API...");
    const [response] = await ttsClient.synthesizeSpeech(request);

    if (!response.audioContent) {
      throw new Error("No audio content generated");
    }

    // Convert audio content to base64
    const audioBase64 = Buffer.from(response.audioContent as string).toString(
      "base64"
    );

    // Create audio blob response
    const audioBuffer = Buffer.from(response.audioContent as string);

    c.header("Content-Type", "audio/mpeg");
    c.header("Content-Length", audioBuffer.length.toString());

    return c.body(audioBuffer);
  } catch (error) {
    console.error("Error in TTS endpoint:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "TTS failed" },
      500
    );
  }
});

// ============================================
// HEALTH CHECK
// ============================================
app.get("/health", (c) => {
  return c.json({ status: "ok", version: "1.0.0-free" });
});

export default app;
