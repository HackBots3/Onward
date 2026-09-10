import { callFreeAi } from '../lib/ai-service.js';
import { parseModelResponse } from '../lib/parser.js';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'get-settings') {
    chrome.storage.local.get(['openRouterApiKey', 'groqApiKey'], (result) => {
      sendResponse({
        openRouterApiKey: result.openRouterApiKey || '',
        groqApiKey: result.groqApiKey || '',
      });
    });
    return true;
  }

  if (message.type === 'save-settings') {
    chrome.storage.local.set(message.settings, () => {
      sendResponse({ ok: true });
    });
    return true;
  }

  if (message.type === 'analyze-page') {
    (async () => {
      try {
        const settings = await chrome.storage.local.get(['openRouterApiKey', 'groqApiKey']);
        const result = await callFreeAi({
          query: message.payload?.query || '',
          dom: message.payload?.dom || '',
          url: message.payload?.url || '',
          settings,
        });

        if (!result.ok) {
          sendResponse({ ok: false, error: result.error || 'AI request failed' });
          return;
        }

        const parsed = parseModelResponse(result.content || '');
        sendResponse({ ok: true, parsed, provider: result.provider });
      } catch (error) {
        sendResponse({ ok: false, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    })();
    return true;
  }

  return false;
});
