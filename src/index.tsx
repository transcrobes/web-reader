import React, { FC } from 'react';
import { ReaderManagerArguments, UseWebReaderArguments } from './types';
import ErrorBoundary from './ui/ErrorBoundary';
import ManagerUI from './ui/manager';
import useWebReader from './useWebReader';

/**
 * The main React component export.
 */

export type WebReaderProps = UseWebReaderArguments & ReaderManagerArguments;

export const WebReaderWithoutBoundary: FC<WebReaderProps> = ({
  webpubManifestUrl,
  proxyUrl,
  getContent,
  headerLeft,
  ...props
}) => {
  const webReader = useWebReader({
    webpubManifestUrl,
    proxyUrl,
    getContent,
    ...props,
  });
  const { content } = webReader;

  return (
    <ManagerUI headerLeft={headerLeft} {...webReader}>
      {content}
    </ManagerUI>
  );
};

const WebReader: FC<WebReaderProps> = (props) => {
  return (
    <ErrorBoundary {...props}>
      <WebReaderWithoutBoundary {...props} />
    </ErrorBoundary>
  );
};

export default WebReader;

export { usePublicationSW, initWebReaderSW } from './ServiceWorker/index';
export { default as useWebReader } from './useWebReader';
export { default as useHtmlReader } from './HtmlReader';
export { default as usePdfReader } from './PdfReader';
export { getTheme } from './ui/theme';
export * from './constants';

export { WebpubManifest } from './types';
export { ReadiumLink } from './WebpubManifestTypes/ReadiumLink';
export {
  CACHE_EXPIRATION_SECONDS,
  PRECACHE_PUBLICATIONS,
  WEBPUB_CACHE_NAME,
} from './ServiceWorker/constants';
export { PublicationConfig, WebReaderSWConfig } from './ServiceWorker/types';
