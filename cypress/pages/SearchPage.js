// ─── Page Object Model: Search Page ──────────────────────────────────────────
//
// Centralises all selectors and actions for the search page.
// If a selector changes (e.g. #query → #search-input), fix it here only.

class SearchPage {

  // ── Selectors ───────────────────────────────────────────────────────────────

  heading()        { return cy.get('h1'); }
  searchInput()    { return cy.get('#query'); }
  searchIcon()     { return cy.get('.search-icon'); }
  resultsArea()    { return cy.get('#results'); }
  results()        { return cy.get('#results .result'); }
  resultLinks()    { return cy.get('#results .result a'); }
  resultSnippets() { return cy.get('#results .result p'); }
  downloadButton() { return cy.contains('button', 'Download Results'); }
  suggestions()      { return cy.get('#suggestions'); }
  suggestionItems()  { return cy.get('.suggestion-item'); }
  suggestionDeleteBtns() { return cy.get('.suggestion-delete'); }

  // ── Actions ─────────────────────────────────────────────────────────────────

  /** Clear the input, type a query, and click the search icon. */
  search(query) {
    this.searchInput().clear().type(query);
    this.searchIcon().click();
  }

  /** Type a query and submit with the Enter key. */
  searchByEnter(query) {
    this.searchInput().type(`${query}{enter}`);
  }

  /** Wait for exactly `count` result items to appear. */
  waitForResults(count = 4) {
    return this.results().should('have.length', count);
  }

  /** Click the Download Results button. */
  download() {
    this.downloadButton().click();
  }

  /** Focus the search input and wait for the suggestions dropdown to appear. */
  openDropdown() {
    this.searchInput().focus();
    this.suggestions().should('be.visible');
  }

  /** Delete the first suggestion and assert the dropdown stays open. */
  deleteFirstSuggestion() {
    this.suggestionDeleteBtns().first().trigger('mousedown');
    this.suggestions().should('be.visible');
  }
}

// Export a single shared instance — no need to instantiate in every test
export default new SearchPage();
