(function (root) {
  function sanitizeDom(html) {
    if (!html) return '';

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const removeSelectors = [
      '[data-unstuck-widget]',
      '#unstuck-voice-widget',
      'script',
      'style',
      'noscript',
      'svg',
    ];

    removeSelectors.forEach((selector) => {
      doc.querySelectorAll(selector).forEach((node) => node.remove());
    });

    return doc.documentElement.outerHTML;
  }

  root.UnstuckDomExtractor = { sanitizeDom };
})(window);
