// ─── Custom Commands ──────────────────────────────────────────────────────────

/**
 * Types a query into the search input and clicks the search icon.
 * @example cy.search('London')
 */
Cypress.Commands.add('search', (query) => {
  cy.get('#query').clear().type(query);
  cy.get('.search-icon').click();
});

/**
 * Asserts that exactly `count` result items are visible, waiting up to 3s.
 * @example cy.expectResults(4)
 */
Cypress.Commands.add('expectResults', (count = 4) => {
  cy.get('#results .result', { timeout: 3000 }).should('have.length', count);
});

/**
 * Searches each query (populating localStorage history), then navigates back to '/'.
 * Use this in dropdown tests to build up history before checking suggestions.
 * @example cy.buildHistory('Lisbon', 'Lima')
 */
Cypress.Commands.add('buildHistory', (...queries) => {
  queries.forEach((query) => {
    cy.search(query);
    cy.expectResults(4);
  });
  cy.visit('/');
});
