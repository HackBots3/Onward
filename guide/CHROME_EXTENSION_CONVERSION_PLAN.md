# UNSTUCK to Chrome Extension - Implementation Plan

## 📋 Executive Summary

This document outlines the comprehensive strategy to convert the existing **Unstuck** web-based voice navigation system into a **Chrome Extension** that works on any website, enabling users to use voice/chat to search, navigate, and perform actions on any page they visit.

---

## 🎯 Project Goals

### Current State
- ✅ Voice-guided navigation works on a travel website (client)
- ✅ React component with integrated chat widget
- ✅ Requires wrapping app with UnstuckProvider (3 lines of code)
- ✅ Cloudflare Workers backend with AI analysis

### Target State (Chrome Extension)
- ✨ Works on ANY website without code changes needed
- ✨ User clicks extension icon or says "Hey Unstuck" wake word
- ✨ Floating chat widget appears with voice input
- ✨ Voice/text-based navigation guidance on current page
- ✨ Works seamlessly across domains and SPAs
- ✨ Persistent chat history per tab
- ✨ Settings panel for preferences (wake word, voice, API keys)

---

## 🏗️ Architecture Overview

### Current Architecture
```
┌──────────────────────┐
│   Browser (React)    │
│  - ChatWidget        │
│  - Workflow Creator  │
│  - Screenshot        │
└──────────┬───────────┘
           │ REST API
┌──────────▼───────────────┐
│ Cloudflare Workers       │
│ - Gemini API calls       │
│ - Whisper transcription  │
│ - ElevenLabs TTS         │
└──────────────────────────┘
```

### Chrome Extension Architecture
```
┌─────────────────────────────────────────────┐
│         Chrome Extension Manifest           │
├─────────────────────────────────────────────┤
│                                             │
│  background/service_worker.js               │
│  - Manages lifecycle                        │
│  - API calls to backend                     │
│  - Storage & sync                           │
│                                             │
│  content_scripts/injector.ts                │
│  - Injects React chat widget into pages     │
│  - Captures page context                    │
│  - DOM mutation watching                    │
│  - Intercepts page interactions             │
│                                             │
│  popup/popup.tsx                            │
│  - Extension icon popup UI                  │
│  - Settings panel                           │
│  - API key configuration                    │
│                                             │
│  types.ts                                   │
│  - Message types between scripts            │
│                                             │
└─────────────────────────────────────────────┘
           │ Message Passing │
           └────────┬────────┘
     ┌──────────────┴──────────────┐
     │                             │
┌────▼────────────────────┐    ┌──▼─────────────┐
│ Content Script (Page)   │    │ Service Worker │
│ - Inject UI             │    │ - API calls    │
│ - Capture context       │    │ - Storage      │
│ - Execute actions       │    │ - Background   │
└────┬────────────────────┘    │   tasks        │
     │                         └────────────────┘
     │ (Injects React components)
     │
┌────▼──────────────────────────────────┐
│  React Components (Injected)          │
│  - ChatWidget (moved from client)     │
│  - UnstuckContext (adapted)           │
│  - WorkflowCreator                    │
└────┬──────────────────────────────────┘
     │ REST/Message API
┌────▼──────────────────────────────────────┐
│ Backend (Cloudflare Workers / Custom)     │
│ - /asr (Whisper transcription)            │
│ - /analyze (Gemini analysis)              │
│ - /tts (ElevenLabs speech)                │
└───────────────────────────────────────────┘
```

---

## 🛠️ Implementation Phases

### Phase 1: Foundation Setup (Week 1)
**Goal: Set up Chrome extension project structure and basic UI**

#### Tasks:
1. **Create Extension Structure**
   - [ ] Initialize new Chrome extension project with TypeScript
   - [ ] Create manifest.json v3 with required permissions
   - [ ] Set up build pipeline (Vite or esbuild for bundling)
   - [ ] Configure TypeScript for extension development

2. **Create Manifest.json**
   ```json
   {
     "manifest_version": 3,
     "name": "Unstuck - Voice Web Navigation",
     "description": "Navigate any website with voice commands",
     "permissions": [
       "activeTab",
       "scripting",
       "storage",
       "webRequest",
       "tabs"
     ],
     "host_permissions": ["<all_urls>"],
     "background": {
       "service_worker": "background.js"
     },
     "content_scripts": [{
       "matches": ["<all_urls>"],
       "js": ["content-script.js"],
       "all_frames": false
     }],
     "action": {
       "default_popup": "popup.html",
       "default_title": "Unstuck - Voice Navigation"
     }
   }
   ```

3. **Set Up Build Configuration**
   - [ ] Configure Vite for extension build
   - [ ] Set up separate entry points for content script, background, popup
   - [ ] Create build scripts for development/production
   - [ ] Test hot reload during development

4. **Implement Service Worker (background.js)**
   ```typescript
   // Key responsibilities:
   - Listen for extension icon clicks
   - Store API keys securely
   - Make API calls to backend
   - Manage tabs and windows
   - Handle alarms/scheduled tasks
   ```

5. **Implement Content Script (injector.ts)**
   ```typescript
   // Key responsibilities:
   - Detect DOM ready on any page
   - Create container for React widget
   - Inject CSS styles
   - Set up message passing with background
   - Don't break existing page functionality
   ```

6. **Create Popup UI (popup.tsx)**
   - [ ] Basic settings panel
   - [ ] API key input fields
   - [ ] Toggle for wake word activation
   - [ ] Quick-access chat button
   - [ ] Version and help links

#### Deliverables:
- Working extension scaffold that loads on any website
- Basic popup with settings UI
- Message passing between service worker and content script
- Build pipeline working for all 3 entry points

---

### Phase 2: React Component Migration (Week 2)
**Goal: Port React components and adapt them for extension environment**

#### Tasks:
1. **Copy and Adapt React Components**
   - [ ] Copy ChatWidget.tsx from client/src/components/unstuck/chat/
   - [ ] Copy UnstuckContext.tsx and adapt for extension message passing
   - [ ] Copy WorkflowCreator.tsx and all dependency files
   - [ ] Copy UI components from shadcn/ui
   - [ ] Update imports to work in extension environment

2. **Create Content Script React Root**
   ```typescript
   // content-script.tsx approach:
   - Create a container div
   - Check if already injected (prevent duplicates)
   - Use ReactDOM.createRoot()
   - Pass configuration via message/storage
   - Handle component cleanup on page unload
   ```

3. **Adapt UnstuckContext for Messages**
   - [ ] Replace direct API calls with chrome.runtime.sendMessage()
   - [ ] Implement message handler in background service worker
   - [ ] Handle response processing in content script
   - [ ] Add error handling for message failures

4. **Message Type Definitions**
   ```typescript
   // types.ts (shared between scripts)
   interface Message {
     type: 'ASR' | 'ANALYZE' | 'TTS' | 'GET_CONTEXT' | 'EXECUTE_ACTION';
     payload: any;
     tabId: number;
   }
   
   interface ASRRequest {
     audio_data: string;
     language: string;
   }
   
   interface AnalyzeRequest {
     userQuery: string;
     screenshot: string;
     domString: string;
     previousMessages: any[];
     sitemap: string;
   }
   ```

5. **Implement Content Script Context Gathering**
   ```typescript
   // Adapt getCurrentContext() for extension:
   - Use same DOM sanitization
   - Capture screenshots with html2canvas
   - Generate sitemap
   - Handle cross-origin restrictions
   - Cache context between calls
   ```

#### Deliverables:
- ChatWidget working in extension context
- Message passing working between service worker and content script
- Context gathering adapted for extension security model
- CSS/styling properly scoped to prevent conflicts

---

### Phase 3: Backend Integration (Week 2-3)
**Goal: Connect extension to backend APIs and handle authentication**

#### Tasks:
1. **Update API Endpoint Handling**
   - [ ] Modify service worker to make calls to backend
   - [ ] Add CORS headers handling (if needed)
   - [ ] Implement request/response logging
   - [ ] Add retry logic for failed requests
   - [ ] Handle 401 Unauthorized responses

2. **API Key Management in Extension**
   ```typescript
   // Store in chrome.storage.sync (synced across devices):
   chrome.storage.sync.get(['apiKey', 'elevenLabsKey'], (result) => {
     // Use keys for API calls
   });
   
   // First run - prompt user to enter keys
   chrome.runtime.onInstalled.addListener(() => {
     chrome.runtime.openOptionsPage();
   });
   ```

3. **Environment Configuration**
   - [ ] Add ability to switch between localhost and production backend
   - [ ] Store backend URL in extension storage
   - [ ] Add dev/prod build modes
   - [ ] Support custom backend deployment

4. **Implement Service Worker API Handlers**
   ```typescript
   chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
     switch(message.type) {
       case 'ASR': 
         fetch(`${backendUrl}/asr`, {...});
       case 'ANALYZE':
         fetch(`${backendUrl}/analyze`, {...});
       case 'TTS':
         fetch(`${backendUrl}/tts`, {...});
     }
   });
   ```

5. **Handle Backend Timeouts & Errors**
   - [ ] Implement timeout handlers (30s for analysis)
   - [ ] Implement retry with exponential backoff
   - [ ] Show user-friendly error messages
   - [ ] Log errors for debugging

#### Deliverables:
- Service worker successfully calling backend APIs
- API keys stored securely
- Error handling and user feedback
- Retry logic for failed requests

---

### Phase 4: Voice & Speech Integration (Week 3)
**Goal: Implement voice activation and real-time interaction**

#### Tasks:
1. **Voice Activity Detection (VAD) Setup**
   - [ ] Port @ricky0123/vad-react to extension content script
   - [ ] Handle microphone permissions request
   - [ ] Implement wake word detection ("Hey Unstuck")
   - [ ] Add alternative manual activation (hotkey or button)

2. **Microphone Access in Content Script**
   - [ ] Request permissions (will show in popup)
   - [ ] Handle permission denial gracefully
   - [ ] Create audio stream from getUserMedia
   - [ ] Stream audio to backend for transcription

3. **Real-time Transcription**
   - [ ] Send audio chunks to /asr endpoint
   - [ ] Display transcription in real-time
   - [ ] Handle end-of-speech detection
   - [ ] Show confidence levels

4. **Text-to-Speech Playback**
   - [ ] Receive audio from /tts endpoint
   - [ ] Play audio in extension context
   - [ ] Handle audio playback errors
   - [ ] Allow user to skip/stop audio

#### Deliverables:
- Wake word detection working
- Voice input captured and transcribed
- TTS responses playing in extension
- Hotkey activation working

---

### Phase 5: Element Interaction & Automation (Week 4)
**Goal: Enable auto-clicking and form filling on any website**

#### Tasks:
1. **DOM Element Tracking**
   - [ ] Implement DOM mutation observer in content script
   - [ ] Assign stable IDs to interactive elements
   - [ ] Handle dynamic content/SPAs
   - [ ] Manage memory efficiently (large DOMs)

2. **Element Selection & Interaction**
   ```typescript
   // In content script, execute actions:
   const element = document.querySelector(`[data-unstuck-id="${id}"]`);
   element.click(); // or other interactions
   element.focus(); // or fill form
   ```

3. **Handle Different Element Types**
   - [ ] Buttons: click
   - [ ] Links: click + wait for navigation
   - [ ] Forms: fill + submit
   - [ ] Inputs: focus + type text
   - [ ] Selects: change value
   - [ ] Checkboxes/Radio: toggle

4. **Handle Navigation & Page Changes**
   - [ ] Detect when page changes
   - [ ] Wait for DOM to stabilize
   - [ ] Update context after navigation
   - [ ] Maintain chat history across navigations
   - [ ] Handle SPA route changes

5. **Visual Feedback During Interactions**
   - [ ] Ghost cursor animation
   - [ ] Bounding box highlighting
   - [ ] Loading spinners
   - [ ] Success/error indicators

#### Deliverables:
- Auto-clicking working on various element types
- Form filling automated
- Page navigation handled correctly
- Visual feedback visible during interactions

---

### Phase 6: Testing & Refinement (Week 4-5)
**Goal: Comprehensive testing and user experience improvements**

#### Tasks:
1. **Cross-Website Testing**
   - [ ] Test on travel websites (Airbnb, Booking.com, Expedia)
   - [ ] Test on e-commerce (Amazon, eBay)
   - [ ] Test on search engines (Google, Bing)
   - [ ] Test on SPA frameworks (React, Vue, Angular sites)
   - [ ] Test on CMS platforms (WordPress, Shopify)

2. **Edge Case Handling**
   - [ ] Websites with custom element selectors
   - [ ] Shadow DOM elements
   - [ ] iframes and cross-origin restrictions
   - [ ] Dynamic content loading
   - [ ] Heavy JavaScript sites

3. **Performance Optimization**
   - [ ] Lazy load React components
   - [ ] Optimize DOM scanning
   - [ ] Reduce message passing overhead
   - [ ] Cache screenshots appropriately
   - [ ] Monitor memory usage

4. **Security & Privacy**
   - [ ] Ensure no sensitive data in logs
   - [ ] Validate all user inputs
   - [ ] Sanitize DOM before sending to API
   - [ ] Handle CORS properly
   - [ ] Implement CSP headers

5. **User Experience Polish**
   - [ ] Smooth animations and transitions
   - [ ] Keyboard shortcuts for common actions
   - [ ] Accessibility (ARIA labels, keyboard navigation)
   - [ ] Localization support
   - [ ] Tutorial/onboarding flow

#### Deliverables:
- Extension works smoothly on 10+ different websites
- Edge cases documented and handled
- Performance metrics measured and optimized
- Security audit completed

---

## 📦 Required Libraries & Dependencies

### Core Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "@radix-ui/*": "^1.x.x",
  "tailwindcss": "^3.4.x",
  "lucide-react": "^0.462.0",
  "@ricky0123/vad-react": "^0.0.28",
  "@11labs/react": "^0.0.7",
  "html2canvas": "^1.4.1",
  "openai": "^4.85.4",
  "zod": "^3.23.8"
}
```

### DevDependencies
```json
{
  "vite": "^5.4.1",
  "@vitejs/plugin-react-swc": "^3.5.0",
  "typescript": "^5.5.3",
  "eslint": "^9.9.0",
  "@types/chrome": "^0.x.x",
  "wxt": "^0.x.x" // (optional, Chrome extension framework)
}
```

### New Libraries to Add
```json
{
  "@wxt-dev/auto-inject": "^0.x.x", // Auto-inject content scripts
  "chrome-extension-webpack-plugin": "^2.x.x", // Extension bundling
  "messaging-library": "^x.x.x" // Optional: typed message passing
}
```

---

## 🔑 API Keys & Authentication

### Required API Keys (Same as Current Project)
1. **Google Gemini API Key**
   - Service: Google Cloud Console
   - Cost: ~$0.075 per 1M input tokens
   - Setup: Create project → Enable Generative Language API → Create API key
   - In Extension: Store in chrome.storage.sync

2. **ElevenLabs API Key**
   - Service: ElevenLabs.io
   - Cost: ~$0.30 per 1k characters
   - Setup: Sign up → Dashboard → Copy API key
   - In Extension: Store in chrome.storage.sync

3. **FAL AI API Key** (for speech recognition via Whisper)
   - Service: FAL.ai
   - Cost: ~$0.02 per minute of audio
   - Setup: Sign up → API Keys → Create key
   - In Extension: Store in chrome.storage.sync

### Authentication Flow in Extension
```typescript
// On first install or if keys missing:
1. Open Options page (popup with settings)
2. User enters API keys
3. Validate keys by making test API call
4. Store in chrome.storage.sync (encrypted if possible)
5. Sync across all instances of Chrome (if user logged in)
```

---

## 📁 File Structure for Extension

```
unstuck-chrome-extension/
├── src/
│   ├── background/
│   │   └── service-worker.ts          # Service worker entry point
│   ├── content/
│   │   ├── injector.tsx               # Content script React root
│   │   ├── index.ts                   # Content script entry
│   │   └── utils.ts                   # Content script utilities
│   ├── popup/
│   │   ├── Popup.tsx                  # Popup UI component
│   │   ├── Settings.tsx               # Settings panel
│   │   ├── index.tsx                  # Popup entry point
│   │   ├── popup.html                 # Popup HTML template
│   │   └── popup.css                  # Popup styles
│   ├── shared/
│   │   ├── types.ts                   # Message types
│   │   ├── constants.ts               # Shared constants
│   │   ├── storage.ts                 # Storage wrappers
│   │   └── api.ts                     # API client functions
│   ├── components/
│   │   ├── ChatWidget.tsx             # (Ported from client)
│   │   ├── WorkflowCreator.tsx        # (Ported from client)
│   │   ├── ui/                        # Shadcn/UI components
│   │   └── unstuck/                   # Unstuck-specific components
│   ├── contexts/
│   │   └── UnstuckContext.tsx         # (Adapted from client)
│   ├── lib/
│   │   ├── extract.ts                 # Parse Gemini responses
│   │   ├── GhostCursor.ts            # Cursor animation
│   │   ├── BoundingBoxHighlight.ts   # Element highlighting
│   │   ├── sanitize.ts               # DOM sanitization
│   │   └── utils.ts                   # General utilities
│   ├── utils/
│   │   ├── screenshot.ts              # Screenshot capture
│   │   ├── siteMetadata.ts            # Sitemap generation
│   │   └── elementDetection.ts        # DOM element utilities
│   ├── styles/
│   │   ├── global.css                 # Global styles
│   │   ├── tailwind.css               # Tailwind directives
│   │   └── extension.css              # Extension-specific styles
│   ├── manifest.json                  # Extension manifest
│   └── index.ts                       # Root entry point
├── public/
│   ├── icons/
│   │   ├── icon-16.png
│   │   ├── icon-48.png
│   │   ├── icon-128.png
│   │   └── icon-256.png
│   └── styles/
│       └── content-styles.css         # Injected styles
├── build/
│   ├── vite.config.ts                 # Vite configuration
│   ├── scripts/
│   │   ├── build.ts                   # Build script
│   │   └── copy-manifest.ts           # Copy manifest on build
│   └── tsconfig.ts                    # TypeScript config
├── tests/
│   ├── unit/                          # Unit tests
│   ├── integration/                   # Integration tests
│   └── e2e/                           # E2E tests
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔄 Migration Checklist

### Code Structure
- [ ] Extract all React components from client
- [ ] Create content script wrapper
- [ ] Create service worker handler
- [ ] Implement message passing system
- [ ] Adapt API calls for extension context
- [ ] Set up proper TypeScript paths and imports

### Features to Port
- [ ] Voice Activity Detection
- [ ] Speech-to-Text (Whisper)
- [ ] DOM Analysis and Element Tracking
- [ ] Screenshot Capture
- [ ] Gemini AI Analysis
- [ ] Visual Guidance (Ghost Cursor + Highlight)
- [ ] Auto-Clicking and Form Filling
- [ ] Text-to-Speech Response
- [ ] Chat History and Context Management
- [ ] Error Handling and User Feedback

### Extension Specifics
- [ ] Chrome Manifest v3
- [ ] Service Worker (no background page)
- [ ] Content Script Injection
- [ ] Message Passing API
- [ ] Storage API Usage
- [ ] Permissions Handling
- [ ] Icon and Assets
- [ ] Settings/Options Page
- [ ] Popup UI

### Testing
- [ ] Local development setup
- [ ] Hot reload working
- [ ] Message passing tested
- [ ] All APIs callable
- [ ] Works on multiple websites
- [ ] No console errors
- [ ] No performance issues

---

## 🚀 Deployment Strategy

### Development
1. Clone repo → Create extension folder
2. Run `npm install`
3. Run `npm run dev`
4. Load unpacked extension in Chrome (chrome://extensions)
5. Enable "Developer mode"
6. Test on various websites

### Testing
1. Package extension: `npm run build`
2. Upload to Chrome Web Store (manual testing first)
3. Get reviewer feedback
4. Iterate on issues

### Production
1. Final build: `npm run build:prod`
2. Upload to Chrome Web Store
3. Set release notes
4. Monitor user feedback
5. Schedule automatic updates

---

## 📊 Success Metrics

### Functional Metrics
- ✅ Extension loads on 100% of websites without errors
- ✅ Voice input works on first attempt
- ✅ Gemini analysis accuracy > 85%
- ✅ Auto-clicking success rate > 90%
- ✅ TTS playback works seamlessly
- ✅ Page navigation handled correctly

### Performance Metrics
- ⚡ Extension startup time < 2 seconds
- ⚡ DOM scanning time < 500ms
- ⚡ API response time < 10 seconds
- ⚡ Memory usage < 100MB
- ⚡ No noticeable page slowdown

### User Experience Metrics
- 👥 User retention > 30 days: 60%
- 👥 Average session duration > 5 minutes
- 👥 Voice activation preferred > 70% of time
- 👥 User satisfaction rating > 4/5

---

## 💡 Future Enhancements

1. **Advanced Features**
   - Multi-step workflow orchestration
   - Custom action templates
   - Macro recording
   - Team collaboration mode
   - Scheduled tasks

2. **AI Improvements**
   - Custom training on user behavior
   - Intelligent element suggestion
   - Multi-modal understanding
   - Context-aware responses
   - Learning from user corrections

3. **Integration**
   - Zapier/Make integration
   - IFTTT support
   - Browser sync across devices
   - API for third-party apps
   - CMS integrations

4. **Accessibility**
   - Screen reader support
   - Keyboard-only mode
   - High contrast themes
   - Dyslexia-friendly fonts
   - Language support (20+ languages)

---

## 📝 Notes & Considerations

1. **Content Security Policy (CSP)**
   - Extension may have stricter CSP than websites
   - Inline scripts not allowed
   - Need to use script tags with nonce or src attribute

2. **Cross-Origin Restrictions**
   - Can't access iframes from different origins
   - Shadow DOM elements need special handling
   - Some APIs may be restricted on certain sites

3. **Persistent Storage**
   - Use chrome.storage.sync for user preferences
   - chrome.storage.local for cache
   - Limits: sync = 100KB, local = 10MB

4. **Performance Considerations**
   - Lazy load heavy libraries
   - Debounce DOM updates
   - Batch message passing
   - Aggressive caching

5. **Privacy & Security**
   - Never log sensitive DOM content
   - Sanitize all data before sending to backend
   - Implement proper error handling
   - Consider GDPR compliance

