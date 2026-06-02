import SearchPage from '../pages/SearchPage';

describe('Search Page', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  // ─── Page load ───────────────────────────────────────────────────────────────

  it('displays the page title', () => {
    SearchPage.heading().should('contain.text', 'PRAKTICKÁ ČÁST');
  });

  it('shows an empty search input on load', () => {
    SearchPage.searchInput().should('have.value', '');
  });

  it('shows the Download Results button', () => {
    SearchPage.downloadButton().should('be.visible');
  });

  it('results area is empty on load', () => {
    SearchPage.resultsArea().should('be.empty');
  });

  // ─── Search interaction ───────────────────────────────────────────────────────

  it('shows an alert when searching with an empty query', () => {
    const stub = cy.stub();
    cy.on('window:alert', stub);
    SearchPage.searchIcon().click();
    cy.then(() => {
      expect(stub).to.have.been.calledWith('Zadejte prosím svůj dotaz.');
    });
  });

  it('shows an alert when query is whitespace only', () => {
    const stub = cy.stub();
    cy.on('window:alert', stub);
    SearchPage.searchInput().type('     ');
    SearchPage.searchIcon().click();
    cy.then(() => {
      expect(stub).to.have.been.calledWith('Zadejte prosím svůj dotaz.');
    });
  });

  it('triggers search when pressing Enter', () => {
    SearchPage.searchByEnter('Prague');
    cy.expectResults(4);
  });

  it('triggers search when clicking the search icon', () => {
    cy.search('Paris');
    cy.expectResults(4);
  });

  // ─── Results content ──────────────────────────────────────────────────────────

  it('displays result titles that include the query', () => {
    const query = 'Berlin';
    cy.search(query);
    SearchPage.resultLinks().each(($a) => {
      expect($a.text()).to.include(query);
    });
  });

  it('displays result links with valid href attributes', () => {
    cy.search('Rome');
    SearchPage.resultLinks().each(($a) => {
      expect($a.attr('href')).to.match(/^https?:\/\//);
    });
  });

  it('displays result snippets that include the query', () => {
    const query = 'Tokyo';
    cy.search(query);
    SearchPage.resultSnippets().each(($p) => {
      expect($p.text()).to.include(query);
    });
  });

  it('shows a "Searching..." indicator while results load', () => {
    cy.search('Vienna');
    SearchPage.resultsArea().should('contain.text', 'Searching...');
    cy.expectResults(4);
  });

  it('replaces results when searching a second time', () => {
    cy.search('Oslo');
    cy.expectResults(4);
    SearchPage.resultsArea().should('contain.text', 'Oslo');

    cy.search('Seoul');
    cy.expectResults(4);
    SearchPage.resultsArea()
      .should('contain.text', 'Seoul')
      .and('not.contain.text', 'Oslo');
  });

  it('works correctly with special characters in the query', () => {
    cy.search('New York');
    cy.expectResults(4);
    SearchPage.resultLinks().first()
      .should('contain.text', 'New York')
      .and('have.attr', 'href')
      .and('include', 'New%20York');
  });

  // ─── Navigation & persistence ─────────────────────────────────────────────────

  it('clears results after page reload', () => {
    cy.search('Madrid');
    cy.expectResults(4);

    cy.reload();

    SearchPage.resultsArea().should('be.empty');
    SearchPage.searchInput().should('have.value', '');
  });

  it('restores results after navigating back from a link', () => {
    cy.search('Budapest');
    cy.expectResults(4);

    cy.visit('/?away=1');
    cy.go('back');

    SearchPage.results().should('have.length', 4);
    SearchPage.searchInput().should('have.value', 'Budapest');
  });

  it('clicking the first result link opens the correct page', () => {
    cy.search('Amsterdam');

    SearchPage.resultLinks().first().then(($link) => {
      $link.on('click', (e) => e.preventDefault());
      expect($link.attr('href')).to.include('wikipedia.org/wiki/Amsterdam');
      cy.wrap($link).click();
    });
  });

  // ─── Download Results ─────────────────────────────────────────────────────────

  it('shows an alert when downloading with no results', () => {
    const stub = cy.stub();
    cy.on('window:alert', stub);
    SearchPage.download();
    cy.then(() => {
      expect(stub).to.have.been.calledWith('Nic ke stažení.');
    });
  });

  it('triggers a CSV download with correct headers and all 4 result rows', () => {
    cy.search('Dublin');
    cy.expectResults(4);
    SearchPage.download();

    cy.readFile('cypress/downloads/search_results.csv', { timeout: 5000 }).then((csv) => {
      const rows = csv.trim().split('\n');
      expect(rows).to.have.length(5);
      expect(rows[0]).to.equal('Title,Link,Snippet');
      rows.slice(1).forEach((row) => {
        expect(row).to.include('Dublin');
      });
    });
  });

  // ─── Search history dropdown ──────────────────────────────────────────────────

  it('shows no suggestions on a fresh page with no history', () => {
    SearchPage.searchInput().focus();
    SearchPage.suggestions().should('not.be.visible');
  });

  it('shows a suggestion after a previous search', () => {
    cy.buildHistory('Lisbon');
    SearchPage.openDropdown();
    SearchPage.suggestionItems().should('have.length', 1).first().should('contain.text', 'Lisbon');
  });

  it('filters suggestions as the user types', () => {
    cy.buildHistory('Lisbon', 'Lima');
    SearchPage.searchInput().type('Li');
    SearchPage.suggestionItems().should('have.length', 2);

    SearchPage.searchInput().clear().type('Lis');
    SearchPage.suggestionItems().should('have.length', 1).first().should('contain.text', 'Lisbon');
  });

  it('clicking a suggestion fills the input and triggers search', () => {
    cy.buildHistory('Dublin');
    SearchPage.openDropdown();
    SearchPage.suggestionItems().first().click();

    SearchPage.searchInput().should('have.value', 'Dublin');
    cy.expectResults(4);
  });

  it('pressing Escape closes the suggestions dropdown', () => {
    cy.buildHistory('Oslo');
    SearchPage.openDropdown();
    SearchPage.searchInput().type('{esc}');
    SearchPage.suggestions().should('not.be.visible');
  });

  it('shows a maximum of 5 suggestions even if history has more', () => {
    cy.buildHistory('Athens', 'Berlin', 'Cairo', 'Dubai', 'Edinburgh', 'Florence');
    SearchPage.openDropdown();
    SearchPage.suggestionItems().should('have.length', 5);
  });

  it('clicking × removes that item and keeps the dropdown open', () => {
    cy.buildHistory('Lisbon', 'Lima');
    SearchPage.openDropdown();
    SearchPage.suggestionItems().should('have.length', 2);

    SearchPage.deleteFirstSuggestion();
    SearchPage.suggestionItems().should('have.length', 1).first().should('contain.text', 'Lisbon');
  });

  it('can delete multiple items in a row without the dropdown closing', () => {
    cy.buildHistory('Athens', 'Berlin', 'Cairo');
    SearchPage.openDropdown();
    SearchPage.suggestionItems().should('have.length', 3);

    SearchPage.deleteFirstSuggestion(); // removes Cairo
    SearchPage.suggestionItems().should('have.length', 2);

    SearchPage.deleteFirstSuggestion(); // removes Berlin
    SearchPage.suggestionItems().should('have.length', 1).first().should('contain.text', 'Athens');
  });

});
