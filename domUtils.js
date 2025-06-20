/**
 * DOM utilities for locating and scanning the prospects table
 * in the FrontDesk Wiz extension.
 */

export function getProspectsTable() {
  // Try known ID or class first for stability
  let table = document.querySelector('#prospects, .prospects-table');
  if (table) return table;

  // Fallback: search for a table that has distinctive headers
  return (
    Array.from(document.querySelectorAll('table')).find(t => {
      const headers = Array.from(t.querySelectorAll('th')).map(th =>
        th.textContent.trim()
      );
      return headers.includes('Names') && headers.includes('Days in Status');
    }) || null
  );
}

export function scanProspects() {
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

