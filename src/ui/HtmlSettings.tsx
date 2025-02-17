import * as React from 'react';
import { ButtonGroup } from '@chakra-ui/react';
import { HtmlNavigator, HtmlReaderState } from '../types';
import Button from './Button';
import ToggleButton from './ToggleButton';
import ToggleGroup from './ToggleGroup';

export type HtmlSettingsProps = {
  navigator: HtmlNavigator;
  readerState: HtmlReaderState;
  paginationValue: string;
};

export default function HtmlSettings(
  props: HtmlSettingsProps
): React.ReactElement {
  const { navigator, readerState, paginationValue } = props;
  const { fontFamily, colorMode } = readerState;
  const {
    setFontFamily,
    decreaseFontSize,
    increaseFontSize,
    setColorMode,
    setScroll,
  } = navigator;

  return (
    <>
      <ToggleGroup
        value={fontFamily}
        label="text font options"
        onChange={setFontFamily}
      >
        <ToggleButton value="publisher" label="Publisher">
          Publisher
        </ToggleButton>
        <ToggleButton value="serif" label="Serif">
          Serif
        </ToggleButton>
        <ToggleButton value="sans-serif" label="Sans-Serif">
          Sans-Serif
        </ToggleButton>
        <ToggleButton value="open-dyslexic" label="Dyslexia-Friendly">
          Dyslexia-Friendly
        </ToggleButton>
      </ToggleGroup>
      <ButtonGroup d="flex" spacing={0}>
        <Button
          flexGrow={1}
          aria-label="Decrease font size"
          onClick={decreaseFontSize}
          variant="toggle"
        >
          A-
        </Button>
        <Button
          flexGrow={1}
          aria-label="Increase font size"
          onClick={increaseFontSize}
          variant="toggle"
        >
          A+
        </Button>
      </ButtonGroup>
      <ToggleGroup
        value={colorMode}
        label="reading theme options"
        onChange={setColorMode}
      >
        <ToggleButton
          colorMode="day"
          value="day"
          label="Day"
          _checked={{ bg: 'ui.white' }} // default _checked color is green for toggles
        >
          Day
        </ToggleButton>
        <ToggleButton
          colorMode="sepia"
          value="sepia"
          label="Sepia"
          bg="ui.sepia" // distinct case where default needs to be sepia
          _active={{ bg: 'ui.sepia' }}
          _hover={{ bg: 'ui.sepia' }}
          _checked={{ bg: 'ui.sepia' }}
        >
          Sepia
        </ToggleButton>
        <ToggleButton
          colorMode="night"
          value="night"
          label="Night"
          _checked={{ bg: 'ui.black' }}
        >
          Night
        </ToggleButton>
      </ToggleGroup>
      <ToggleGroup
        onChange={setScroll}
        value={paginationValue}
        label="pagination options"
      >
        <ToggleButton value="paginated" label="Paginated">
          Paginated
        </ToggleButton>
        <ToggleButton value="scrolling" label="Scrolling">
          Scrolling
        </ToggleButton>
      </ToggleGroup>
    </>
  );
}
