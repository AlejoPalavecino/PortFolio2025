/**
 * Tipos para el sistema de temas del portfolio
 */

export type ThemeMode = 'recruiter' | 'geek';

export interface ThemeContextValue {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  isRecruiterMode: boolean;
  isGeekMode: boolean;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}
