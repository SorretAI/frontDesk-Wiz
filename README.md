# FrontDesk Wiz Chrome Extension

FrontDesk Wiz is a semi-automated calling assistant for the IRSL Logics CRM. It helps you quickly find and call the right prospects according to your rules and assists with tracking calls and outcomes, all from within Chrome.

---

## Features

- **Automated Prospect Scanning:** Scans the FD 2 PROSPECTS table and finds the next prospect based on your criteria (Days in Status, Status).
- **Highlight & Scroll:** Highlights the matching row and scrolls it into view.
- **Semi-Automated Calling:** Initiates RingCentral calling via a mouseover on the phone icon when you press "C".
- **Counters & Workflow:** Increments call counters and prompts you to move to the next prospect with "N".
- **Popup Status:** Popup displays workflow status for clear feedback.

---

## Installation

1. **Download and Unzip**
    - Download and extract (unzip) this folder somewhere on your computer.

2. **Load in Chrome**
    1. Open Chrome.
    2. Go to `chrome://extensions`.
    3. Enable **Developer mode** (top right).
    4. Click **Load unpacked**.
    5. Select the `frontdesk-wiz-extension` folder.

3. **Pin the Extension (optional)**
    - Click the puzzle icon in Chrome, then pin FrontDesk Wiz for quick access.

---

## Usage

1. **Open IRSL Logics CRM**
    - Log into your account and navigate to the **FD 2 PROSPECTS** page (table view).

2. **Start a Calling Session**
    - Click the FrontDesk Wiz extension icon in Chrome.
    - In the popup, click **Start Calling Session**.
    - The extension will scan your list and highlight the first matching prospect (according to your rules).

3. **Initiate Call**
    - Press **C** on your keyboard (with the CRM tab focused).
    - The script triggers a mouseover event on the phone icon, launching RingCentral to call that prospect.
    - The popup will update status to **Call Placed! Press "N" for next.**

4. **Go to Next Prospect**
    - After your call, press **N**.
    - The script will highlight the next matching prospect and repeat the cycle.

---

## Customizing Rules

You can edit the criteria in `content.js` at the top:
```js
const rules = {
  daysMin: 2,                      // Minimum days in status (column 5)
  statuses: ['Prospect', 'New'],   // Allowed status values (column 6)
};
```
- Change `daysMin` or add/remove items in `statuses` as needed.

---

## Adjusting for Your Table Layout

If the CRM’s table structure changes:
- Update the cell indexes in `content.js` in the `scanProspects()` function.
    - `cells[4]` is the “Days in Status” column
    - `cells[5]` is the “Status” column
    - `cells[2]` is the phone number column

If any column order changes, adjust these indexes accordingly.

---

## Troubleshooting

- **Nothing is highlighted?**  
  Make sure you're on the correct table page, and your rules are correct for your prospect list.
- **Pressing C or N does nothing?**  
  Be sure your Chrome tab is focused, and you're in the correct page context.
- **Phone icon not triggering RingCentral?**  
  Make sure the phone icon is a real `<svg>` element in the third column and your browser allows the event.
- **You want a different highlight color?**  
  Edit `fdz_highlightColor` in `content.js`.

---

## Security & Privacy

This extension runs only on `irslogics.com` pages. No data leaves your machine.

---

## Uninstall

Go to `chrome://extensions` and click **Remove** for FrontDesk Wiz.

---

## Need More Help?

Open an issue or contact your developer for advanced modifications!

---