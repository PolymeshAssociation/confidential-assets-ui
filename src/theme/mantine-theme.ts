import {
  createTheme,
  defaultVariantColorsResolver,
  parseThemeColor,
  rem,
  rgba,
  Tabs,
  type MantineColorsTuple,
  type VariantColorsResolver,
} from '@mantine/core';
import classes from './component-overrides.module.css';

// Polymesh brand colors with proper light/dark mode distribution
const polymeshViolet: MantineColorsTuple = [
  '#f6effb',
  '#e9dbf1',
  '#d2b3e4',
  '#bb88d7',
  '#a764cd',
  '#9b4ec6',
  '#9542c4',
  '#8135ad',
  '#732e9b',
  '#43195b',
  //   '#F5EDFA', // 0 - lightest
  //   '#E8D9F2', // 1
  //   '#D1B3E5', // 2
  //   '#B88DD8', // 3
  //   '#9F67CB', // 4
  //   '#8653B1', // 5
  //   '#6E3F97', // 6 - light mode primary
  //   '#43195B', // 7 - Polymesh brand / dark mode primary
  //   '#2E1140', // 8
  //   '#1A0825', // 9 - darkest
];

const polymeshPink: MantineColorsTuple = [
  '#ffe9f1',
  '#ffd2df',
  '#f8a4bb',
  '#f27295',
  '#ec4673',
  '#e92d60',
  '#e91d56',
  '#d00e47',
  '#ba033e',
  '#a40034',
  //   '#FEF5F9', // 0 - lightest
  //   '#FCEAF2', // 1
  //   '#FAD5E5', // 2
  //   '#F7B0CD', // 3
  //   '#F48BB5', // 4
  //   '#F16F9D', // 5
  //   '#ED5585', // 6 - light mode primary
  //   '#EC4673', // 7 - Polymesh brand / dark mode primary
  //   '#C91C56', // 8
  //   '#9B1543', // 9 - darkest
];

// Custom variant color resolver for better color handling
const variantColorResolver: VariantColorsResolver = (input) => {
  const defaultResolvedColors = defaultVariantColorsResolver(input);
  const parsedColor = parseThemeColor({
    color: input.color || input.theme.primaryColor,
    theme: input.theme,
  });

  // Customize light variant to be slightly more prominent
  if (input.variant === 'light') {
    return {
      ...defaultResolvedColors,
      background: rgba(parsedColor.value, 0.12),
      hover: rgba(parsedColor.value, 0.18),
    };
  }

  // Customize subtle variant for better visibility
  if (input.variant === 'subtle') {
    return {
      ...defaultResolvedColors,
      background: 'transparent',
      hover: rgba(parsedColor.value, 0.08),
    };
  }

  return defaultResolvedColors;
};

export const polymeshTheme = createTheme({
  /** Brand colors */
  primaryColor: 'polyPink',
  colors: {
    polyViolet: polymeshViolet,
    polyPink: polymeshPink,
  },

  /** Color shades for light and dark modes */
  primaryShade: {
    light: 5, // Slightly darker for better light mode contrast
    dark: 5, // Brand color for dark mode
  },

  /** Typography */
  fontFamily:
    'Manrope, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif',
  fontFamilyMonospace:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',

  headings: {
    fontFamily:
      'Manrope, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif',
    fontWeight: '700',
    textWrap: 'pretty', // Better text wrapping for headings
    sizes: {
      h1: { fontSize: rem(36), lineHeight: '1.2', fontWeight: '800' },
      h2: { fontSize: rem(30), lineHeight: '1.3', fontWeight: '700' },
      h3: { fontSize: rem(24), lineHeight: '1.4', fontWeight: '700' },
      h4: { fontSize: rem(20), lineHeight: '1.5', fontWeight: '600' },
      h5: { fontSize: rem(18), lineHeight: '1.5', fontWeight: '600' },
      h6: { fontSize: rem(16), lineHeight: '1.5', fontWeight: '600' },
    },
  },

  /** Spacing and sizing */
  defaultRadius: 'md', // Consistent border radius across components

  /** Gradient for special components */
  defaultGradient: {
    from: 'polyPink.6',
    to: 'polyViolet.6',
    deg: 135,
  },

  /** Interaction */
  cursorType: 'pointer', // Pointer cursor for interactive elements
  respectReducedMotion: true, // Respect user's motion preferences
  focusRing: 'auto', // Show focus ring only with keyboard navigation

  /** Custom variant resolver for better color handling */
  variantColorResolver,

  /** Focus and active states */
  activeClassName: '', // Use default active styles
  focusClassName: '', // Use default focus styles

  /** Component-specific customizations */
  components: {
    Tabs: Tabs.extend({
      classNames: {
        tab: classes.tab,
      },
    }),
  },

  /** Custom properties for app-specific values */
  other: {
    // Polymesh-specific spacing
    headerHeight: 64,
    sidebarWidth: 260,

    // Asset-specific colors (can reference in components)
    assetColors: {
      confidential: 'polyViolet.6',
      public: 'blue.6',
      pending: 'yellow.6',
      failed: 'red.6',
    },

    // Transaction status colors
    transactionColors: {
      success: 'green.6',
      pending: 'orange.6',
      failed: 'red.6',
    },
  },
});

// Type augmentation for better TypeScript support
declare module '@mantine/core' {
  export interface MantineThemeOther {
    headerHeight: number;
    sidebarWidth: number;
    assetColors: {
      confidential: string;
      public: string;
      pending: string;
      failed: string;
    };
    transactionColors: {
      success: string;
      pending: string;
      failed: string;
    };
  }
}
