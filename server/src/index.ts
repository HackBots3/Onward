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