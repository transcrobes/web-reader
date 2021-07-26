import { extendTheme } from '@chakra-ui/react';
import getButtonStyle from './components/button';
import Text from './components/text';
import colors from './foundations/colors';
import nyplTheme from '../nypl-base-theme';
import { ColorMode } from '../../types';

/**
 * See Chakra default theme for shape of theme object:
 * https://github.com/chakra-ui/chakra-ui/tree/main/packages/theme
 */
const theme = (colorMode: ColorMode) => {
  const getColor = (light: string, dark: string, sepia: string) => {
    switch (colorMode) {
      case 'day':
        return light;
      case 'night':
        return dark;
      case 'sepia':
        return sepia;
    }
  };

  return extendTheme(
    {
      colors,
      /**
       * Chakra documentation on component styles:
       * https://chakra-ui.com/docs/theming/component-style
       */
      components: {
        Button: getButtonStyle(getColor),
        Text,
      },
    },
    nyplTheme
  );
};

export default theme;
