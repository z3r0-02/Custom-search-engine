import './commands';

// ─── Global Error Handling ────────────────────────────────────────────────────
// Prevent known, harmless uncaught exceptions from failing tests.
// Return false to suppress the error; return true (or nothing) to fail the test.
Cypress.on('uncaught:exception', (err) => {
  // The CSV download flow removes an anchor from the body — if our stub
  // interferes, this error can surface. It does not affect test validity.
  if (err.message.includes('removeChild')) {
    return false;
  }
  // Browser-internal layout error, not caused by application code.
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  // All other exceptions still fail the test as normal.
  return true;
});

// ─── Global beforeEach ────────────────────────────────────────────────────────
// Runs automatically before every test across all spec files.
// Keeps each test fully isolated — no leftover state from previous tests.
beforeEach(() => {
  cy.clearLocalStorage();
  cy.clearAllSessionStorage();
});

// ─── Automatic Screenshot on Failure ─────────────────────────────────────────
// Captures a screenshot whenever a test fails.
// Files are saved to cypress/screenshots/ and named after the failing test.
// Note: must use function() not () => to access this.currentTest
afterEach(function () {
  if (this.currentTest.state === 'failed') {
    cy.screenshot(`FAILED - ${this.currentTest.title}`);
  }
});
