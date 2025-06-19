document.getElementById('startSession').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
  chrome.storage.local.set({fdwiz_status: "Scanning prospects..."});
  window.close();
});

chrome.storage.local.get('fdwiz_status', ({ fdwiz_status }) => {
  document.getElementById('status').textContent = fdwiz_status || 'Idle';
});