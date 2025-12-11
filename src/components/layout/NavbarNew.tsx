import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Briefcase, Beaker, Award, Linkedin, Github } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useTheme } from '../../hooks';

/**
 * Navbar Component - Actualizado con Scroll Behavior
 * 
 * Navbar flotante con glassmorphism que:
 * - Se reduce en tamaño al hacer scroll
 * - Incluye iconos sociales (LinkedIn, GitHub)
 * - Mantiene ThemeToggle
 * - Diseño responsivo
 * - Secciones: Home, Portfolio, Lab, Certs
 */

interface NavLink {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navLinks: NavLink[] = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'Portfolio', href: '#portfolio', icon: Briefcase },
  { name: 'Lab', href: '#lab', icon: Beaker },
  { name: 'Certs', href: '#certs', icon: Award },
];

const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/alejo-palavecino/', // Actualizar con tu perfil
    icon: Linkedin,
    color: 'hover:text-blue-600',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/AlejoPalavecino', // Actualizar con tu perfil
    icon: Github,
    color: 'hover:text-gray-900 dark:hover:text-white',
  },
];

export const Navbar: React.FC = () => {
  const { isGeekMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectar scroll para cambiar tamaño del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      className={`
        fixed top-0 left-0 right-0 z-50 
        backdrop-blur-xl 
        ${isScrolled ? 'bg-white/80 dark:bg-geek-background/80' : 'bg-white/70 dark:bg-geek-background/70'}
        border-b border-glass-border-dark dark:border-glass-border-light 
        ${isScrolled ? 'shadow-lg' : 'shadow-glass-sm'}
        transition-all duration-300
      `}
    >
      <div className="container-custom">
        <div
          className={`
            flex items-center justify-between 
            ${isScrolled ? 'h-14 md:h-16' : 'h-16 md:h-20'}
            transition-all duration-300
          `}
        >
          {/* Logo / Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <a
              href="#home"
              className={`
                ${isScrolled ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}
                font-display font-bold hover:opacity-80 transition-all duration-300
                ${
                  isGeekMode
                    ? 'bg-gradient-text bg-clip-text text-transparent'
                    : 'text-blue-600'
                }
              `}
            >
              {isGeekMode ? (
                <span className="font-mono">&lt;AP/&gt;</span>
              ) : (
                <span>Alejo Palavecino</span>
              )}
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden lg:flex items-center gap-1"
          >
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                className={`
                  flex items-center gap-2 
                  ${isScrolled ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-base'}
                  rounded-lg text-gray-700 dark:text-gray-300 
                  hover:bg-blue-50 dark:hover:bg-cyan-950/30
                  hover:text-blue-600 dark:hover:text-cyan-400 
                  transition-all duration-200 font-medium group
                `}
              >
                <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{link.name}</span>
              </motion.a>
            ))}
          </motion.div>

          {/* Right Side: Social Links + Theme Toggle + Mobile Menu */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Social Links - Desktop only */}
            <div className="hidden md:flex items-center gap-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`
                    p-2 rounded-lg 
                    backdrop-blur-md bg-glass-white 
                    border border-glass-border-light
                    text-gray-700 dark:text-gray-300
                    ${social.color}
                    hover:scale-110 hover:shadow-glow-cyan
                    transition-all duration-200
                  `}
                  aria-label={`Visitar perfil de ${social.name}`}
                  title={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>

            {/* Theme Toggle */}
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
              className="lg:hidden p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-cyan-950/30 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
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
            className="lg:hidden border-t border-glass-border-light backdrop-blur-xl bg-white/90 dark:bg-geek-background/90"
          >
            <div className="container-custom py-4 space-y-2">
              {/* Nav Links */}
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={closeMobileMenu}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-cyan-950/30 hover:text-blue-600 dark:hover:text-cyan-400 transition-all duration-200 font-medium"
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </motion.a>
              ))}

              {/* Social Links Mobile */}
              <div className="flex items-center gap-3 px-4 pt-4 border-t border-glass-border-light">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg
                      backdrop-blur-md bg-glass-white 
                      border border-glass-border-light
                      text-gray-700 dark:text-gray-300
                      ${social.color}
                      transition-all duration-200
                    `}
                  >
                    <social.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
