# Buck2Bar - Budget Tracker

A single-page vanilla JavaScript application to track monthly income and expenses with real-time chart updates.

## Features

- Monthly income/expense entry (12 months)
- Live Chart.js bar chart (income vs. expense)
- Save data to localStorage
- Clear all data and reset
- Username input with validation:
  - At least 8 characters
  - At least 1 uppercase letter
  - At least 1 number
  - At least 1 special character
- Submit button only enabled when username is valid
- Download chart as PNG

## Files

- `index.html` — page layout, tabs, form, chart container
- `script.js` — logic for data initialization, UI binding, chart updates, validation, local storage
- `tests/script.test.js` — Jest unit tests
- `package.json` — project dependencies and test script
- `.gitignore` — excludes node_modules and test artifacts

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run tests:

```bash
npm test
```

## Usage

1. Open `index.html` in your browser.
2. Enter a username that meets the validation rules.
3. Fill monthly income and expense entries.
4. Click `Save Data` to persist values.
5. Click `Chart` tab to view the chart.
6. Click `Download as PNG` to export.

## Testing

- Jest unit tests execute with `npm test`.
- Current tests cover:
  - validation logic (`validateUsername`)
  - data initialization (`initializeData`)
  - feedback UI (`showFeedback`)
  - month arrays (`months`, `monthKeys`)

## Notes

- No build tool required, browser-only project.
- Chart.js and Bootstrap are included by CDN in `index.html`.
