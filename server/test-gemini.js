#!/usr/bin/env node

// Test Gemini API directly
const fs = require("fs");
const path = require("path");

// Load .dev.vars
const envPath = path.join(__dirname, ".dev.vars");
const envContent = fs.readFileSync(envPath, "utf8");
const lines = envContent.split("\n");
let GEMINI_API_KEY = "";

lines.forEach((line) => {
  if (line.includes("GEMINI_API_KEY")) {
    GEMINI_API_KEY = line.split("=")[1].replace(/^"/, "").replace(/"$/, "").trim();
  }
});

console.log("\n🧪 Testing Gemini API...");
console.log(`API Key: ${GEMINI_API_KEY.substring(0, 10)}...`);

// Test with direct HTTP request
const testPayload = {
  model: "gemini-2.0-flash",
  messages: [
    {
      role: "user",
      content: "What is 2+2? Respond in one sentence.",
    },
  ],
};

async function testGemini() {
  try {
    // Try official Generative AI endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "What is 2+2? Respond in one sentence.",
                },
              ],
            },
          ],
        }),
      }
    );

    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      const error = await response.text();
      console.log(`Error: ${error}`);
      return;
    }

    const data = await response.json();
    console.log(`Response:`, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

testGemini();
