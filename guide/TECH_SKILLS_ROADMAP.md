# Unstuck - Tech Skills Roadmap & Learning Path

## 📚 Skills Required - Complete Breakdown

### **Level 1: Beginner Prerequisites (Week 1-2)**

Before starting this project, you should be comfortable with:

#### **JavaScript Fundamentals**
```javascript
✅ Variables, data types, operators
   const name = "John";
   const age = 25;

✅ Functions & arrow functions
   const greet = (name) => `Hello, ${name}!`;

✅ Arrays & Objects
   const user = { name: "John", age: 25 };
   const users = [user, user2];

✅ Promises & async/await
   const data = await fetch(url).then(res => res.json());

✅ ES6 features (destructuring, spread operator)
   const { name, age } = user;
   const newUser = { ...user, age: 26 };
```

**Learning Resources**:
- MDN JavaScript Guide: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
- FreeCodeCamp: https://www.freecodecamp.org/learn/javascript
- Time Estimate: 20-40 hours

#### **TypeScript Basics**
```typescript
✅ Type annotations
   const name: string = "John";
   const age: number = 25;

✅ Interfaces
   interface User {
     name: string;
     age: number;
   }

✅ Generics (basic)
   const getFirstItem = <T,>(arr: T[]): T => arr[0];

✅ Union & optional types
   type Status = "active" | "inactive";
   const optional: string | undefined = undefined;
```

**Learning Resources**:
- TypeScript Official Handbook: https://www.typescriptlang.org/docs/
- Time Estimate: 15-25 hours

---

### **Level 2: Frontend Foundation (Week 2-3)**

#### **React 18 Core Concepts** ⭐⭐⭐ (ESSENTIAL)

Must understand these completely:

```typescript
✅ Components & JSX
   interface Props {
     name: string;
   }
   const Greeting: React.FC<Props> = ({ name }) => (
     <h1>Hello, {name}!</h1>
   );

✅ Hooks (useState, useEffect, useReducer)
   const [count, setCount] = useState(0);
   
   useEffect(() => {
     console.log("Component mounted");
     return () => console.log("Cleanup");
   }, []);

✅ Context API for state management
   const UserContext = createContext<User | undefined>();
   
   export const UserProvider: React.FC<Props> = ({ children }) => (
     <UserContext.Provider value={currentUser}>
       {children}
     </UserContext.Provider>
   );
   
   const user = useContext(UserContext);

✅ Custom Hooks
   const useWindowSize = () => {
     const [size, setSize] = useState({ width: 0, height: 0 });
     
     useEffect(() => {
       const handleResize = () =>
         setSize({
           width: window.innerWidth,
           height: window.innerHeight,
         });
       
       window.addEventListener("resize", handleResize);
       return () => window.removeEventListener("resize", handleResize);
     }, []);
     
     return size;
   };

✅ Component Composition & Prop Drilling Solutions
   // ❌ Prop drilling (bad)
   <Parent data={data} />
   
   // ✅ Use Context (good)
   <Provider value={data}>
     <Child />
   </Provider>
```

**Learning Path**:
1. React Official Docs (Start here): https://react.dev
2. Epic React Course: https://epicreact.dev
3. Build 5+ small projects
4. Time Estimate: 30-50 hours

**Mini Project Ideas**:
- Todo app with Context
- Counter with custom hooks
- User dashboard with API integration

#### **CSS & TailwindCSS** ⭐⭐

```css
✅ CSS Fundamentals
   Flexbox, Grid, Positioning, Media Queries

✅ TailwindCSS utility-first approach
   <div className="flex items-center justify-between p-4 bg-blue-500">
     <h1 className="text-2xl font-bold text-white">Title</h1>
     <button className="px-4 py-2 bg-white text-blue-500 rounded hover:shadow-lg">
       Button
     </button>
   </div>

✅ Responsive design
   <div className="w-full md:w-1/2 lg:w-1/3">
     Mobile first responsive
   </div>

✅ Custom configuration
   // tailwind.config.ts
   export default {
     theme: {
       extend: {
         colors: {
           primary: "#3B82F6",
         },
       },
     },
   };
```

**Learning Resources**:
- TailwindCSS Documentation: https://tailwindcss.com/docs
- Time Estimate: 10-15 hours

---

### **Level 3: Advanced Frontend Patterns (Week 3-4)**

#### **Advanced Hooks & Patterns** ⭐⭐⭐

```typescript
✅ useCallback & useMemo for optimization
   const memoizedCallback = useCallback(
     (value: string) => {
       console.log(value);
     },
     [], // dependencies
   );

   const expensiveValue = useMemo(() => {
     return complexCalculation(data);
   }, [data]);

✅ useRef for DOM access
   const inputRef = useRef<HTMLInputElement>(null);
   
   const focus = () => {
     inputRef.current?.focus();
   };
   
   return <input ref={inputRef} />;

✅ Custom hooks for reusability
   interface UseApiState<T> {
     data: T | null;
     loading: boolean;
     error: Error | null;
   }
   
   const useApi = <T,>(
     url: string
   ): UseApiState<T> => {
     const [state, setState] = useState<UseApiState<T>>({
       data: null,
       loading: true,
       error: null,
     });
     
     useEffect(() => {
       fetch(url)
         .then(res => res.json())
         .then(data => setState({ data, loading: false, error: null }))
         .catch(error => setState({ data: null, loading: false, error }));
     }, [url]);
     
     return state;
   };
```

**Practice**:
- Implement 10+ custom hooks
- Understand when to use each
- Performance optimization exercises

#### **React Router v6** ⭐⭐

```typescript
✅ Route setup
   import { BrowserRouter, Routes, Route } from "react-router-dom";
   
   const App = () => (
     <BrowserRouter>
       <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/details/:id" element={<Details />} />
         <Route path="*" element={<NotFound />} />
       </Routes>
     </BrowserRouter>
   );

✅ Dynamic routes & parameters
   import { useParams } from "react-router-dom";
   
   const Details = () => {
     const { id } = useParams<{ id: string }>();
     return <div>Property {id}</div>;
   };

✅ Navigation
   import { useNavigate } from "react-router-dom";
   
   const navigate = useNavigate();
   navigate(`/details/${id}`);
```

#### **TanStack Query (React Query)** ⭐⭐⭐

```typescript
✅ Basic query setup
   import { useQuery } from "@tanstack/react-query";
   
   const { data, isLoading, error } = useQuery({
     queryKey: ["properties"],
     queryFn: async () => {
       const res = await fetch("/api/properties");
       return res.json();
     },
   });

✅ Mutations
   import { useMutation } from "@tanstack/react-query";
   
   const mutation = useMutation({
     mutationFn: async (newProperty) => {
       const res = await fetch("/api/properties", {
         method: "POST",
         body: JSON.stringify(newProperty),
       });
       return res.json();
     },
     onSuccess: (data) => {
       console.log("Success:", data);
       queryClient.invalidateQueries({ queryKey: ["properties"] });
     },
   });

✅ Caching & stale data
   const { data } = useQuery({
     queryKey: ["property", id],
     queryFn: fetchProperty,
     staleTime: 5 * 60 * 1000, // Cache for 5 minutes
     gcTime: 10 * 60 * 1000,    // Remove if not used for 10 min
   });
```

---

### **Level 4: Backend Foundation (Week 4-5)**

#### **Node.js & API Fundamentals** ⭐⭐

```javascript
✅ HTTP methods
   GET    → Fetch data
   POST   → Create data
   PUT    → Update data
   DELETE → Remove data
   PATCH  → Partial update

✅ REST API design
   GET    /api/properties
   GET    /api/properties/:id
   POST   /api/properties
   PUT    /api/properties/:id
   DELETE /api/properties/:id

✅ Request/Response handling
   {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       "X-API-Key": "secret-key",
     },
     body: JSON.stringify({ name: "John" }),
   }
```

**Learning Resources**:
- MDN HTTP Guide: https://developer.mozilla.org/en-US/docs/Web/HTTP
- Time Estimate: 10-15 hours

#### **Hono Framework** ⭐⭐

```typescript
✅ Basic setup
   import { Hono } from "hono";
   
   const app = new Hono();
   
   app.get("/", (c) => c.text("Hello, World!"));
   app.post("/users", (c) => c.json({ id: 1 }));

✅ CORS & middleware
   import { cors } from "hono/cors";
   
   app.use("*", cors());

✅ Type-safe bindings
   type Bindings = {
     GEMINI_API_KEY: string;
     DATABASE_URL: string;
   };
   
   const app = new Hono<{ Bindings: Bindings }>();
   
   app.get("/", (c) => {
     const apiKey = c.env.GEMINI_API_KEY;
     return c.json({ apiKey });
   });

✅ Error handling
   app.post("/data", (c) => {
     try {
       const body = c.req.json();
       return c.json({ success: true });
     } catch (error) {
       return c.json({ error: error.message }, 400);
     }
   });
```

**Learning Resources**:
- Hono Documentation: https://hono.dev
- Time Estimate: 8-12 hours

#### **Cloudflare Workers** ⭐⭐⭐

```typescript
✅ Understanding serverless
   • No server to manage
   • Runs on Cloudflare edge
   • Environment variables in .dev.vars
   • Scale automatically

✅ Local development
   npm run dev    # Start local server
   npm run deploy # Deploy to production

✅ Environment configuration
   // .dev.vars
   GEMINI_API_KEY=abc123
   ELEVENLABS_API_KEY=xyz789

   // Access in code
   const apiKey = c.env.GEMINI_API_KEY;
```

**Learning Resources**:
- Cloudflare Workers Docs: https://developers.cloudflare.com/workers/
- Time Estimate: 12-20 hours

---

### **Level 5: AI & External APIs (Week 5-6)**

#### **Google Gemini API** ⭐⭐⭐

```typescript
✅ Setup
   import OpenAI from "openai";
   
   const openai = new OpenAI({
     apiKey: process.env.GEMINI_API_KEY,
     baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
   });

✅ Send messages
   const response = await openai.chat.completions.create({
     model: "gemini-1.5-flash",
     messages: [
       {
         role: "user",
         content: "Analyze this DOM structure and tell me what to click",
       },
     ],
   });

✅ System prompts (very important for this project!)
   const systemPrompt = `
   You are an AI assistant designed to help users navigate websites.
   Your goal is to understand the user's query and provide step-by-step guidance
   using available UI elements on the page.
   `;
```

**Understanding Prompts**:
- Prompt engineering is crucial for this project!
- System message sets AI behavior
- Few-shot examples improve accuracy
- Context (DOM + screenshot) is essential

#### **Speech APIs - Whisper & TTS** ⭐⭐

```typescript
✅ Audio to Text (using OpenAI SDK pointing to your backend)
   // Backend
   const transcript = await openai.audio.transcriptions.create({
     file: audioFile,
     model: "whisper-1",
   });

✅ Text to Speech (ElevenLabs)
   import ElevenLabs from "elevenlabs-node";
   
   const speech = await ElevenLabs.generate({
     voice: "Rachel",
     text: "Hello, this is a test pronunciation message.",
     apiKey: process.env.ELEVENLABS_API_KEY,
   });
```

---

### **Level 6: Project-Specific Skills (Week 6-7)**

#### **DOM Manipulation & Analysis** ⭐⭐⭐ (PROJECT SPECIFIC)

```typescript
✅ Finding interactive elements
   const interactiveTags = ["BUTTON", "INPUT", "A", "SELECT"];
   const interactiveRoles = ["button", "link", "menuitem"];
   
   const isInteractive = (el: Element): boolean => {
     return (
       interactiveTags.includes(el.tagName) ||
       interactiveRoles.includes(el.getAttribute("role") || "")
     );
   };

✅ Getting element properties
   const element = document.querySelector("#submit-btn");
   const {
     x, y, width, height,
     top, left, right, bottom,
   } = element.getBoundingClientRect();

✅ Triggering interactions
   element.click();
   element.focus();
   element.scrollIntoView({ behavior: "smooth" });
   
   // Type into input
   const input = element as HTMLInputElement;
   input.value = "New value";
   input.dispatchEvent(new Event("change", { bubbles: true }));

✅ Extracting text content
   const label = element.getAttribute("aria-label") ||
                 element.getAttribute("placeholder") ||
                 element.textContent?.trim();
```

#### **Screenshot Capture with html2canvas** ⭐⭐

```typescript
✅ Basic screenshot
   import html2canvas from "html2canvas";
   
   const canvas = await html2canvas(document.body);
   const imageBase64 = canvas.toDataURL("image/png");

✅ Screenshot specific element
   const element = document.querySelector(".main-content");
   const canvas = await html2canvas(element);
   const image = canvas.toDataURL("image/png");

✅ Options for better screenshots
   const canvas = await html2canvas(document.body, {
     allowTaint: true,           // Allow cross-origin images
     useCORS: true,             // Force CORS
     scale: 2,                  // Higher resolution
     loggingEnabled: false,     // Disable console logs
     backgroundColor: "#ffffff", // White background
   });
```

#### **Voice Activity Detection (VAD)** ⭐⭐

```typescript
✅ Using vad-react library
   import { useMicVAD } from "@ricky0123/vad-react";
   
   const vad = useMicVAD({
     onSpeechEnd: async (audio) => {
       // audio is Float32Array of audio samples
       console.log("User finished speaking");
       // Convert to WebM and send to API
     },
     onSpeechStart: () => {
       console.log("User started speaking");
     },
   });
   
   return (
     <button onClick={() => vad.start()}>Start Recording</button>
   );
```

#### **Audio Format Conversion** ⭐⭐⭐

```typescript
✅ Float32Array to WebM (IMPORTANT!)
   const audioContext = new AudioContext({ sampleRate: 16000 });
   const audioBuffer = audioContext.createBuffer(1, audio.length, 16000);
   audioBuffer.getChannelData(0).set(audio);
   
   const mediaStream = audioContext.createMediaStreamDestination();
   const sourceNode = audioContext.createBufferSource();
   sourceNode.buffer = audioBuffer;
   sourceNode.connect(mediaStream);
   
   const chunks: BlobPart[] = [];
   const recorder = new MediaRecorder(mediaStream.stream, {
     mimeType: "audio/webm;codecs=opus",
   });
   
   recorder.ondataavailable = (e) => chunks.push(e.data);
   recorder.start();
   sourceNode.start();
   
   // Later...
   const blob = new Blob(chunks, { type: "audio/webm" });
```

---

### **Level 7: Advanced Project Features (Week 7-8)**

#### **Animation & Visual Feedback** ⭐⭐

```typescript
✅ GhostCursor (highlight animation)
   const showCursor = (bbox: DOMRect) => {
     const element = document.createElement("div");
     element.style.position = "fixed";
     element.style.left = bbox.left + "px";
     element.style.top = bbox.top + "px";
     element.style.width = bbox.width + "px";
     element.style.height = bbox.height + "px";
     element.style.border = "2px solid red";
     element.style.animation = "pulse 0.5s";
     document.body.appendChild(element);
     
     setTimeout(() => element.remove(), 500);
   };

✅ Smooth transitions
   const element = document.querySelector(".chat-widget");
   element.style.transition = "all 0.3s ease-in-out";
   element.style.opacity = "1";
   element.style.transform = "translateY(0)";
```

#### **Error Handling & Retry Logic** ⭐⭐

```typescript
✅ Exponential backoff
   async function fetchWithRetry(
     url: string,
     maxRetries = 3
   ): Promise<Response> {
     for (let i = 0; i < maxRetries; i++) {
       try {
         const response = await fetch(url);
         if (response.ok) return response;
       } catch (error) {
         if (i < maxRetries - 1) {
           await sleep(Math.pow(2, i) * 1000); // 1s, 2s, 4s...
         }
       }
     }
     throw new Error("Failed after retries");
   }

✅ Error boundaries (React)
   class ErrorBoundary extends React.Component {
     componentDidCatch(error, errorInfo) {
       console.error("Error caught:", error, errorInfo);
     }
     
     render() {
       return this.props.children;
     }
   }
```

---

## 📊 Skills Matrix

### **What You Need by Week**

```
Week 1-2 (Fundamentals)
├─ ⭐ JavaScript basics
├─ ⭐ TypeScript intro
└─ 🎯 15-40 hours

Week 2-3 (React Foundation)
├─ ⭐⭐⭐ React hooks
├─ ⭐⭐⭐ Context API
├─ ⭐⭐ React Router
└─ 🎯 30-50 hours

Week 3-4 (Advanced Frontend)
├─ ⭐⭐⭐ Performance hooks
├─ ⭐⭐ CSS/Tailwind
├─ ⭐⭐⭐ TanStack Query
└─ 🎯 25-40 hours

Week 4-5 (Backend)
├─ ⭐⭐ Node.js basics
├─ ⭐⭐ Hono framework
├─ ⭐⭐⭐ Cloudflare Workers
└─ 🎯 20-32 hours

Week 5-6 (APIs)
├─ ⭐⭐⭐ Google Gemini API
├─ ⭐⭐ Whisper/TTS APIs
├─ ⭐ FAL AI APIs
└─ 🎯 15-25 hours

Week 6-7 (Project-Specific)
├─ ⭐⭐⭐ DOM manipulation
├─ ⭐⭐ html2canvas
├─ ⭐⭐⭐ Voice detection
├─ ⭐⭐⭐ Audio processing
└─ 🎯 20-30 hours

Week 7-8 (Advanced)
├─ ⭐⭐ Animations
├─ ⭐⭐ Error handling
├─ ⭐ Performance optimization
└─ 🎯 15-20 hours

TOTAL LEARNING TIME: 140-237 hours (~4-6 weeks full-time)
```

---

## 🎯 Skill Priority

### **MUST HAVE (Do Not Skip)**
1. React & Hooks (advanced)
2. TypeScript intermediate
3. Context API
4. Hono framework
5. Cloudflare Workers basics
6. Google Gemini API
7. DOM manipulation & analysis
8. Audio processing

### **SHOULD HAVE (Strongly Recommended)**
1. TanStack Query
2. React Router
3. TailwindCSS
4. Error handling
5. API integration patterns
6. html2canvas
7. Voice Activity Detection

### **NICE TO HAVE (Good Bonus)**
1. Advanced React patterns
2. Animations
3. Performance optimization
4. Testing (Jest, Vitest)
5. Monitoring & analytics
6. Mobile optimization

---

## 🏃 Quick Assessment: Are You Ready?

Can you answer YES to these questions?

```
Frontend Skills?
[ ] ✅ Write React components with hooks
[ ] ✅ Understand Context API
[ ] ✅ Use TailwindCSS
[ ] ✅ Fetch and handle API responses
[ ] ✅ Debug React apps

Backend Skills?
[ ] ✅ Understand REST APIs
[ ] ✅ Write async server code
[ ] ✅ Handle environment variables
[ ] ✅ Deal with API rate limits

TypeScript?
[ ] ✅ Write interfaces
[ ] ✅ Use generics
[ ] ✅ Understand union types

Problem Solving?
[ ] ✅ Debug API calls
[ ] ✅ Handle errors gracefully
[ ] ✅ Read documentation & implement
[ ] ✅ Google & Stack Overflow effectively

If you answered NO to 3+ questions:
→ Spend another 1-2 weeks learning before starting!
```

---

## 🚀 Recommended Learning Order

### **Week 1-2: JavaScript & TypeScript Fundamentals**
```
Monday-Friday:  JavaScript fundamentals (2 sections/day)
Weekend:        Practice small projects

Monday-Friday:  TypeScript basics (1 section/day)
Weekend:        TypeScript exercises
```

### **Week 3: React Core**
```
Monday-Tuesday:   Components & JSX
Wednesday:        Hooks (useState, useEffect)
Thursday:         Context API
Friday:           Custom Hooks
Weekend:          Build a Counter + Todo app
```

### **Week 4: Advanced React**
```
Monday:      useMemo & useCallback
Tuesday:     useRef
Wednesday:   React Router
Thursday:    TanStack Query
Friday:      Performance optimization
Weekend:     Build a Property Listing app
```

### **Week 5: Full Stack Setup**
```
Monday:     Node.js basics
Tuesday:    Hono framework
Wednesday:  Cloudflare Workers
Thursday:   Local development setup
Friday:     Deploy hello-world
```

### **Week 6: AI & APIs**
```
Monday:     Google Gemini API
Tuesday:    Prompt engineering
Wednesday:  Whisper API
Thursday:   ElevenLabs TTS
Friday:     Integration testing
```

### **Week 7: Project Integration**
```
Monday:     DOM analysis & element extraction
Tuesday:    Screenshot capture
Wednesday:  Voice input (VAD)
Thursday:   Audio processing
Friday:     Full integration test
```

### **Week 8: Polish & Deploy**
```
Monday-Thursday:  Bug fixes & optimization
Friday:           Deploy to production
Weekend:          Documentation & knowledge sharing
```

---

## 📖 Recommended Resources Summary

| Topic | Resource | Time | Cost |
|-------|----------|------|------|
| **JavaScript** | MDN + FreeCodeCamp | 20h | Free |
| **TypeScript** | Official Handbook | 15h | Free |
| **React** | React.dev + Epic React | 40h | $200 (course optional) |
| **TailwindCSS** | Official Docs | 10h | Free |
| **Hono** | Official Docs | 10h | Free |
| **Cloudflare** | Official Docs | 15h | Free tier available |
| **Gemini API** | Google Docs + Examples | 10h | Free tier (60 req/min) |
| **Project** | This codebase | ∞ | Free |

---

## ✅ Pre-Startup Checklist

Before starting development on THIS project:

```
Basics
[ ] Comfortable with React hooks
[ ] Understand Context API
[ ] Written async/await code
[ ] Used REST APIs before

Tools
[ ] Node.js 18+ installed
[ ] VS Code with extensions
[ ] Git & GitHub set up
[ ] Terminal/Command line comfortable

Accounts
[ ] Google Cloud account
[ ] Cloudflare account
[ ] ElevenLabs account
[ ] Got all API keys

Knowledge
[ ] Read PROJECT_GUIDE.md
[ ] Understand the project flow
[ ] Familiar with tool names
[ ] Know what each part does

Confidence
[ ] Feel ready to learn in real-time
[ ] Comfortable debugging
[ ] Don't fear reading docs
[ ] Ready to build something cool!
```

---

**This is your learning roadmap. Customize based on your current level and learn at your own pace!**
