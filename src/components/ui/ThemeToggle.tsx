import React from 'react';
import { useTheme } from '../../hooks/useTheme';

/**
 * ThemeToggle Component
 * A toggle switch to change between Recruiter and Geek modes
 * 
 * Features:
 * - Smooth transition animations
 * - Visual feedback for current mode
 * - Accessible keyboard navigation
 * - Responsive design
 */
export const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme, isGeekMode } = useTheme();

  return (
    <div className="flex items-center gap-3">
      {/* Label */}
      <span className={`
        text-sm font-medium transition-colors duration-300
        ${isGeekMode ? 'text-geek-text-secondary' : 'text-recruiter-secondary'}
      `}>
        {isGeekMode ? 'Geek' : 'Recruiter'}
      </span>

      {/* Toggle Button */}
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${isGeekMode ? 'Recruiter' : 'Geek'} mode`}
        className={`
          relative inline-flex h-8 w-16 items-center rounded-full
          transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${isGeekMode 
            ? 'bg-geek-purple focus:ring-geek-purple' 
            : 'bg-recruiter-accent focus:ring-recruiter-accent'
          }
        `}
      >
        {/* Slider */}
        <span
          className={`
            inline-block h-6 w-6 transform rounded-full
            bg-white shadow-lg transition-transform duration-300 ease-in-out
            ${isGeekMode ? 'translate-x-9' : 'translate-x-1'}
          `}
        >
          {/* Icon inside slider */}
          <span className="flex h-full w-full items-center justify-center text-xs">
            {isGeekMode ? '🚀' : '💼'}
          </span>
        </span>
      </button>

      {/* Mode Label */}
      <span className={`
        text-xs font-semibold uppercase tracking-wide transition-colors duration-300
        ${isGeekMode 
          ? 'text-transparent bg-clip-text bg-geek-gradient' 
          : 'text-recruiter-accent'
        }
      `}>
        {mode} Mode
      </span>
    </div>
  );
};

/**
 * Alternative Card-style Theme Toggle
 * A more prominent theme switcher with visual preview
 */
export const ThemeToggleCard: React.FC = () => {
  const { setTheme, isGeekMode } = useTheme();

  return (
    <div className="flex gap-4">
      {/* Recruiter Mode Card */}
      <button
        onClick={() => setTheme('recruiter')}
        className={`
          flex-1 p-6 rounded-lg border-2 transition-all duration-300
          ${!isGeekMode
            ? 'border-recruiter-accent bg-recruiter-accent/10 shadow-lg scale-105'
            : 'border-recruiter-border bg-white hover:border-recruiter-accent/50'
          }
        `}
        aria-pressed={!isGeekMode}
      >
        <div className="text-4xl mb-2">💼</div>
        <h3 className="font-semibold text-recruiter-text mb-1">
          Recruiter Mode
        </h3>
        <p className="text-xs text-recruiter-secondary">
          Clean & Professional
        </p>
      </button>

      {/* Geek Mode Card */}
      <button
        onClick={() => setTheme('geek')}
        className={`
          flex-1 p-6 rounded-lg border-2 transition-all duration-300
          ${isGeekMode
            ? 'border-geek-cyan bg-geek-background-card shadow-glow-cyan scale-105'
            : 'border-gray-300 bg-gray-50 hover:border-geek-cyan/50'
          }
        `}
        aria-pressed={isGeekMode}
      >
        <div className="text-4xl mb-2">🚀</div>
        <h3 className={`font-semibold mb-1 ${isGeekMode ? 'text-geek-text' : 'text-gray-800'}`}>
          Geek Mode
        </h3>
        <p className={`text-xs ${isGeekMode ? 'text-geek-text-secondary' : 'text-gray-600'}`}>
          Dark & Immersive
        </p>
      </button>
    </div>
  );
};

ThemeToggle.displayName = 'ThemeToggle';
ThemeToggleCard.displayName = 'ThemeToggleCard';
