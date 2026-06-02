// ─── Custom Commands ──────────────────────────────────────────────────────────

Cypress.Commands.add('search', (query) => {
  cy.get('#query').clear().type(query);
  cy.get('.search-icon').click();
});

// Making sure there are exactly that many results as wanted
Cypress.Commands.add('expectResults', (count = 4) => {
  cy.get('#results .result', { timeout: 3000 }).should('have.length', count);
});

// Searches each query (populating localStorage history), then navigates back to '/'.
Cypress.Commands.add('buildHistory', (...queries) => {
  queries.forEach((query) => {
    cy.search(query);
    cy.expectResults(4);
  });
  cy.visit('/');
});
