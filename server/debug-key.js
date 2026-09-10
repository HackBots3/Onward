// save as debug-key.js in same folder
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".dev.vars");
const envContent = fs.readFileSync(envPath, "utf8");

console.log("=== RAW .dev.vars content ===");
console.log(JSON.stringify(envContent)); // shows hidden chars, spaces, quotes

const lines = envContent.split("\n");
lines.forEach((line, i) => {
  if (line.includes("GROQ")) {
    console.log(`\nLine ${i}: ${JSON.stringify(line)}`); // exact raw line
    const eqIndex = line.indexOf("=");
    const val = line.substring(eqIndex + 1).replace(/^["']|["']$/g, "").trim();
    console.log(`Parsed key: "${val}"`);
    console.log(`Key length: ${val.length}`);
    console.log(`First 15 chars: ${val.substring(0, 15)}`);
  }
});