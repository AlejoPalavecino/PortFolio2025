import React, { createContext, useEffect, useState, useCallback } from 'react';
import type { ThemeMode, ThemeContextValue, ThemeProviderProps } from '../types/theme';

/**
 * Clave para persistir el tema en localStorage
 */
const THEME_STORAGE_KEY = 'portfolio-theme-mode';

/**
 * Valor por defecto del tema
 */
const DEFAULT_THEME: ThemeMode = 'recruiter';

/**
 * Context para el manejo del tema de la aplicación
 * Soporta dos modos: 'recruiter' (claro/profesional) y 'geek' (oscuro/técnico)
 */
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Provider del contexto de tema
 * 
 * Características:
 * - Persiste el tema seleccionado en localStorage
 * - Aplica la clase 'dark' al elemento HTML root cuando está en modo 'geek'
 * - Proporciona funciones para cambiar entre temas
 * - Incluye helpers booleanos para verificar el modo actual
 * 
 * @example
 * ```tsx
 * <ThemeProvider defaultMode="recruiter">
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultMode = DEFAULT_THEME 
}) => {
  // Estado del tema con inicialización desde localStorage
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme === 'recruiter' || storedTheme === 'geek') {
        return storedTheme;
      }
    } catch (error) {
      console.warn('Error al leer el tema desde localStorage:', error);
    }
    return defaultMode;
  });

  /**
   * Aplica la clase 'dark' al elemento root del HTML
   * para que Tailwind pueda aplicar los estilos del modo oscuro
   */
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (mode === 'geek') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Guardar en localStorage
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Error al guardar el tema en localStorage:', error);
    }
  }, [mode]);

  /**
   * Alterna entre los dos modos disponibles
   */
  const toggleTheme = useCallback(() => {
    setMode(prevMode => prevMode === 'recruiter' ? 'geek' : 'recruiter');
  }, []);

  /**
   * Establece un tema específico
   */
  const setTheme = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
  }, []);

  // Valores computados para facilitar el uso
  const isRecruiterMode = mode === 'recruiter';
  const isGeekMode = mode === 'geek';

  const value: ThemeContextValue = {
    mode,
    toggleTheme,
    setTheme,
    isRecruiterMode,
    isGeekMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.displayName = 'ThemeProvider';
