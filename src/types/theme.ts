/**
 * Theme Types for Next-Gen Interactive Portfolio
 * Defines the core types for theme management system
 */

/**
 * Theme modes available in the application
 * - 'recruiter': Professional, clean interface for recruiters
 * - 'geek': Dark, immersive experience with neon accents
 */
export type ThemeMode = 'recruiter' | 'geek';

/**
 * Theme context interface
 * Manages the global theme state and provides methods to interact with it
 */
export interface ThemeContextType {
  /** Current active theme mode */
  mode: ThemeMode;
  
  /** Toggle between recruiter and geek modes */
  toggleTheme: () => void;
  
  /** Set a specific theme mode */
  setTheme: (mode: ThemeMode) => void;
  
  /** Check if current mode is recruiter */
  isRecruiterMode: boolean;
  
  /** Check if current mode is geek */
  isGeekMode: boolean;
}

/**
 * Theme configuration object
 * Defines color schemes and styling for each mode
 */
export interface ThemeConfig {
  recruiter: RecruiterTheme;
  geek: GeekTheme;
}

/**
 * Recruiter theme configuration
 * Professional and clean color scheme
 */
export interface RecruiterTheme {
  background: string;
  text: string;
  accent: string;
  accentHover: string;
  accentLight: string;
  secondary: string;
  border: string;
}

/**
 * Geek theme configuration
 * Dark mode with neon accents and glow effects
 */
export interface GeekTheme {
  background: string;
  backgroundCard: string;
  backgroundElevated: string;
  text: string;
  textSecondary: string;
  cyan: string;
  cyanHover: string;
  cyanGlow: string;
  purple: string;
  purpleHover: string;
  purpleGlow: string;
  border: string;
}

/**
 * Local storage key for theme persistence
 */
export const THEME_STORAGE_KEY = 'portfolio-theme-mode' as const;
