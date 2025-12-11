import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Clock, Briefcase, Beaker, Award } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useTheme } from '../../hooks';

/**
 * Navbar Component
 * 
 * Barra de navegación principal del portfolio con:
 * - Enlaces a las secciones principales
 * - ThemeToggle para cambiar entre modos
 * - Diseño responsivo con menú hamburguesa en móvil
 * - Animaciones suaves con framer-motion
 * 
 * Secciones:
 * - Home: Página principal
 * - Timeline: Línea de tiempo profesional
 * - Portfolio: Proyectos destacados
 * - Lab: Habilidades técnicas
 * - Certs: Certificaciones
 */

interface NavLink {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navLinks: NavLink[] = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'Timeline', href: '#timeline', icon: Clock },
  { name: 'Portfolio', href: '#portfolio', icon: Briefcase },
  { name: 'Lab', href: '#lab', icon: Beaker },
  { name: 'Certs', href: '#certs', icon: Award },
];

export const Navbar: React.FC = () => {
  const { isGeekMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/60 dark:bg-geek-background/60 border-b border-recruiter-border/50 dark:border-geek-border/50 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo / Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <a
              href="#home"
              className={`text-xl md:text-2xl font-display font-bold hover:opacity-80 transition-opacity ${
                isGeekMode
                  ? 'bg-gradient-text bg-clip-text text-transparent'
                  : 'text-blue-600'
              }`}
            >
              {isGeekMode ? (
                <span className="font-mono">&lt;/Dev&gt;</span>
              ) : (
                <span>Portfolio</span>
              )}
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center gap-2"
          >
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-recruiter-text dark:text-geek-text hover:bg-recruiter-primary-light dark:hover:bg-geek-primary-light hover:text-recruiter-primary dark:hover:text-geek-primary transition-all duration-200 font-medium group"
              >
                <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{link.name}</span>
              </motion.a>
            ))}
          </motion.div>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle - Visible en todas las pantallas */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ThemeToggle />
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-recruiter-primary-light dark:hover:bg-geek-primary-light transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-recruiter-text dark:text-geek-text" />
              ) : (
                <Menu className="w-6 h-6 text-recruiter-text dark:text-geek-text" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-recruiter-border dark:border-geek-border bg-white/80 dark:bg-geek-card/80 backdrop-blur-lg"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-2">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={closeMobileMenu}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-recruiter-text dark:text-geek-text hover:bg-recruiter-primary-light dark:hover:bg-geek-primary-light hover:text-recruiter-primary dark:hover:text-geek-primary transition-all duration-200 font-medium"
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
