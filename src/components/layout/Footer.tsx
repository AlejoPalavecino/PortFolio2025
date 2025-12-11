import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

/**
 * Footer Component
 * 
 * Footer profesional y minimalista con:
 * - Glassmorphism sutil
 * - Enlaces a redes sociales
 * - Copyright y créditos
 * - Estilo consistente con el tema activo
 */

export const Footer: React.FC = () => {
  const { isGeekMode } = useTheme();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/AlejoPalavecino',
      label: 'Ver proyectos en GitHub'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/alejo-palavecino/',
      label: 'Conectar en LinkedIn'
    },
    {
      name: 'Email',
      icon: Mail,
      href: 'mailto:alejopalavecino12@gmail.com',
      label: 'Enviar email'
    }
  ];

  return (
    <footer className="relative z-10 border-t border-recruiter-border/50 dark:border-geek-border/50">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-white/30 dark:bg-geek-card/20 backdrop-blur-md" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-6">
          {/* Social Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  p-2 rounded-lg transition-all duration-200
                  ${isGeekMode 
                    ? 'bg-geek-card/50 hover:bg-geek-primary-light text-geek-text hover:text-geek-primary border border-geek-border/50' 
                    : 'bg-white/50 hover:bg-recruiter-primary-light text-recruiter-secondary hover:text-recruiter-primary border border-recruiter-border/50'
                  }
                `}
              >
                <link.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>

          {/* Divider */}
          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-recruiter-border dark:via-geek-border to-transparent" />

          {/* Copyright Text */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center space-y-2"
          >
            <p className="text-sm text-recruiter-secondary dark:text-geek-text-secondary">
              © {currentYear} Alejo Palavecino Portfolio
            </p>
            
            <p className="text-xs text-recruiter-secondary/80 dark:text-geek-text-secondary/80 flex items-center justify-center gap-1">
              Built with <Heart className="w-3 h-3 fill-red-500 text-red-500 animate-pulse" /> using React & Supabase
            </p>
          </motion.div>

          {/* Back to Top Link (optional) */}
          <motion.a
            href="#home"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`
              text-sm font-medium transition-colors duration-200
              ${isGeekMode
                ? 'text-geek-text-secondary hover:text-geek-primary'
                : 'text-recruiter-secondary hover:text-recruiter-primary'
              }
            `}
          >
            ↑ Back to top
          </motion.a>
        </div>
      </div>
    </footer>
  );
};
