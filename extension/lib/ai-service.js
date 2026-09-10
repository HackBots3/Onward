function buildPrompt({ query, dom, url }) {
  return [
    'You are Unstuck, a helpful website navigation assistant.',
    'Your job is to help the user find UI elements on a website and explain the page in a concise way.',
    'Return valid JSON with keys: answer, targetLabel, action, confidence.',
    'Use short natural language answers, and if the user asks where something is, include the visible label or text that likely matches the target.',
    'If no clear match exists, say so plainly.',
    '',
    `User question: ${query}`,
    `Page URL: ${url}`,
    'Page structure (sanitized):',
    dom.slice(0, 14000),
  ].join('\n');
}

export async function callFreeAi({ query, dom, url, settings }) {
  const openRouterKey = settings.openRouterApiKey?.trim();
  const groqKey = settings.groqApiKey?.trim();

  if (!openRouterKey && !groqKey) {
    return { ok: false, error: 'Add an OpenRouter or Groq API key in the popup first.' };
  }

  const providers = [];

  // Define fallback models for OpenRouter (free models pool)
  if (openRouterKey) {
    const openRouterModels = [
      'meta-llama/llama-3.3-70b-instruct:free',
      'nousresearch/hermes-3-llama-3.1-405b:free',
      'qwen/qwen3-coder:free',
      'openrouter/free'
    ];

    for (const model of openRouterModels) {
      providers.push({
        name: `OpenRouter (${model})`,
        url: 'https://openrouter.ai/api/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com',
          'X-Title': 'Unstuck Voice Guide',
        },
        body: {
          model,
          messages: [{ role: 'user', content: buildPrompt({ query, dom, url }) }],
          temperature: 0.2,
          max_tokens: 320,
        },
      });
    }
  }

  // Define fallback models for Groq (free tier models pool)
  if (groqKey) {
    const groqModels = [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'llama3-8b-8192'
    ];

    for (const model of groqModels) {
      providers.push({
        name: `Groq (${model})`,
        url: 'https://api.groq.com/openai/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json',
        },
        body: {
          model,
          messages: [{ role: 'user', content: buildPrompt({ query, dom, url }) }],
          temperature: 0.2,
          max_tokens: 320,
        },
      });
    }
  }

  let lastError = null;

  for (const provider of providers) {
    try {
      const response = await fetch(provider.url, {
        method: 'POST',
        headers: provider.headers,
        body: JSON.stringify(provider.body),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error?.message || `Request failed with status ${response.status}`);
      }

      const content = data?.choices?.[0]?.message?.content || '';
      return { ok: true, provider: provider.name, content };
    } catch (error) {
      console.warn(`Provider ${provider.name} failed:`, error);
      lastError = error;
    }
  }

  return { ok: false, error: lastError instanceof Error ? lastError.message : 'All free AI providers failed.' };
}
