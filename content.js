/**
 * Initializes FrontDesk Wiz content script and wires message
 * handlers to the prospect workflow modules.
 */

(async () => {
  const { startSession, nextProspect, triggerCall } = await import(
    chrome.runtime.getURL('./prospectLogic.js')
  );

  window.addEventListener('message', event => {
    if (event.data && event.data.fdwizStart) {
      startSession();
    }
  });

  chrome.runtime.onMessage.addListener(msg => {
    if (msg.command === 'trigger-call') {
      triggerCall();
    }
    if (msg.command === 'next-prospect') {
      nextProspect();
    }
  });

  if (window === window.top) {
    window.addEventListener('DOMContentLoaded', () => {
      chrome.storage.local.get('fdwiz_start', ({ fdwiz_start }) => {
        if (fdwiz_start) {
          startSession();
          chrome.storage.local.remove('fdwiz_start');
        }
      });
    });
  }
})();

