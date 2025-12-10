import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { ThemeMode, ThemeContextType } from '../types/theme';

const THEME_STORAGE_KEY = 'portfolio-theme-mode';

/**
 * Theme Context
 * Provides global theme state management for the entire application
 */
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  /** Initial theme mode (optional, defaults to 'recruiter' or localStorage value) */
  initialMode?: ThemeMode;
}

/**
 * ThemeProvider Component
 * Wraps the application to provide theme context to all children
 * Handles theme persistence via localStorage and DOM class manipulation
 * 
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialMode 
}) => {
  // Initialize theme from localStorage or use initial/default value
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (initialMode) return initialMode;
    
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'recruiter' || stored === 'geek') {
        return stored;
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
    }
    
    return 'recruiter'; // Default to recruiter mode
  });

  /**
   * Apply theme to DOM
   * Updates document classes and localStorage
   */
  const applyTheme = useCallback((newMode: ThemeMode) => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('theme-recruiter', 'theme-geek', 'dark');
    
    // Add new theme class
    root.classList.add(`theme-${newMode}`);
    
    // Add dark class for geek mode (Tailwind dark mode)
    if (newMode === 'geek') {
      root.classList.add('dark');
    }
    
    // Persist to localStorage
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, []);

  /**
   * Toggle between recruiter and geek modes
   */
  const toggleTheme = useCallback(() => {
    setMode((prevMode) => {
      const newMode: ThemeMode = prevMode === 'recruiter' ? 'geek' : 'recruiter';
      return newMode;
    });
  }, []);

  /**
   * Set a specific theme mode
   */
  const setTheme = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
  }, []);

  // Apply theme whenever mode changes
  useEffect(() => {
    applyTheme(mode);
  }, [mode, applyTheme]);

  // Apply initial theme on mount
  useEffect(() => {
    applyTheme(mode);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const contextValue: ThemeContextType = {
    mode,
    toggleTheme,
    setTheme,
    isRecruiterMode: mode === 'recruiter',
    isGeekMode: mode === 'geek',
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Display name for debugging
 */
ThemeProvider.displayName = 'ThemeProvider';
