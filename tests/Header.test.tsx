import * as React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../src/ui/Header';
import { Navigator, ReaderState, WebpubManifest } from '../src/types';

test('render header bar', () => {
  const manifest = {} as WebpubManifest;
  const readerState = {} as ReaderState;
  const navigator = {} as Navigator;

  render(
    <Header
      manifest={manifest}
      readerState={readerState}
      navigator={navigator}
    />
  );

  //  Should also test the href once everthings been implemented in the furture
  expect(
    screen.getByRole('link', { name: 'Return to Digital Research Books' })
  ).toBeInTheDocument();

  expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();

  expect(
    screen.getByRole('button', { name: 'Toggle Fullscreen' })
  ).toBeInTheDocument();
});
