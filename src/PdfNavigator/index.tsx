import React, { createRef, RefObject } from 'react';
import { mutating } from '../decorators';
import Navigator, { NavigatorArguments } from '../Navigator';
import ReactDOM from 'react-dom';
import PdfContent from './PdfNavigatorContent';
import { Document, Page, pdfjs } from 'react-pdf';
import { fetchPdf } from '../utils/fetch';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
/**
 *
 */

export default class PDFNavigator extends Navigator {
  static Content = PdfContent;
  static canvasRef: RefObject<HTMLCanvasElement> = createRef<HTMLCanvasElement>();

  private constructor(didMutate: () => void) {
    super(didMutate);
  }

  static async init({
    webpubManifestUrl,
    didMutate,
  }: NavigatorArguments): Promise<PDFNavigator> {
    const url = new URL(webpubManifestUrl);

    console.log('url', url);
    // Get PDF URL

    const docUrl = new URL('https://muse.jhu.edu/chapter/594364/pdf');
    const localUrl = new URL('http://localhost:1234/samples/degruytertest.pdf');

    // const pdf = await fetchPdf(docUrl.href);
    // console.log('pdf', pdf);

    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const container = document.getElementById('main');
    ReactDOM.render(this.renderPage(1, blob), container);

    return new PDFNavigator(didMutate);
  }
  static onDocumentLoadSuccess() {
    console.log('success');
  }

  static renderPage(pageNum: number, pdfRef: any) {
    return (
      // <iframe src={pdfRef.href} title="reader"></iframe>
      <div>
        <Document file={pdfRef} onLoadSuccess={this.onDocumentLoadSuccess}>
          <Page pageNumber={pageNum} />
        </Document>
      </div>
    );
  }

  get currentLocation() {
    console.log('currentLocation Not implemented');
    return {
      href: 'blah',
      title: 'blah',
      locations: {},
    };
  }

  async goTo() {
    return false;
  }
  async goForward() {
    return false;
  }
  async goBackward() {
    return false;
  }
  async goLeft() {
    return this.goBackward();
  }
  async goRight() {
    return this.goForward();
  }

  @mutating
  scroll() {}

  @mutating
  paginate() {}
  get isScroll() {
    return false;
  }
  get isScrolling() {
    return false;
  }
  toggleScroll() {
    console.warn('toggle scroll not implemented');
    return;
  }
}
