// ─── Page Object Model: Search Page ──────────────────────────────────────────
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
  // Performs a search by typing in the input and clicking the search icon.
  search(query) {
    this.searchInput().clear().type(query);
    this.searchIcon().click();
  }
  //by Enter
  searchByEnter(query) {
    this.searchInput().type(`${query}{enter}`);
  }

  download() {
    this.downloadButton().click();
  }

  // Dropdown
  openDropdown() {
    this.searchInput().focus();
    this.suggestions().should('be.visible');
  }

  // Deleting first suggestion in dropdown and dropdown should stay visible
  deleteFirstSuggestion() {
    this.suggestionDeleteBtns().first().trigger('mousedown');
    this.suggestions().should('be.visible');
  }
}

// Export a single shared instance
export default new SearchPage();
