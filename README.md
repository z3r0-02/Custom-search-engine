# Custom Search Engine — E2E test demo

A small static search page ([`index.html`](index.html)) with a full
[Cypress](https://www.cypress.io/) end-to-end test suite. The page mocks search
results for any query, keeps a search-history dropdown, and can export results to CSV.

## Requirements

- [Node.js](https://nodejs.org/) 18, 20, or 22
- npm (ships with Node)

## Getting started

```bash
npm install      # install dependencies (Cypress, dev server)
npm test         # start the server, run all tests headlessly, then shut it down
```

`npm test` is fully self-contained — it boots a static server on
`http://localhost:8080`, waits for it, runs Cypress, and stops the server when done.
You do **not** need to start a server yourself.

## Other commands

| Command             | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `npm test`          | Start server + run the whole suite headlessly (CI-friendly).        |
| `npm run test:open` | Start server + open the interactive Cypress runner.                 |
| `npm start`         | Just serve the page at `http://localhost:8080` (no tests).          |

## Project structure

```
index.html               # the application (static HTML/CSS/JS)
styles.css               # styling
cypress.config.js         # Cypress config (baseUrl: http://localhost:8080)
cypress/
  e2e/search.cy.js        # the test specs
  pages/SearchPage.js     # Page Object Model (selectors + actions)
  support/                # custom commands + global hooks
```

## Notes

- `node_modules/` is intentionally **not** committed — run `npm install` to
  regenerate it. `package-lock.json` is committed so everyone gets identical versions.
- The tests require the page to be served over HTTP (Cypress `baseUrl`); opening
  `index.html` directly via `file://` will not work. Use the `npm` scripts above.
