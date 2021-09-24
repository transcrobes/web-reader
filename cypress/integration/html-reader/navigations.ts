import {
  IFRAME_SELECTOR,
  MOBY_EPUB2_MANIFEST_REQUEST,
  MOBY_EPUB2_PATH,
} from '../../support/constants';

describe('navigating an EPUB page', () => {
  const COVER_SRC =
    'http://localhost:1234/samples/moby-epub2-exploded/OEBPS/wrap0000.html';
  const CHAPTER_2_SRC =
    'http://localhost:1234/samples/moby-epub2-exploded/OEBPS/@public@vhost@g@gutenberg@html@files@2701@2701-h@2701-h-1.htm.html';

  beforeEach(() => {
    // this disables browser cache so we can intercept requests.
    cy.on('window:before:load', (win) => {
      const original = win.fetch;
      win.fetch = (input, init) =>
        original(input, { ...init, cache: 'no-store' });
    });

    cy.intercept('GET', MOBY_EPUB2_MANIFEST_REQUEST).as('manifest');
    cy.intercept('GET', COVER_SRC).as('cover');
    cy.intercept('GET', CHAPTER_2_SRC).as('chapter2');

    cy.loadPage(MOBY_EPUB2_PATH);
    cy.wait('@manifest');
    cy.wait('@cover');
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

    // Open chapter 2
    cy.findByRole('menuitem', { name: chapter2Name }).click();

    cy.log('briefly see the loading indicator');
    cy.get('#reader-loading').should('be.visible');

    // it starts to fail intermittently when I wait on chapter to,
    // saying "Uncaught required element html not found in iframe".
    // appears to be an r2d2bc error
    cy.wait('@chapter2');

    cy.get('#reader-loading').should('not.be.visible');

    cy.iframe(IFRAME_SELECTOR)
      .findByRole('heading', { name: 'CHAPTER 2. The Carpet-Bag.' })
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
