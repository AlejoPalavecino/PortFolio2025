import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './NavbarNew';
import { Footer } from './Footer';
import { AnimatedBackground } from './AnimatedBackground';
import { useTheme } from '../../hooks';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout Component
 * 
 * Layout principal de la aplicación que:
 * - Envuelve toda la aplicación con estructura consistente
 * - Aplica estilos de tema según el modo activo
 * - Incluye la Navbar en todas las páginas
 * - AnimatedBackground premium con parallax y orbes de luz
 * - Maneja el espaciado para evitar que el contenido quede bajo el navbar fijo
 * 
 * Características visuales:
 * - Recruiter Mode: Fondo limpio con orbes sutiles azules
 * - Geek Mode: Fondo oscuro con orbes cyan/purple y sparkles
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isGeekMode } = useTheme();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-geek-background dark:via-[#0a0d16] dark:to-[#0d1220] text-recruiter-text dark:text-geek-text transition-colors duration-500 overflow-x-hidden">
      {/* 🎨 Mesh Gradient Dinámico con Animación */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Gradient Mesh - Muy sutil y suave */}
        <motion.div
          animate={{
            background: isGeekMode
              ? [
                  'radial-gradient(circle at 20% 30%, rgba(6, 182, 212, 0.08) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 40%), radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.06) 0%, transparent 40%)',
                  'radial-gradient(circle at 80% 30%, rgba(6, 182, 212, 0.08) 0%, transparent 40%), radial-gradient(circle at 20% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 40%), radial-gradient(circle at 60% 20%, rgba(236, 72, 153, 0.06) 0%, transparent 40%)',
                  'radial-gradient(circle at 20% 30%, rgba(6, 182, 212, 0.08) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 40%), radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.06) 0%, transparent 40%)',
                ]
              : [
                  'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(147, 197, 253, 0.05) 0%, transparent 40%)',
                  'radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(147, 197, 253, 0.05) 0%, transparent 40%)',
                  'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(147, 197, 253, 0.05) 0%, transparent 40%)',
                ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute inset-0"
        />

        {/* Grain/Noise Texture - Ultra sutil para profundidad */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px'
          }}
        />
      </div>

      {/* 🎨 Fondo Animado Premium con Parallax */}
      <AnimatedBackground />

      {/* Navbar fija en la parte superior */}
      <Navbar />

      {/* Contenido principal con padding reducido */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 pt-14 md:pt-16"
      >
        {children}
      </motion.main>

      {/* Footer Profesional */}
      <Footer />
    </div>
  );
};

/**
 * Variante del Layout sin Navbar (útil para páginas de login, admin, etc.)
 */
export const LayoutSimple: React.FC<LayoutProps> = ({ children }) => {
  const { isGeekMode } = useTheme();

  return (
    <div className="relative min-h-screen bg-recruiter-background dark:bg-geek-background text-recruiter-text dark:text-geek-text transition-colors duration-300">
      {/* Fondo especial para Geek Mode */}
      {isGeekMode && (
        <>
          <div
            className="fixed inset-0 pointer-events-none z-0"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, rgba(6, 182, 212, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
              `,
            }}
          />
          <div
            className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />
        </>
      )}

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        {children}
      </motion.main>
    </div>
  );
};
