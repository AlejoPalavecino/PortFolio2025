/**
 * Central exports for theme system
 * Import theme-related functionality from this file
 */

// Context
export { ThemeProvider, ThemeContext } from './context/ThemeContext';

// Hooks
export { useTheme } from './hooks/useTheme';
export type { UseThemeReturn } from './hooks/useTheme';

// Types
export type {
  ThemeMode,
  ThemeContextType,
  ThemeConfig,
  RecruiterTheme,
  GeekTheme,
} from './types/theme';

export { THEME_STORAGE_KEY } from './types/theme';
