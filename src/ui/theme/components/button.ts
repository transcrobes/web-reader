const getButtonStyle = (getColor: GetColor) => ({
  // style object for base or default style
  baseStyle: {
    borderRadius: 'none',
  },
  // styles for different sizes ("sm", "md", "lg")
  sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {
    solid: variantSolid(getColor),
    toggle: variantToggle,
    headerNav: variantHeaderNav,
  },
  // default values for `size`, `variant`, `colorScheme`
  defaultProps: {
    size: 'sm',
    variant: 'solid',
  },
});

const commonToggleButtonStyle = {
  color: 'ui.black',
  px: 8,
  border: '1px solid',
  borderColor: 'gray.100',
  transition: 'none',
  fontSize: '-2',
  fontWeight: 'medium',
  letterSpacing: '0.07rem',
  textTransform: 'uppercase',
  maxWidth: '100%',
  cursor: 'pointer',
  _active: {
    bg: 'ui.white',
  },
  _hover: {
    bg: 'ui.white',
    _disabled: {
      bg: 'ui.white',
    },
  },
  _disabled: {
    bg: 'ui.white',
  },
};

type GetColor = (light: string, dark: string, sepia: string) => string;
/* Color Schemes:
 ** Light, Sepia, Dark
 * States:
 ** Normal
 ** Selected
 ** Disabled
 ** Hovered
 */
const variantSolid = (getColor: GetColor) => (props: any) => {
  const { colorScheme } = props;

  return {
    ...commonToggleButtonStyle,
    bg: getColor('white', 'gray.500', 'sepia'),
    color: getColor('black', 'white', 'gray.500'),
  };
};

function variantToggle(props: any) {
  return {
    ...variantSolid(props),
    _checked: {
      color: 'ui.white',
      bg: 'green.700',
    },
  };
}

function variantHeaderNav() {
  return {
    py: 1,
    border: 'none',
    bg: 'transparent',
    textTransform: 'uppercase',
    fontSize: 0,
    color: 'gray.700',
  };
}

export default getButtonStyle;
