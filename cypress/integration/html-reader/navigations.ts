import {
  IFRAME_SELECTOR,
  MOBY_EPUB2_MANIFEST_REQUEST,
  MOBY_EPUB2_PATH,
} from '../../support/constants';

describe('navigating an EPUB page', () => {
  beforeEach(() => {
    cy.intercept('GET', MOBY_EPUB2_MANIFEST_REQUEST).as('manifest');
    cy.loadPage(MOBY_EPUB2_PATH);
    cy.wait('@manifest');

    // wait for requests to resolve
    // wait for it to show
  });

  it('should contain a link to return to the homepage', () => {
    cy.findByRole('link', { name: 'Return to Homepage' }).should(
      'have.prop',
      'href',
      '/'
    );
  });

  it.only('should update page content after clicking on TOC link', () => {
    cy.iframe(IFRAME_SELECTOR)
      .findByRole('img', {
        name: 'Cover',
      })
      .should('exist');

    const chapter2Name = 'CHAPTER 2. The Carpet-Bag.';

    cy.iframe(IFRAME_SELECTOR).findByText(chapter2Name).should('not.exist');

    // Open TOC menu
    cy.findByRole('button', { name: 'Table of Contents' }).click();

    // Open chapter 1
    cy.findByRole('menuitem', { name: chapter2Name }).click();

    cy.log('briefly see the loading indicator');
    cy.get('#reader-loading').should('be.visible');
    cy.get('#reader-loading').should('not.be.visible');

    cy.iframe(IFRAME_SELECTOR)
      .findByText('Down the Rab­bit-Hole')
      .should('exist');
  });

  it('should navigate forward and backwards with page buttons', () => {
    cy.log('make sure we are on the homepage');
    cy.iframe(IFRAME_SELECTOR)
      .findByRole('img', {
        name: "Alice's Adventures in Wonderland, by Lewis Carroll",
      })
      .should('exist');

    cy.findByRole('button', { name: 'Settings' }).click();
    // let's make sure we are on paginated mode
    cy.findByText('Paginated').click();

    cy.findByRole('button', { name: 'Next Page' }).click();

    cy.log('Should briefly see the Loading indicator');
    cy.get('#reader-loading').should('be.visible');
    cy.get('#reader-loading').should('not.be.visible');

    cy.log('Then we see the next page');
    cy.iframe(IFRAME_SELECTOR, { timeout: 10000 })
      .findByRole('img', {
        name: 'The Standard Ebooks logo',
        timeout: 20000,
      })
      .should('exist');

    cy.iframe(IFRAME_SELECTOR)
      .findByRole('img', {
        name: "Alice's Adventures in Wonderland, by Lewis Carroll",
      })
      .should('not.exist');

    cy.findByRole('button', { name: 'Previous Page' }).click();

    cy.log('Should briefly see the Loading indicator');
    cy.get('#reader-loading').should('be.visible');
    cy.get('#reader-loading').should('not.be.visible');

    cy.log('Then we see the next page');
    cy.iframe(IFRAME_SELECTOR)
      .findByRole('img', {
        name: "Alice's Adventures in Wonderland, by Lewis Carroll",
      })
      .should('exist');

    // TODO: Test whether the next or the previous button is visible when
    // we are on the first page or last page, respectively.
  });
});
