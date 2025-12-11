import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import type { ThemeContextValue } from '../types/theme';

/**
 * Hook personalizado para consumir el ThemeContext
 * 
 * Proporciona acceso al estado del tema y sus funciones de control
 * de manera segura con validación de contexto
 * 
 * @throws {Error} Si se usa fuera del ThemeProvider
 * 
 * @returns {ThemeContextValue} Objeto con:
 *   - mode: Modo actual del tema ('recruiter' | 'geek')
 *   - toggleTheme: Función para alternar entre modos
 *   - setTheme: Función para establecer un modo específico
 *   - isRecruiterMode: Boolean que indica si está en modo recruiter
 *   - isGeekMode: Boolean que indica si está en modo geek
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { mode, toggleTheme, isGeekMode } = useTheme();
 * 
 *   return (
 *     <div className={isGeekMode ? 'dark-style' : 'light-style'}>
 *       <p>Modo actual: {mode}</p>
 *       <button onClick={toggleTheme}>
 *         Cambiar a {isGeekMode ? 'Recruiter' : 'Geek'} Mode
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(
      'useTheme debe ser usado dentro de un ThemeProvider. ' +
      'Asegúrate de envolver tu componente con <ThemeProvider>.'
    );
  }

  return context;
}
