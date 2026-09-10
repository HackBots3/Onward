#!/usr/bin/env node

// Quick test script to verify all endpoints
// Run with: node test-endpoints.js

const BASE_URL = "http://localhost:8787";

async function test(name, method, endpoint, body) {
  console.log(`\n✓ Testing: ${name}`);
  console.log(`  ${method} ${endpoint}`);

  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    const contentType = response.headers.get("content-type") || "";
    let data;

    if (contentType.includes("audio")) {
      const bytes = response.headers.get("content-length");
      data = `🔊 Audio file received (${bytes} bytes) ✅`;
    } else {
      data = await response.json();
    }

    console.log(`  Status: ${response.status} ${response.ok ? "✅" : "❌"}`);
    console.log(
      `  Response:`,
      typeof data === "string" ? data : JSON.stringify(data, null, 2)
    );

    return response.ok;
  } catch (error) {
    console.log(`  ❌ ERROR: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log(`
╔════════════════════════════════════════════╗
║  Unstuck Backend - Endpoint Tests          ║
║  Server:  http://localhost:8787            ║
║  AI:      Groq (Llama 3.3 70B) FREE ✅    ║
╚════════════════════════════════════════════╝
`);

  const results = {};

  // ── 1. Health Check ───────────────────────────────────────────────────────
  results.health = await test("Health Check", "GET", "/health");

  // ── 2. ASR ────────────────────────────────────────────────────────────────
  results.asr = await test("ASR - Speech Text Input", "POST", "/asr", {
    text: "Find hotels in New York",
    confidence: 0.95,
    isFinal: true,
  });

  // ── 3. Analyze (Groq) ─────────────────────────────────────────────────────
  results.analyze = await test("Analyze - Groq AI (Llama 3.3 70B)", "POST", "/analyze", {
    userQuery: "Find the search button",
    screenshot: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    domString: `
      <html>
        <body>
          <nav data-unstuck-id="nav-1">
            <a href="/" data-unstuck-id="nav-a-1">Home</a>
            <a href="/flights" data-unstuck-id="nav-a-2">Flights</a>
          </nav>
          <main>
            <input 
              type="text" 
              placeholder="Search flights..." 
              data-unstuck-id="main-input-1"
            />
            <button data-unstuck-id="main-btn-1">Search</button>
          </main>
        </body>
      </html>
    `,
    previousMessages: [],
    sitemap: "Home > Flights > Search",
  });

  // ── 4. TTS ────────────────────────────────────────────────────────────────
  results.tts = await test("TTS - Google Translate Text to Speech", "POST", "/tts", {
    text: "I found 5 flights to New York for next week starting from 150 dollars",
    language: "en",
  });

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`
╔════════════════════════════════════════════╗
║  Test Summary                              ║
╚════════════════════════════════════════════╝
`);

  const passed = Object.values(results).filter((r) => r).length;
  const total = Object.keys(results).length;

  Object.entries(results).forEach(([name, ok]) => {
    console.log(`  ${ok ? "✅" : "❌"} ${name.toUpperCase()}`);
  });

  console.log(`\n  Result: ${passed}/${total} tests passed\n`);

  if (passed === total) {
    console.log(`  🎉 All tests passed! Backend is fully ready!`);
    console.log(`  🚀 Start the client and test the full flow!\n`);
  } else {
    console.log(`  ⚠️  Some tests failed. Check server logs above.\n`);
  }

  process.exit(passed === total ? 0 : 1);
}

runTests();