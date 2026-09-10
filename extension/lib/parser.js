function cleanText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

export function parseModelResponse(content) {
  const text = cleanText(content);

  try {
    const parsed = JSON.parse(text);
    return {
      answer: cleanText(parsed.answer || parsed.response || parsed.summary || text),
      targetLabel: cleanText(parsed.targetLabel || parsed.target || parsed.element || ''),
      action: cleanText(parsed.action || parsed.intent || 'explain'),
      confidence: Number(parsed.confidence || 0.75),
    };
  } catch (error) {
    const answer = text;
    const targetLabel = /targetLabel[:\-]\s*(.+)/i.exec(text)?.[1] || '';
    return {
      answer,
      targetLabel: cleanText(targetLabel),
      action: /action[:\-]\s*(.+)/i.exec(text)?.[1] || 'explain',
      confidence: 0.7,
    };
  }
}
