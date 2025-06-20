/**
 * Prospect matching and workflow logic for FrontDesk Wiz.
 * Handles state management and interactions with the CRM table.
 */

import { scanProspects } from './domUtils.js';

let currentRowIndex = null;
let prospects = [];
let found = false;
let highlightColor = '#8f8';

export const rules = {
  daysMin: 2, // Minimum days in status
  statuses: ['Prospect', 'New'], // Allowed status values
};

function findMatchingProspect(startIdx = 0) {
  for (let i = startIdx; i < prospects.length; ++i) {
    const p = prospects[i];
    if (p.daysInStatus >= rules.daysMin && rules.statuses.includes(p.status)) {
      return i;
    }
  }
  return -1;
}

function highlightRow(idx) {
  prospects.forEach((p, i) => {
    p.rowElem.style.background = i === idx ? highlightColor : '';
  });
  prospects[idx]?.rowElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function updatePopupStatus(txt) {
  chrome.storage.local.set({ fdwiz_status: txt });
}

function updateCounters(idx) {
  const p = prospects[idx];
  if (p.attemptsCell) p.attemptsCell.innerText = (+p.attemptsCell.innerText + 1) || 1;
  if (p.shiftCallsCell) p.shiftCallsCell.innerText = (+p.shiftCallsCell.innerText + 1) || 1;
}

export function triggerCall() {
  if (!found || currentRowIndex == null) return;
  const p = prospects[currentRowIndex];
  if (!p || !p.phoneIcon) return;
  const mouseOverEvent = new MouseEvent('mouseover', { bubbles: true });
  p.phoneIcon.dispatchEvent(mouseOverEvent);
  updateCounters(currentRowIndex);
  updatePopupStatus('Call Placed! Press "N" for next.');
}

export function startSession() {
  prospects = scanProspects();
  currentRowIndex = findMatchingProspect();
  if (currentRowIndex !== -1) {
    highlightRow(currentRowIndex);
    found = true;
    updatePopupStatus('Prospect Found! Press "C" to call.');
  } else {
    updatePopupStatus('No matching prospect found.');
    found = false;
  }
}

export function nextProspect() {
  if (currentRowIndex == null) return;
  const nextIdx = findMatchingProspect(currentRowIndex + 1);
  if (nextIdx !== -1) {
    currentRowIndex = nextIdx;
    highlightRow(nextIdx);
    found = true;
    updatePopupStatus('Prospect Found! Press "C" to call.');
  } else {
    updatePopupStatus('End of list, or no more matches.');
    found = false;
  }
}

