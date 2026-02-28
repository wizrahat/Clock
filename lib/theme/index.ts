import { Theme, DefaultTheme, DarkTheme } from '@react-navigation/native';

import { COLORS } from './colors';

const NAV_THEME: { light: Theme; dark: Theme } = {
  light: {
    dark: false,
    colors: {
      background: COLORS?.light.card,
      border: COLORS?.light.border,
      card: COLORS?.light.background,
      notification: COLORS?.light.destructive,
      primary: COLORS?.light.primary,
      text: COLORS?.light.foreground,
    },
    fonts: DefaultTheme.fonts,
  },
  dark: {
    dark: true,
    colors: {
      background: COLORS?.dark.card,
      border: COLORS?.dark.border,
      card: COLORS?.dark.background,
      notification: COLORS?.dark.destructive,
      primary: COLORS?.dark.primary,
      text: COLORS?.dark.foreground,
    },
    fonts: DarkTheme.fonts,
  },
};

export { NAV_THEME };
