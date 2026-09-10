(() => {
  if (window.__unstuckExtensionInjected) return;
  window.__unstuckExtensionInjected = true;

  let widget = null;
  let recognition = null;
  let highlightOverlay = null;

  function createWidget() {
    const host = document.createElement('div');
    host.id = 'unstuck-voice-widget';
    host.setAttribute('data-unstuck-widget', 'true');
    host.innerHTML = `
      <div class="unstuck-shell">
        <button id="unstuck-toggle" class="unstuck-btn">🎤</button>
        <div id="unstuck-panel" class="unstuck-panel">
          <div class="unstuck-header">Unstuck Voice Guide</div>
          <div id="unstuck-status" class="unstuck-status">Listening ready</div>
          <textarea id="unstuck-input" placeholder="Ask where a feature is or what this page contains..."></textarea>
          <div class="unstuck-actions">
            <button id="unstuck-send">Ask</button>
            <button id="unstuck-voice">Voice</button>
          </div>
          <div id="unstuck-answer" class="unstuck-answer"></div>
        </div>
      </div>
    `;
    document.body.appendChild(host);
    return host;
  }

  function getSpeechRecognition() {
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  }

  async function askAi(query) {
    const dom = window.UnstuckDomExtractor.sanitizeDom(document.documentElement.outerHTML);
    const response = await chrome.runtime.sendMessage({
      type: 'analyze-page',
      payload: {
        query,
        dom,
        url: window.location.href,
      },
    });

    return response;
  }

  function setAnswer(text) {
    const answerEl = document.getElementById('unstuck-answer');
    if (answerEl) answerEl.textContent = text;
  }

  function setStatus(text) {
    const statusEl = document.getElementById('unstuck-status');
    if (statusEl) statusEl.textContent = text;
  }

  function clearHighlight() {
    if (highlightOverlay) {
      highlightOverlay.remove();
      highlightOverlay = null;
    }
  }

  function highlightTarget(targetLabel) {
    clearHighlight();
    if (!targetLabel) return;

    const candidates = Array.from(document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="link"], [role="menuitem"], [role="tab"], [aria-label], [title]'));
    const match = candidates.find((el) => {
      const text = (el.textContent || '').trim().toLowerCase();
      const label = (el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('placeholder') || '').trim().toLowerCase();
      const haystack = `${text} ${label}`.toLowerCase();
      return haystack.includes(targetLabel.toLowerCase());
    });

    if (!match) return;

    const rect = match.getBoundingClientRect();
    const overlay = document.createElement('div');
    overlay.className = 'unstuck-highlight';
    overlay.style.top = `${rect.top + window.scrollY}px`;
    overlay.style.left = `${rect.left + window.scrollX}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    document.body.appendChild(overlay);
    highlightOverlay = overlay;

    match.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  async function handleQuery(query) {
    if (!query?.trim()) return;
    setStatus('Thinking…');
    const response = await askAi(query.trim());
    if (response?.ok) {
      const finalText = response.parsed?.answer || 'I could not determine an answer.';
      const target = response.parsed?.targetLabel || '';
      setAnswer(finalText);
      setStatus('Ready');
      if (target) highlightTarget(target);
      speak(finalText);
    } else {
      setAnswer(response?.error || 'AI request failed');
      setStatus('Ready');
    }
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }

  function wireEvents() {
    const toggle = document.getElementById('unstuck-toggle');
    const panel = document.getElementById('unstuck-panel');
    const send = document.getElementById('unstuck-send');
    const voice = document.getElementById('unstuck-voice');
    const input = document.getElementById('unstuck-input');

    toggle?.addEventListener('click', () => {
      panel?.classList.toggle('open');
    });

    send?.addEventListener('click', () => {
      handleQuery(input?.value || '');
    });

    voice?.addEventListener('click', () => {
      const SpeechRecognition = getSpeechRecognition();
      if (!SpeechRecognition) {
        setAnswer('Speech recognition is not available in this browser.');
        return;
      }

      if (recognition) {
        recognition.stop();
        recognition = null;
        return;
      }

      recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        if (transcript) {
          input.value = transcript;
          handleQuery(transcript);
        }
      };
      recognition.onerror = () => setStatus('Voice input failed');
      recognition.onend = () => {
        recognition = null;
        setStatus('Ready');
      };
      recognition.start();
      setStatus('Listening…');
    });
  }

  widget = createWidget();
  wireEvents();
})();
