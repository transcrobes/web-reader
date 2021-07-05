import D2Reader, { ReadingPosition, Locator } from '@d-i-t-a/reader';
import Navigator, { NavigatorArguments } from '../Navigator';
import EpubContent from './HtmlNavigatorContent';
import { WebpubManifest } from '../types';
import { fetchJson } from '../utils/fetch';
import { mutating } from '../decorators';

/**
 * This Navigator is meant to work with any HTML based webpub. So an ePub
 * or a Mobi, or even just html pages packaged into a collection.
 */
export default class HtmlNavigator extends Navigator {
  static Content = EpubContent;

  private readonly reader: D2Reader;

  private constructor(didMutate: () => void, reader: D2Reader) {
    super(didMutate);
    this.reader = reader;
  }

  static async init({
    webpubManifestUrl,
    didMutate,
  }: NavigatorArguments): Promise<HtmlNavigator> {
    const url = new URL(webpubManifestUrl);
    const reader = await D2Reader.build({
      url,
      injectables: injectables as any,
      injectablesFixed: [],
    });
    const navigator = new HtmlNavigator(didMutate, reader);
    return navigator;
  }

  get readingProgression(): ReadingPosition {
    return {
      created: new Date(),
      href: '/blah',
      locations: {},
    };
  }

  get currentLocation() {
    throw new Error('currentLocation Not implemented');
    return {
      href: 'blah',
      title: 'blah',
      locations: {},
    };
    // return D2Reader.currentLocator;
  }

  goTo = async (locator: Locator) => {
    try {
      await this.reader.goTo(locator);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
  goForward = async () => {
    try {
      await this.reader.nextPage();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
  goBackward = async () => {
    try {
      await this.reader.previousPage();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
  async goLeft() {
    return this.goBackward();
  }
  async goRight() {
    return this.goForward();
  }

  // settings
  @mutating
  scroll() {
    this.reader.scroll(true);
  }
  @mutating
  paginate() {
    this.reader.scroll(false);
  }
  get isScrolling() {
    return this.reader.currentSettings.verticalScroll;
  }
  toggleScroll = () => {
    console.warn('toggle scroll not implemented');
    return;
  };

  static async fetchManifest(url: string): Promise<WebpubManifest> {
    const manifest: WebpubManifest = await fetchJson(url);
    return manifest;
  }
}

const injectables = [
  {
    type: 'style',
    url: 'http://localhost:1234/viewer/readium-css/ReadiumCSS-before.css',
    r2before: true,
  },
  {
    type: 'style',
    url: 'http://localhost:1234/viewer/readium-css/ReadiumCSS-default.css',
    r2default: true,
  },
  {
    type: 'style',
    url: 'http://localhost:1234/viewer/readium-css/ReadiumCSS-after.css',
    r2after: true,
  },
];
