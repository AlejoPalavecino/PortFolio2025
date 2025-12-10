import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import type { ThemeContextType } from '../types/theme';

/**
 * Custom hook to access theme context
 * 
 * Provides access to the current theme mode and methods to manipulate it.
 * Must be used within a ThemeProvider component.
 * 
 * @throws {Error} If used outside of ThemeProvider
 * 
 * @returns {ThemeContextType} Theme context containing:
 * - mode: Current theme mode ('recruiter' | 'geek')
 * - toggleTheme: Function to toggle between modes
 * - setTheme: Function to set a specific mode
 * - isRecruiterMode: Boolean indicating if recruiter mode is active
 * - isGeekMode: Boolean indicating if geek mode is active
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { mode, toggleTheme, isGeekMode } = useTheme();
 *   
 *   return (
 *     <div>
 *       <p>Current mode: {mode}</p>
 *       <button onClick={toggleTheme}>
 *         Switch to {isGeekMode ? 'Recruiter' : 'Geek'} Mode
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * function ThemeButton() {
 *   const { setTheme, isRecruiterMode } = useTheme();
 *   
 *   return (
 *     <button 
 *       onClick={() => setTheme('geek')}
 *       className={isRecruiterMode ? 'bg-recruiter-accent' : 'bg-geek-cyan'}
 *     >
 *       Activate Geek Mode
 *     </button>
 *   );
 * }
 * ```
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error(
      'useTheme must be used within a ThemeProvider. ' +
      'Please wrap your component tree with <ThemeProvider>.'
    );
  }
  
  return context;
};

/**
 * Type export for consumers who need the return type
 */
export type UseThemeReturn = ThemeContextType;
