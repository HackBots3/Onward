document.addEventListener('DOMContentLoaded', async () => {
  const openRouterInput = document.getElementById('openRouterApiKey');
  const groqInput = document.getElementById('groqApiKey');
  const saveButton = document.getElementById('save');

  const settings = await chrome.runtime.sendMessage({ type: 'get-settings' });
  openRouterInput.value = settings.openRouterApiKey || '';
  groqInput.value = settings.groqApiKey || '';

  saveButton.addEventListener('click', async () => {
    await chrome.runtime.sendMessage({
      type: 'save-settings',
      settings: {
        openRouterApiKey: openRouterInput.value.trim(),
        groqApiKey: groqInput.value.trim(),
      },
    });
    window.close();
  });
});
