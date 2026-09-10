# Unstuck Voice Guide Extension

A free, browser-based version of the Unstuck experience that works on most websites.

## What it does
- Injects a floating voice assistant widget into any page
- Lets the user ask questions like “Where is the sign-in button?” or “What is this page about?”
- Uses the current page DOM plus a free AI model to generate a helpful answer
- Speaks the answer using the browser’s native speech synthesis
- Supports voice input via the browser’s Web Speech API when available

## Free AI setup
You can use either:
- OpenRouter with a free model (recommended)
- Groq as a fallback

No backend server is required.

## Install in Chrome or Edge
1. Open chrome://extensions
2. Enable “Developer mode”
3. Click “Load unpacked”
4. Select the extension folder
5. Open the extension popup and save your API keys

## Notes
- The extension works best with Chrome or Edge
- If both API keys are empty, the assistant will not be able to answer questions
- The current implementation focuses on a clean, low-friction experience rather than a heavy multi-page workflow
