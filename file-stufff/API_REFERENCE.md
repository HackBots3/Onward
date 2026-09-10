# 📐 UNSTUCK - ARCHITECTURE & API REFERENCE

## 🏗️ SYSTEM ARCHITECTURE AT A GLANCE

### Layer 1: Browser (Client)
```
┌─────────────────────────────────────────┐
│  PRESENTATION LAYER                     │
│  ┌─────────────────────────────────────┤
│  │  ChatWidget Component (React/TS)   │
│  │  - Microphone button               │
│  │  - Chat message display            │
│  │  - Volume control                  │
│  └─────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────────┤
│  │  Web Speech API (Browser Built-in) │
│  │  - Audio capture                   │
│  │  - Speech-to-text conversion       │
│  │  - Confidence scoring              │
│  └─────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────────┤
│  │  DOM Observation                    │
│  │  - Screenshot capture              │
│  │  - HTML extraction                 │
│  │  - Element tracking                │
│  └─────────────────────────────────────┤
└─────────────────────────────────────────┘
          │
          │ HTTP (JSON)
          │
        PORT 3000
          │
```

### Layer 2: Backend Server (Node.js + Express)
```
┌─────────────────────────────────────────┐
│  EXPRESS BACKEND                        │
│                                         │
│  ┌─────────────────────────────────────┤
│  │  GET /health                        │
│  │  - Simple status check              │
│  │  - Response: {status: "ok"}         │
│  └─────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────────┤
│  │  POST /asr                          │
│  │  - Speech-to-text logging          │
│  │  - Receive: {text, confidence}     │
│  │  - Return: Confirmation            │
│  └─────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────────┤
│  │  POST /analyze                      │
│  │  - Core AI processing              │
│  │  - Calls Groq service              │
│  │  - Returns: {reasoning, actions}   │
│  └─────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────────┤
│  │  POST /tts                          │
│  │  - Text-to-speech conversion       │
│  │  - Calls Google Translate API      │
│  │  - Returns: MP3 audio stream       │
│  └─────────────────────────────────────┤
└─────────────────────────────────────────┘
          │
          ├─────────────────────┬──────────────────┐
          │                     │                  │
        PORT 8787     [HTTP]    │                  │
          │                     │                  │
```

### Layer 3: External APIs (100% FREE)
```
┌─────────────────────┐     ┌─────────────────────┐     ┌──────────────────────┐
│   GROQ API          │     │ GOOGLE TRANSLATE    │     │ ENVIRONMENT CONFIG   │
│                     │     │ TTS API             │     │                      │
│ - Model: Llama 3.3  │     │                     │     │ .dev.vars file:      │
│ - Free tier: Yes    │     │ - Text input        │     │ GROQ_API_KEY=...    │
│ - Credit card: No   │     │ - Audio output      │     │ GEMINI_API_KEY=...  │
│ - Region: Global    │     │ - Cost: $0.00       │     │                      │
│ - Rate: 30 req/min  │     │ - No auth required  │     │ Stored securely,     │
│                     │     │ - Natural voice     │     │ not in git           │
└─────────────────────┘     └─────────────────────┘     └──────────────────────┘
```

---

## 🔌 API ENDPOINTS COMPLETE REFERENCE

### 1. Health Check Endpoint

**Purpose:** Verify server is running  
**Method:** GET  
**URL:** `http://localhost:8787/health`  
**Authentication:** None  
**Rate Limit:** None  

**Request:**
```bash
curl http://localhost:8787/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-28T04:00:00.000Z"
}
```

**Response Codes:**
- `200 OK` - Server is running
- `404 Not Found` - Wrong URL or port
- `500 Server Error` - Server crashed

**Use Case:** 
- Startup verification
- Health monitoring
- Connection testing
- Load balancer heartbeat

---

### 2. Speech-to-Text Logging Endpoint

**Purpose:** Receive and log transcribed speech  
**Method:** POST  
**URL:** `http://localhost:8787/asr`  
**Authentication:** None  
**Rate Limit:** None  
**Content-Type:** `application/json`  

**Request Body:**
```json
{
  "text": "Find flights to New York",
  "confidence": 0.95,
  "isFinal": true,
  "language": "en-US"
}
```

**Response (200 OK):**
```json
{
  "text": "Find flights to New York",
  "chunks": [],
  "confidence": 0.95,
  "isFinal": true,
  "source": "Web Speech API (browser)",
  "requestId": "0.12345678"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Text is required.",
  "text": ""
}
```

**Field Descriptions:**
| Field | Type | Required | Range | Example |
|-------|------|----------|-------|---------|
| text | string | Yes | 1-500 chars | "Find hotels" |
| confidence | number | Yes | 0.0-1.0 | 0.95 |
| isFinal | boolean | Yes | true/false | true |
| language | string | No | lang code | "en-US" |

**Use Case:**
- Log user voice input
- Track confidence scores
- Debug speech recognition
- Audit trail of user queries

---

### 3. AI Analysis Endpoint (Core)

**Purpose:** Analyze page DOM and generate action sequence  
**Method:** POST  
**URL:** `http://localhost:8787/analyze`  
**Authentication:** Optional API-Key header  
**Rate Limit:** 30 requests/minute (Groq free tier)  
**Content-Type:** `application/json`  
**Max Payload:** 50 MB (for screenshots)  

**Request Body:**
```json
{
  "userQuery": "Find flights to New York on May 28",
  "screenshot": "data:image/png;base64,iVBORw0KGgo...",
  "domString": "<html><head>...</head><body>...</body></html>",
  "sitemap": "Home > Flights > Search > Results",
  "previousMessages": [
    {
      "role": "user",
      "content": "What flights are available?"
    },
    {
      "role": "assistant",
      "content": "I found several flights. Do you want to see them?"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "result": "{\"reasoning\":\"The user wants to find flights to New York. I can see the page has a search form with fields for destination and date. The action sequence is: (1) Click destination field, (2) Type 'New York', (3) Select May 28, (4) Click search.\",\"actions\":[\"destination-input\",\"date-picker\",\"search-button\"],\"narration\":\"Let me help you find flights to New York on May 28. I'll fill in the search form and search for available flights.\",\"taskAccomplished\":false}",
  "messages": [
    {
      "role": "user",
      "content": "Find flights to New York on May 28"
    },
    {
      "role": "assistant",
      "content": "{\"reasoning\":\"...\",\"actions\":[...],\"narration\":\"...\"}"
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid request: domString is required"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Groq API key not found. Add GROQ_API_KEY to .dev.vars"
}
```

**Error Response (429 Too Many Requests):**
```json
{
  "error": "Groq API rate limit exceeded. Try again in 60 seconds"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userQuery | string | Yes | User's natural language request |
| screenshot | string | No | Base64 encoded page screenshot |
| domString | string | Yes | HTML of current page (trimmed automatically) |
| sitemap | string | No | Page structure/navigation info |
| previousMessages | array | No | Chat history for context |

**Response Structure:**
```
result: JSON string containing:
├─ reasoning: Why AI chose these actions
├─ actions: Array of element IDs to click
├─ narration: User-friendly description
└─ taskAccomplished: true if task is done

messages: Updated conversation history
├─ role: "user" or "assistant"
└─ content: Message text
```

**Performance:**
- Avg response time: 1-2 seconds
- DOM trimming threshold: 24,000 characters (~6,000 tokens)
- Model: Llama 3.3 70B (Groq)
- Token window: ~8,000 tokens total

**Use Case:**
- AI-powered page navigation
- DOM analysis and understanding
- Action sequence generation
- Intelligent web automation

**Example Usage:**
```typescript
const response = await fetch("http://localhost:8787/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userQuery: "Find flights to New York",
    domString: document.documentElement.outerHTML,
    screenshot: await captureScreenshot(),
    sitemap: "Flights > Search"
  })
});

const { result } = await response.json();
const aiAnalysis = JSON.parse(result);
console.log(aiAnalysis.actions); // ["search-btn", "input-field", ...]
```

---

### 4. Text-to-Speech Endpoint

**Purpose:** Convert text to MP3 audio  
**Method:** POST  
**URL:** `http://localhost:8787/tts`  
**Authentication:** None  
**Rate Limit:** Effectively unlimited  
**Content-Type:** `application/json`  
**Response Content-Type:** `audio/mpeg`  

**Request Body:**
```json
{
  "text": "I found 10 flights for you from $150",
  "language": "en"
}
```

**Response (200 OK):**
```
[Binary MP3 audio data]
Header: Content-Type: audio/mpeg
Header: Content-Length: 28032
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Text is required"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "TTS generation failed: Network timeout"
}
```

**Supported Languages:**
```
Language      | Code | Notes
─────────────────────────────────────────
English       | en   | Default
Spanish       | es   | Spain Spanish
French        | fr   | French
German        | de   | German
Japanese      | ja   | Japanese
Chinese       | zh   | Mandarin
Hindi         | hi   | Hindi
Portuguese    | pt   | Portuguese
Italian       | it   | Italian
Korean        | ko   | Korean
Russian       | ru   | Russian
Arabic        | ar   | Arabic
[30+ more languages supported]
```

**Audio Properties:**
- Format: MP3 (MPEG Audio Layer III)
- Bitrate: ~128 kbps
- Sample rate: 44,100 Hz
- Mono/Stereo: Mono
- Duration: Varies with text length (typically 1-5 seconds)
- File size: ~25-35 KB per 10 seconds

**Use Case:**
- Convert AI responses to speech
- Provide audio feedback
- Accessibility support
- Voice-guided navigation

**Example Usage:**
```typescript
const response = await fetch("http://localhost:8787/tts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    text: "Found 5 hotels for you",
    language: "en"
  })
});

const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);

const audio = new Audio(audioUrl);
audio.play();
```

---

## 🔄 DATA FLOW DOCUMENTATION

### Standard Request-Response Cycle

```
USER INTERACTION
    │
    ▼
[1] Frontend: User speaks voice command
    - Web Speech API captures audio
    - Converts to text locally
    - Confidence score generated
    │
    ├─ Text: "Find hotels"
    ├─ Confidence: 0.95
    └─ Language: en-US
    │
    ▼
[2] Send to /asr endpoint
    POST /asr
    {
      "text": "Find hotels",
      "confidence": 0.95,
      "isFinal": true
    }
    │
    ▼
[3] Backend receives ASR
    - Log transcription
    - Validate input
    - Return confirmation
    │
    ├─ Status: 200 OK
    └─ Confirm receipt
    │
    ▼
[4] Frontend collects page data
    - Get full DOM (HTML)
    - Capture screenshot
    - Generate sitemap
    │
    ├─ DOM: <entire page HTML>
    ├─ Screenshot: base64 image
    └─ Sitemap: page navigation
    │
    ▼
[5] Send to /analyze endpoint
    POST /analyze
    {
      "userQuery": "Find hotels",
      "domString": "<html>...",
      "screenshot": "data:image/png...",
      "sitemap": "Home > Hotels",
      "previousMessages": []
    }
    │
    ▼
[6] Backend: AI Analysis
    - Load Groq service
    - Trim large DOM if needed
    - Build message prompt
    - Call Groq API
    │
    ├─ Model: Llama 3.3 70B
    ├─ Processing: 1-2 seconds
    └─ Result: Action sequence
    │
    ▼
[7] Groq Response
    {
      "reasoning": "User wants to find hotels. I see a search form...",
      "actions": ["search-btn", "input-field", "submit-btn"],
      "narration": "Let me search for hotels...",
      "taskAccomplished": false
    }
    │
    ▼
[8] Frontend: Execute Actions
    - Find element [data-unstuck-id="search-btn"]
    - Click it
    - Find element [data-unstuck-id="input-field"]
    - Click and type "Find hotels"
    - Find element [data-unstuck-id="submit-btn"]
    - Click it
    │
    ▼
[9] Wait for page load
    - Page DOM updates
    - Results appear
    - New state captured
    │
    ▼
[10] Generate response text
     "I found 10 hotels for you"
     │
    ▼
[11] Send to /tts endpoint
     POST /tts
     {
       "text": "I found 10 hotels for you",
       "language": "en"
     }
     │
    ▼
[12] Backend: TTS Generation
     - Call Google Translate API
     - Generate MP3 audio
     - Return audio stream
     │
    ├─ Status: 200 OK
    ├─ Type: audio/mpeg
    └─ Size: ~28 KB
    │
    ▼
[13] Frontend: Play Audio
     - Receive MP3 blob
     - Create Audio element
     - Play in background
     │
    └─ User hears: 🔊 "I found 10 hotels for you"
     │
    ▼
[14] UI Updates
     - Add message to chat
     - Clear input
     - Ready for next query
     │
    ▼
[15] LOOP - User can speak again
```

---

## 📊 TIMEOUT & PERFORMANCE SPECIFICATIONS

| Operation | Timeout | Typical | Max |
|-----------|---------|---------|-----|
| Health Check | 5s | <100ms | 500ms |
| ASR Processing | 5s | <50ms | 100ms |
| Groq AI Analysis | 30s | 1-2s | 5s |
| Google TTS | 10s | <1s | 3s |
| Network Round Trip | N/A | 100-200ms | 500ms |
| **Total End-to-End** | 60s | 2-4s | 10s |

---

## 🔐 SECURITY & HEADERS

### Request Headers (Optional)
```
Content-Type: application/json
X-API-Key: (optional, for future authentication)
Accept-Encoding: gzip (compression support)
```

### Response Headers
```
Content-Type: application/json (or audio/mpeg for TTS)
Content-Length: [size in bytes]
Cache-Control: no-cache, no-store
X-RateLimit-Remaining: [remaining requests]
```

### CORS Configuration
```
Allowed Origins: * (all)
Allowed Methods: GET, POST, OPTIONS
Allowed Headers: Content-Type, X-API-Key
Credentials: Not required
```

---

## 🚨 HTTP STATUS CODES

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK - Request successful | Endpoint processed normally |
| 201 | Created | (Not used in this API) |
| 400 | Bad Request | Missing required field |
| 401 | Unauthorized | Invalid API key |
| 404 | Not Found | Wrong endpoint URL |
| 408 | Request Timeout | Processing took too long |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Unexpected server error |
| 503 | Service Unavailable | External API down |

---

## 💾 ENVIRONMENT VARIABLES

### Required
```env
GROQ_API_KEY="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```
- **Source:** https://console.groq.com/
- **Type:** Secret key
- **Scope:** Global (backend only)
- **Renewal:** Never (permanent key)

### Optional
```env
GEMINI_API_KEY="AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```
- **Type:** Legacy key (for reference/backup)
- **Status:** Not actively used
- **Renewal:** For future deployment

### Internal
```env
NODE_ENV="development"
PORT=8787
```
- **Set by:** System
- **Purpose:** Configuration

---

## 🎯 QUICK DECISION MATRIX

### When to use which endpoint?

| Scenario | Endpoint | Why |
|----------|----------|-----|
| Check if server is running | `/health` | Simple verification |
| Log user's voice input | `/asr` | Audit trail |
| Get AI analysis of page | `/analyze` | Core functionality |
| Convert AI response to speech | `/tts` | Audio feedback |

---

## 📈 API USAGE PATTERNS

### Pattern 1: Simple Query
```json
Request to /analyze:
{
  "userQuery": "Show me the menu",
  "domString": "<page HTML>"
}

Response:
{
  "actions": ["menu-button"],
  "narration": "Opening the menu for you"
}
```

### Pattern 2: Complex Query with History
```json
Request to /analyze:
{
  "userQuery": "Book that flight",
  "domString": "<page HTML>",
  "previousMessages": [
    {"role": "user", "content": "Find flights to Paris"},
    {"role": "assistant", "content": "Found flights..."}
  ]
}

Response:
{
  "actions": ["select-flight", "book-button"],
  "narration": "Booking flight to Paris for you",
  "taskAccomplished": true
}
```

### Pattern 3: Error Handling
```typescript
try {
  const response = await fetch("/analyze", {...});
  
  if (!response.ok) {
    const error = await response.json();
    console.error(`API Error (${response.status}):`, error.error);
  }
  
  const data = await response.json();
  // Process data
} catch (error) {
  console.error("Network error:", error.message);
}
```

---

## 🧩 INTEGRATION EXAMPLES

### Example 1: React Component
```typescript
function ChatComponent() {
  const [messages, setMessages] = useState([]);
  
  async function handleUserQuery(query: string) {
    try {
      const response = await fetch("http://localhost:8787/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userQuery: query,
          domString: document.documentElement.outerHTML
        })
      });
      
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      
      const { result } = await response.json();
      const analysis = JSON.parse(result);
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: analysis.narration
      }]);
      
      return analysis;
    } catch (error) {
      console.error("Failed to analyze:", error);
    }
  }
  
  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{msg.content}</div>
      ))}
    </div>
  );
}
```

### Example 2: Express Middleware
```javascript
app.post("/custom-endpoint", async (req, res) => {
  const { query } = req.body;
  
  try {
    // Call our analyze endpoint
    const groqResponse = await fetch("http://localhost:8787/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userQuery: query,
        domString: req.body.pageHtml
      })
    });
    
    const data = await groqResponse.json();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
```

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-28  
**Purpose:** Architecture & API Reference for Developers
