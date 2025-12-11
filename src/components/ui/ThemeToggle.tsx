import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks';

/**
 * ThemeToggle Component
 * 
 * Switch animado que permite alternar entre modo Recruiter (light) y Geek (dark).
 * Utiliza framer-motion para animaciones fluidas y lucide-react para los iconos.
 * 
 * Características:
 * - Animación suave del toggle switch
 * - Iconos de sol/luna con transición
 * - Feedback visual on hover
 * - Accesible (botón con aria-label)
 * 
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */
export const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme, isGeekMode } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center gap-2 p-2 rounded-lg hover:bg-recruiter-primary-light dark:hover:bg-geek-primary-light transition-colors duration-200 group"
      aria-label={`Cambiar a modo ${isGeekMode ? 'Recruiter' : 'Geek'}`}
      title={`Cambiar a modo ${isGeekMode ? 'Recruiter' : 'Geek'}`}
    >
      {/* Container del Switch */}
      <div className="relative w-14 h-7 bg-recruiter-border dark:bg-geek-border rounded-full p-1 transition-colors duration-300">
        {/* Toggle animado */}
        <motion.div
          className="absolute top-1 w-5 h-5 bg-recruiter-primary dark:bg-geek-primary rounded-full shadow-md"
          animate={{
            x: isGeekMode ? 24 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      </div>

      {/* Iconos animados */}
      <div className="flex items-center gap-1">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isGeekMode ? 0 : 1,
            scale: isGeekMode ? 0.8 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="absolute left-16"
        >
          <Sun
            className="w-4 h-4 text-recruiter-primary"
            strokeWidth={2.5}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isGeekMode ? 1 : 0,
            scale: isGeekMode ? 1 : 0.8,
          }}
          transition={{ duration: 0.2 }}
          className="absolute left-16"
        >
          <Moon
            className="w-4 h-4 text-geek-primary"
            strokeWidth={2.5}
          />
        </motion.div>
      </div>

      {/* Texto del modo actual (opcional, visible en pantallas grandes) */}
      <span className="hidden md:block ml-6 text-sm font-medium text-recruiter-text dark:text-geek-text">
        {mode === 'recruiter' ? 'Recruiter' : 'Geek'}
      </span>
    </button>
  );
};

/**
 * Variante compacta del ThemeToggle (solo el switch, sin iconos ni texto)
 */
export const ThemeToggleCompact: React.FC = () => {
  const { toggleTheme, isGeekMode } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 bg-recruiter-border dark:bg-geek-border rounded-full p-1 transition-colors duration-300 hover:opacity-80"
      aria-label={`Cambiar a modo ${isGeekMode ? 'Recruiter' : 'Geek'}`}
    >
      <motion.div
        className="w-5 h-5 bg-recruiter-primary dark:bg-geek-primary rounded-full shadow-md flex items-center justify-center"
        animate={{
          x: isGeekMode ? 24 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        {/* Icono dentro del toggle */}
        <motion.div
          animate={{ rotate: isGeekMode ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isGeekMode ? (
            <Moon className="w-3 h-3 text-white" strokeWidth={3} />
          ) : (
            <Sun className="w-3 h-3 text-white" strokeWidth={3} />
          )}
        </motion.div>
      </motion.div>
    </button>
  );
};
