let fdz_currentRowIndex = null;
let fdz_prospects = [];
let fdz_found = false;
let fdz_highlightColor = '#8f8';
const rules = {
  daysMin: 2,     // Example: only prospects with at least 2 days in status
  statuses: ['Prospect', 'New'], // Example statuses to match
};

function getProspectsTable() {
  // Try known ID or class first for stability
  let table = document.querySelector('#prospects, .prospects-table');
  if (table) return table;

  // Fallback: search for a table that has distinctive headers
  return Array.from(document.querySelectorAll('table')).find(t => {
    const headers = Array.from(t.querySelectorAll('th')).map(th =>
      th.textContent.trim()
    );
    return headers.includes('Names') && headers.includes('Days in Status');
  }) || null;
}

function scanProspects() {
  const table = getProspectsTable();
  if (!table) return [];
  const rows = table.querySelectorAll('tbody tr');
  return Array.from(rows).map(row => {
    const cells = row.querySelectorAll('td');
    return {
      rowElem: row,
      daysInStatus: parseInt(cells[4]?.innerText || '0', 10),
      status: cells[5]?.innerText.trim(),
      phoneCell: cells[2],
      phoneIcon: cells[2]?.querySelector('svg'),
      attemptsCell: cells[7], // adjust if needed
      shiftCallsCell: cells[8] // adjust if needed
    };
  });
}

function findMatchingProspect(startIdx=0) {
  for (let i = startIdx; i < fdz_prospects.length; ++i) {
    const p = fdz_prospects[i];
    if (
      p.daysInStatus >= rules.daysMin &&
      rules.statuses.includes(p.status)
    ) {
      return i;
    }
  }
  return -1;
}

function highlightRow(idx) {
  fdz_prospects.forEach((p, i) => {
    p.rowElem.style.background = (i === idx) ? fdz_highlightColor : '';
  });
  fdz_prospects[idx]?.rowElem.scrollIntoView({behavior:'smooth', block:'center'});
}

function updatePopupStatus(txt) {
  chrome.storage.local.set({fdwiz_status: txt});
}

function updateCounters(idx) {
  // Simple increment logic; adjust as per your CRM's DOM
  const p = fdz_prospects[idx];
  if (p.attemptsCell) p.attemptsCell.innerText = (+p.attemptsCell.innerText + 1) || 1;
  if (p.shiftCallsCell) p.shiftCallsCell.innerText = (+p.shiftCallsCell.innerText + 1) || 1;
}

function triggerCall(idx) {
  const p = fdz_prospects[idx];
  if (!p || !p.phoneIcon) return;
  // Mouseover event for the SVG phone icon
  const mouseOverEvent = new MouseEvent('mouseover', { bubbles: true });
  p.phoneIcon.dispatchEvent(mouseOverEvent);
  updateCounters(idx);
  updatePopupStatus('Call Placed! Press "N" for next.');
}

function startSession() {
  fdz_prospects = scanProspects();
  fdz_currentRowIndex = findMatchingProspect();
  if (fdz_currentRowIndex !== -1) {
    highlightRow(fdz_currentRowIndex);
    fdz_found = true;
    updatePopupStatus('Prospect Found! Press "C" to call.');
  } else {
    updatePopupStatus('No matching prospect found.');
    fdz_found = false;
  }
}

function nextProspect() {
  if (fdz_currentRowIndex == null) return;
  const nextIdx = findMatchingProspect(fdz_currentRowIndex + 1);
  if (nextIdx !== -1) {
    fdz_currentRowIndex = nextIdx;
    highlightRow(nextIdx);
    fdz_found = true;
    updatePopupStatus('Prospect Found! Press "C" to call.');
  } else {
    updatePopupStatus('End of list, or no more matches.');
    fdz_found = false;
  }
}

window.addEventListener('message', (event) => {
  if (event.data && event.data.fdwizStart) {
    startSession();
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.command === 'trigger-call' && fdz_found && fdz_currentRowIndex != null) {
    triggerCall(fdz_currentRowIndex);
  }
  if (msg.command === 'next-prospect') {
    nextProspect();
  }
});

// For manual start from popup.js
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