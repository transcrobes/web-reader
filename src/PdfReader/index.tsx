import { Document, Outline, Page } from 'react-pdf/dist/esm/entry.parcel';

import React, { useMemo, useState } from 'react';
import {
  ColorMode,
  ReaderArguments,
  ReaderReturn,
  ReaderState,
  WebpubManifest,
} from '../types';

type PdfState = ReaderState & {
  type: 'PDF';
  loadSuccess: boolean;
  resourceIndex: number;
  data: { data: Uint8Array } | null;
  numPages: number;
  pageNumber: number;
};

type PdfReaderAction =
  | { type: 'LOAD_SUCCESS'; success: boolean }
  | { type: 'SET_RESOURCEINDEX'; index: number }
  | { type: 'SET_DATA'; data: { data: Uint8Array } | null }
  | { type: 'SET_COLOR_MODE'; mode: ColorMode }
  | { type: 'SET_SCROLL'; isScrolling: boolean }
  | { type: 'SET_NUMPAGES'; numPages: number }
  | { type: 'SET_PAGENUM'; pageNum: number };

function pdfReducer(state: PdfState, action: PdfReaderAction): PdfState {
  switch (action.type) {
    case 'LOAD_SUCCESS': {
      return {
        ...state,
        loadSuccess: action.success,
      };
    }

    case 'SET_RESOURCEINDEX':
      return {
        ...state,
        resourceIndex: action.index,
      };

    case 'SET_DATA':
      return {
        ...state,
        data: action.data,
      };

    case 'SET_COLOR_MODE':
      return {
        ...state,
        colorMode: action.mode,
      };

    case 'SET_SCROLL':
      return {
        ...state,
        isScrolling: action.isScrolling,
      };

    case 'SET_NUMPAGES':
      return {
        ...state,
        numPages: action.numPages,
      };

    case 'SET_PAGENUM':
      return {
        ...state,
        pageNumber: action.pageNum,
      };
  }
}
async function fetchPdf<ExpectedResponse extends any = any>(url: string) {
  console.log('fetchPdf called', url);
  const response = await fetch(url, { mode: 'cors' });
  const array = new Uint8Array(await response.arrayBuffer());

  if (!response.ok) {
    throw new Error('Response not Ok for URL: ' + url);
  }
  return array as ExpectedResponse;
}

export default function usePdfReader(args: ReaderArguments): ReaderReturn {
  const { webpubManifestUrl, manifest, proxyUrl = '' } = args ?? {};

  const [state, dispatch] = React.useReducer(pdfReducer, {
    type: 'PDF',
    loadSuccess: false,
    colorMode: 'day',
    isScrolling: false,
    fontSize: 16,
    fontFamily: 'sans-serif',
    resourceIndex: 0,
    data: null,
    pageNumber: 1,
    numPages: 0,
  });

  const loadResource = async (
    manifest: WebpubManifest,
    resourceIndex: number,
    proxyUrl?: string
  ) => {
    // Fetch the resource, then set data in state

    // Generate the resource URL using the proxy
    const resource: string =
      proxyUrl + encodeURI(manifest.readingOrder![resourceIndex].href);

    return await fetchPdf(resource);
  };

  // initialize the pdf reader
  React.useEffect(() => {
    async function setPdfResource(manifest: WebpubManifest, proxyUrl: string) {
      const data = await loadResource(manifest, 0, proxyUrl);
      dispatch({ type: 'SET_DATA', data: { data } });
      dispatch({ type: 'SET_RESOURCEINDEX', index: 0 });
    }
    // bail out if there is not manifest passed in,
    // that indicates that this format is inactive
    if (!manifest) return;
    // throw an error on a badly formed manifest
    if (!manifest.readingOrder || !manifest.readingOrder.length) {
      throw new Error('Manifest has no Reading Order');
    }
    setPdfResource(manifest, proxyUrl);
  }, [proxyUrl, manifest]);

  /**
   * Here you add the functionality, either directly working with the iframe
   * or through PDF.js. You should update the internal state. In the PDF case,
   * you will probably want to store which resource you are currently on and
   * update that on goForward or goBackward
   */
  const goForward = React.useCallback(async () => {
    if (state.pageNumber < state.numPages) {
      const pageNum = state.pageNumber + 1;
      dispatch({ type: 'SET_PAGENUM', pageNum });
    } else {
      dispatch({ type: 'SET_DATA', data: null });

      const data = await loadResource(
        manifest!,
        state.resourceIndex + 1,
        proxyUrl
      );
      dispatch({ type: 'SET_DATA', data: { data } });
      dispatch({ type: 'SET_RESOURCEINDEX', index: state.resourceIndex + 1 });
    }
  }, [
    manifest,
    proxyUrl,
    state.numPages,
    state.pageNumber,
    state.resourceIndex,
  ]);

  const goBackward = React.useCallback(async () => {
    if (state.pageNumber > 1) {
      const pageNum = state.pageNumber - 1;
      dispatch({ type: 'SET_PAGENUM', pageNum });
    } else {
      dispatch({ type: 'SET_DATA', data: null });

      dispatch({ type: 'SET_PAGENUM', pageNum: 1 });

      const data = await loadResource(
        manifest!,
        state.resourceIndex - 1,
        proxyUrl
      );
      dispatch({ type: 'SET_DATA', data: { data } });
      dispatch({ type: 'SET_RESOURCEINDEX', index: state.resourceIndex - 1 });
    }
  }, [manifest, proxyUrl, state.pageNumber, state.resourceIndex]);

  /**
   * These ones don't make sense in the PDF case I dont think. I'm still
   * deciding how we will separate the types of Navigators and States, so
   * for now just pass dummies through.
   */
  const setColorMode = React.useCallback(async () => {
    console.log('unimplemented');
  }, []);

  const setScroll = React.useCallback(
    async (val: 'scrolling' | 'paginated') => {
      const isScrolling = val === 'scrolling';
      dispatch({ type: 'SET_SCROLL', isScrolling });
    },
    []
  );

  // this format is inactive, return null
  if (!webpubManifestUrl || !manifest) return null;

  // we are initializing the reader
  if (!state.data) {
    return {
      isLoading: true,
      content: <>PDF is loading</>,
      manifest: null,
      navigator: null,
      state: null,
    };
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    console.log('success');
    dispatch({ type: 'LOAD_SUCCESS', success: true });
    dispatch({ type: 'SET_NUMPAGES', numPages: numPages });
  }

  // the reader is active
  return {
    isLoading: false,
    content: (
      <Document file={state.data} onLoadSuccess={onDocumentLoadSuccess}>
        {state.isScrolling &&
          Array.from(new Array(state.numPages), (index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        {!state.isScrolling && <Page pageNumber={state.pageNumber} />}
      </Document>
    ),
    state,
    manifest,
    navigator: {
      goForward,
      goBackward,
      setColorMode,
      setScroll,
    },
  };
}
