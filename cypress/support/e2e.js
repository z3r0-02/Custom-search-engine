import './commands';

// ─── Global Error Handling ────────────────────────────────────────────────────
// Prevent known, harmless uncaught exceptions from failing tests.
// Return false to suppress the error; return true (or nothing) to fail the test.
Cypress.on('uncaught:exception', (err) => {
  // index.html's 213 line.
  if (err.message.includes('removeChild')) {
    return false;
  }
  // Browser-internal layout error, not caused by application code.
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return true; //fail the test
});

// ─── Global beforeEach ────────────────────────────────────────────────────────
// Runs automatically before every test
// For test isolation
beforeEach(() => {
  cy.clearLocalStorage();
  cy.clearAllSessionStorage();
});

// ─── Automatic Screenshot on Failure ─────────────────────────────────────────
afterEach(function () {
  if (this.currentTest.state === 'failed') {
    cy.screenshot(`FAILED - ${this.currentTest.title}`);
  }
});
