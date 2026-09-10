# Chrome Extension Development - Technical Reference

## 🔧 Chrome Extension Fundamentals for Unstuck

### Manifest v3 Structure
```json
{
  "manifest_version": 3,
  "name": "Unstuck - Voice Web Navigation",
  "version": "1.0.0",
  "description": "Navigate any website with voice commands",
  "permissions": [
    "activeTab",
    "scripting",
    "storage",
    "webRequest",
    "tabs"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content-script.js"],
      "all_frames": false,
      "run_at": "document_start"
    }
  ],
  "action": {
    "default_popup": "popup.html",
    "default_title": "Unstuck - Voice Navigation",
    "default_icons": {
      "16": "images/icon-16.png",
      "48": "images/icon-48.png",
      "128": "images/icon-128.png"
    }
  },
  "icons": {
    "16": "images/icon-16.png",
    "48": "images/icon-48.png",
    "128": "images/icon-128.png"
  }
}
```

---

## 🏗️ Extension Architecture Patterns

### Message Passing Pattern (Content ↔ Background)

#### In Content Script (content-script.tsx)
```typescript
// Send message to background script
chrome.runtime.sendMessage(
  {
    type: 'ANALYZE',
    payload: {
      userQuery: "Find flights to New York",
      screenshot: "data:image/png;base64,...",
      domString: "<html>...</html>",
      sitemap: "Home → Search",
      previousMessages: []
    }
  },
  (response) => {
    if (response.success) {
      console.log("AI Analysis:", response.result);
      // Update UI with response
    } else {
      console.error("Error:", response.error);
    }
  }
);
```

#### In Service Worker (background/service-worker.ts)
```typescript
// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ANALYZE') {
    // Make actual API call to backend
    fetch(`${BACKEND_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(message.payload),
    })
      .then(res => res.json())
      .then(data => {
        sendResponse({ success: true, result: data });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    
    // IMPORTANT: Return true to indicate async response
    return true;
  }
});
```

### Storage Pattern

#### Save API Keys
```typescript
// In popup or settings page
chrome.storage.sync.set({
  geminiApiKey: userInput.gemini,
  elevenLabsApiKey: userInput.elevenLabs,
  falApiKey: userInput.fal,
  backendUrl: userInput.backendUrl || 'https://server.example.com',
}, () => {
  console.log('Settings saved');
});

// Retrieve API keys
chrome.storage.sync.get(
  ['geminiApiKey', 'elevenLabsApiKey', 'falApiKey', 'backendUrl'],
  (result) => {
    const apiKey = result.geminiApiKey;
    const backendUrl = result.backendUrl;
    // Use in background script
  }
);
```

#### Save Chat History
```typescript
// Per-tab chat history
chrome.storage.local.set({
  [`chat_${tabId}`]: {
    messages: [...],
    timestamp: Date.now(),
  }
});

// Retrieve for specific tab
chrome.storage.local.get([`chat_${tabId}`], (result) => {
  const chatHistory = result[`chat_${tabId}`] || { messages: [] };
});
```

### Content Script Injection Pattern

#### Inject React Component
```typescript
// In content-script.tsx (runs on every page)

// 1. Check if already injected
if (document.getElementById('unstuck-extension-root')) {
  console.log('Unstuck already injected on this page');
  exit;
}

// 2. Create container
const container = document.createElement('div');
container.id = 'unstuck-extension-root';
container.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999999;
  font-family: system-ui, -apple-system, sans-serif;
`;
document.body.appendChild(container);

// 3. Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  #unstuck-extension-root {
    all: initial;
    display: contents;
  }
  #unstuck-extension-root * {
    all: revert;
  }
`;
document.head.appendChild(styleSheet);

// 4. Create React root
import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatWidget from './components/ChatWidget';

const root = createRoot(container);
root.render(
  <ChatWidget 
    onMessage={(msg) => {
      // Send to background script
      chrome.runtime.sendMessage({ type: 'PROCESS_QUERY', payload: msg });
    }}
  />
);

// 5. Cleanup on page unload
window.addEventListener('beforeunload', () => {
  root.unmount();
});
```

### Tab Management Pattern

#### Execute Script on Active Tab
```typescript
// In background/service-worker.ts
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const activeTab = tabs[0];
  
  chrome.tabs.executeScript(activeTab.id, {
    code: `
      // This code runs in the content script context
      document.querySelectorAll('[data-unstuck-id]').forEach(el => {
        console.log('Found interactive element:', el.getAttribute('data-unstuck-id'));
      });
    `
  });
});

// Better approach: Use scripting API (Manifest v3)
chrome.scripting.executeScript({
  target: { tabId: activeTab.id },
  function: () => {
    const elements = document.querySelectorAll('[data-unstuck-id]');
    return Array.from(elements).map(el => ({
      id: el.getAttribute('data-unstuck-id'),
      text: el.textContent,
    }));
  },
});
```

---

## 🔄 Converting React Components for Extension

### UnstuckContext Adaptation

**Before (React Client)**:
```typescript
export function UnstuckProvider({ children, config }: UnstuckProviderProps) {
  const getCurrentContext = async () => {
    // Direct API calls
    const response = await fetch(`${serverUrl}/analyze`, {...});
  };
}
```

**After (Extension)**:
```typescript
export function UnstuckProvider({ children, config }: UnstuckProviderProps) {
  const getCurrentContext = async () => {
    // Message to background script
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { 
          type: 'GET_CONTEXT',
          tabId: chrome.tabs.id // Include tab ID
        },
        (response) => {
          if (response.success) {
            resolve(response.context);
          } else {
            reject(new Error(response.error));
          }
        }
      );
    });
  };
}
```

### ChatWidget Adaptation

**Key Changes**:
```typescript
// 1. Replace direct API calls with message passing
// OLD:
const response = await fetch(`${serverUrl}/asr`, {...});

// NEW:
chrome.runtime.sendMessage({
  type: 'ASR',
  payload: { audio_data, language }
}, handleASRResponse);

// 2. Handle cross-domain issues
// OLD: Direct API call with CORS
// NEW: Background script handles all API calls

// 3. Persist chat across navigations
// OLD: useState only
// NEW: useState + chrome.storage.local

// 4. Handle tab switches
// Listen for tab changes and reload context
chrome.tabs.onActivated.addListener((activeInfo) => {
  // Load chat history for new tab
  loadChatForTab(activeInfo.tabId);
});
```

---

## 🎤 Voice Input in Extension

### Service Worker Cannot Access Microphone
```typescript
// ❌ This WON'T work in background.js:
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

// ✅ Must do in content script:
// content-script.tsx
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const mediaRecorder = new MediaRecorder(stream);

// Send audio to background for processing
mediaRecorder.ondataavailable = (event) => {
  chrome.runtime.sendMessage({
    type: 'ASR',
    payload: { audio_data: event.data }
  });
};
```

### VAD Implementation in Extension
```typescript
// content-script.tsx
import { useMicVAD } from '@ricky0123/vad-react';

const vad = useMicVAD({
  onSpeechEnd: async (audio) => {
    // Audio detected and VAD ended
    // Convert to blob and send to background
    const audioBlob = new Blob([audio], { type: 'audio/wav' });
    const reader = new FileReader();
    
    reader.onloadend = () => {
      chrome.runtime.sendMessage({
        type: 'TRANSCRIBE_AUDIO',
        payload: {
          audio_data: reader.result
        }
      }, handleTranscription);
    };
    
    reader.readAsDataURL(audioBlob);
  }
});
```

---

## 🌐 Handling Cross-Origin Issues

### Problem: Can't Access iframes
```typescript
// ❌ This fails on cross-origin pages:
const elements = document.querySelectorAll('iframe');
const iframeDoc = elements[0].contentDocument; // Null on cross-origin!

// ✅ Solution: Mark iframes as out-of-scope
// Tell user: "I can't control elements inside nested iframes"
```

### Problem: Shadow DOM
```typescript
// ❌ Regular query doesn't find shadow DOM elements:
document.querySelector('[data-unstuck-id="x"]'); // Not found

// ✅ Solution: Use pierce pseudo-element (limited support)
// OR traverse shadow trees manually:
function findInShadow(selector, root = document) {
  const element = root.querySelector(selector);
  if (element) return element;
  
  for (let el of root.querySelectorAll('*')) {
    if (el.shadowRoot) {
      const found = findInShadow(selector, el.shadowRoot);
      if (found) return found;
    }
  }
  return null;
}
```

### Problem: CSP (Content Security Policy)
```typescript
// Some sites have strict CSP that prevents extension scripts
// Manifest solution:
{
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "exclude_matches": [
      "https://bank.com/*", // Banks often have strict CSP
      "https://admin.example.com/*"
    ]
  }]
}
```

---

## 🔐 Secure API Key Handling

### Never Store Keys in Content Script
```typescript
// ❌ BAD - Visible in page source
window.GEMINI_API_KEY = 'sk-proj-...';

// ✅ GOOD - Store in background script
// background/service-worker.ts
chrome.storage.sync.get(['geminiApiKey'], (result) => {
  const apiKey = result.geminiApiKey;
  // Use only in background, never expose to content script
});
```

### Secure Message Validation
```typescript
// In background script, validate sender
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Only accept from extension's own content scripts
  if (!sender.url.startsWith('chrome-extension://')) {
    sendResponse({ error: 'Invalid sender' });
    return;
  }
  
  // Process message safely
  if (message.type === 'ANALYZE') {
    processWithApiKey(message.payload);
  }
});
```

---

## 📊 DOM Tracking in Extension Content Script

### Initialize Element IDs
```typescript
// When page loads or content updates
const processElements = () => {
  const interactives = [
    'button', 'a', 'input', 'select', 'textarea'
  ];
  
  document.querySelectorAll(interactives.join(', ')).forEach((el, idx) => {
    if (!el.hasAttribute('data-unstuck-id')) {
      el.setAttribute('data-unstuck-id', `el-${Date.now()}-${idx}`);
    }
  });
};

// Initial scan
processElements();

// Watch for new elements
const observer = new MutationObserver(() => {
  // Debounce processing
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(processElements, 500);
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
});
```

### Execute Action on Element
```typescript
// Receive action from Gemini via background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'EXECUTE_ACTION') {
    const { elementId, action } = message.payload;
    const element = document.querySelector(`[data-unstuck-id="${elementId}"]`);
    
    if (!element) {
      sendResponse({ error: 'Element not found' });
      return;
    }
    
    switch(action) {
      case 'click':
        element.click();
        break;
      case 'focus':
        element.focus();
        break;
      case 'type':
        element.value = message.payload.text;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        break;
    }
    
    sendResponse({ success: true });
  }
});
```

---

## 🧪 Testing Extension Locally

### Load Unpacked Extension
```
1. Open chrome://extensions/
2. Enable "Developer mode" (top-right)
3. Click "Load unpacked"
4. Select your extension folder
5. Extension appears in list with ID
```

### Debug Background Script
```
1. Go to chrome://extensions/
2. Find your extension
3. Click "background.js" link under "Inspect views"
4. DevTools opens for background script
5. Set breakpoints and debug
```

### Debug Content Script
```
1. Visit any website with extension active
2. Right-click → Inspect
3. In DevTools, go to "Sources"
4. Find content-script.js
5. Set breakpoints and debug
```

### Check Console Logs
```
// Background script logs:
- Open chrome://extensions/
- Click "background.js" → DevTools opens

// Content script logs:
- Right-click page → Inspect → Console tab

// Use this for logging:
console.log('Debug message'); // Shows in respective DevTools
```

---

## 📦 Build Configuration for Extension

### Vite Config for Multiple Entry Points
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/popup.html'),
        background: resolve(__dirname, 'src/background/service-worker.ts'),
        content: resolve(__dirname, 'src/content/index.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  // ...
})
```

### Package Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build && npm run copy-manifest",
    "copy-manifest": "cp src/manifest.json dist/",
    "preview": "vite preview"
  }
}
```

---

## 🚀 Deployment Checklist

### Before Publishing
- [ ] Test on 10+ different websites
- [ ] No console errors or warnings
- [ ] API keys properly secured
- [ ] Privacy policy documented
- [ ] Permissions justified and minimal
- [ ] Icons created (16, 48, 128 px)
- [ ] Description and screenshots ready
- [ ] Version bumped in manifest.json

### Chrome Web Store Submission
1. Package as .zip file
2. Go to Chrome Web Store Developer Dashboard
3. Upload .zip
4. Fill in store listing (name, description, screenshots)
5. Set category and privacy policy
6. Submit for review (usually 1-3 days)

### Post-Launch
- Monitor reviews and ratings
- Fix bugs quickly with updates
- Track analytics (if enabled)
- Respond to user feedback
- Plan feature improvements

---

## 🎯 Performance Optimization Tips for Extension

1. **Lazy Load React**
   - Don't inject immediately, wait for user interaction
   - Delay importing heavy libraries

2. **Debounce DOM Mutations**
   - Don't process every tiny change
   - Batch updates every 500ms

3. **Cache Screenshots**
   - Store last 3 screenshots
   - Reduce redundant captures

4. **Message Batching**
   - Send multiple actions in one message
   - Reduce background ↔ content communication

5. **Memory Management**
   - Limit chat history (keep last 10 messages)
   - Clear timeouts and intervals
   - Unmount React components properly

