#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".dev.vars");
const envContent = fs.readFileSync(envPath, "utf8");
const lines = envContent.split("\n");
let GROQ_API_KEY = "";

lines.forEach((line) => {
  if (line.includes("GROQ_API_KEY")) {
    const eqIndex = line.indexOf("=");
    GROQ_API_KEY = line
      .substring(eqIndex + 1)
      .replace(/\r/g, "")
      .replace(/^["']|["']$/g, "")
      .trim();
  }
});

console.log("\n🧪 Testing Groq API...");
console.log(`API Key: ${GROQ_API_KEY.substring(0, 10)}...`);

async function testGroq() {
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: "What is 2+2? Respond in one sentence.",
            },
          ],
          max_tokens: 100,
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
    console.log(`\n✅ Answer: ${data.choices[0].message.content}`);

  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

testGroq();