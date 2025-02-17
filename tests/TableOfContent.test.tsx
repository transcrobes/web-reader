import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TableOfContent from '../src/ui/TableOfContent';
import {
  MockNavigator,
  MockWebpubManifest,
  MockReaderState,
} from './utils/MockData';

beforeEach(() => {
  render(
    <TableOfContent
      readerState={MockReaderState}
      navigator={MockNavigator}
      manifest={MockWebpubManifest}
    />
  );
});

test('render Table Of Content', () => {
  // The initial TOC component render should not show TOC popover on the screen.
  expect(screen.queryByText('Chapter 1')).toBeNull();

  // We need to open the TOC element for TOC links to show up
  const toggleBtn = screen.getByRole('button', { name: 'Table of Contents' });
  fireEvent.click(toggleBtn);

  const tocLinkElm = screen.getByRole('menuitem', { name: 'Chapter 1' });
  expect(tocLinkElm).toBeInTheDocument();
});

test('navigation should be called with the correct url', () => {
  const toggleBtn = screen.getByRole('button', { name: 'Table of Contents' });
  fireEvent.click(toggleBtn);

  const chapterOneElm = screen.getByRole('menuitem', { name: 'Chapter 1' });
  fireEvent.click(chapterOneElm);
  expect(MockNavigator.goToPage).toHaveBeenCalledWith('chapter/one/url');
});

test('navigation should call chapter and subchapters separately if both are provided', () => {
  const toggleBtn = screen.getByRole('button', { name: 'Table of Contents' });
  fireEvent.click(toggleBtn);

  const chapterThreeElm = screen.getByRole('menuitem', { name: 'Chapter 3' });
  fireEvent.click(chapterThreeElm);
  expect(MockNavigator.goToPage).toHaveBeenCalledWith('chapter/three/url');

  fireEvent.click(toggleBtn);

  const chapterThreeOneElm = screen.getByRole('menuitem', {
    name: 'Chapter 3 part 1',
  });
  fireEvent.click(chapterThreeOneElm);
  expect(MockNavigator.goToPage).toHaveBeenCalledWith('chapter/three_one/url');
});

test('navigation should use first subchapter as chapter link if nothing is provided', () => {
  const toggleBtn = screen.getByRole('button', { name: 'Table of Contents' });
  fireEvent.click(toggleBtn);

  const chapterFourElm = screen.getByRole('menuitem', {
    name: 'Chapter 4',
  });
  fireEvent.click(chapterFourElm);
  expect(MockNavigator.goToPage).toHaveBeenCalledWith('chapter/four/one/url');

  fireEvent.click(toggleBtn);

  const chapterFourOneElm = screen.getByRole('menuitem', {
    name: 'Chapter 4 part 1',
  });
  fireEvent.click(chapterFourOneElm);
  expect(MockNavigator.goToPage).toHaveBeenCalledWith('chapter/four/one/url');
});

//Documentation of not-yet-implemented functionality
test('navigation does not show recursive child links', () => {
  const toggleBtn = screen.getByRole('button', { name: 'Table of Contents' });
  fireEvent.click(toggleBtn);

  const chapterFourElm = screen.getByRole('menuitem', {
    name: 'Chapter 4 part 2',
  });
  fireEvent.click(chapterFourElm);
  expect(MockNavigator.goToPage).toHaveBeenCalledWith('chapter/four/two/url');

  fireEvent.click(toggleBtn);

  const chapterFourThreeElm = screen.getByRole('menuitem', {
    name: 'Chapter 4 part 3',
  });
  fireEvent.click(chapterFourThreeElm);
  expect(MockNavigator.goToPage).toHaveBeenCalledWith(
    'chapter/four/three/one/url'
  );

  expect(screen.queryByText('Chapter 4 part 2.1')).toBeNull();
  expect(screen.queryByText('Chapter 4 part 3.1')).toBeNull();
});
