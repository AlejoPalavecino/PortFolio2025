import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../../hooks';

/**
 * AnimatedBackground Component - Premium Ambient Background
 * 
 * 🎨 CARACTERÍSTICAS VISUALES:
 * - Textura Grain (Ruido) sutil para aspecto premium
 * - Orbes de luz ambient con blur extremo
 * - Parallax scroll: los orbes se mueven a diferentes velocidades
 * - Adaptativo: colores diferentes para Geek Mode y Recruiter Mode
 * 
 * ⚡ PERFORMANCE:
 * - will-change: transform en orbes para aceleración GPU
 * - pointer-events-none para no interferir con interacciones
 * - Fixed positioning con z-index: -1 (detrás de todo)
 * - Transforms basados en scroll con useTransform (optimizado)
 * 
 * 🎭 EFECTO 3D:
 * - Orbe 1 (Top Left): Sube lento al scrollear (-0.3x velocidad)
 * - Orbe 2 (Bottom Right): Baja rápido al scrollear (0.5x velocidad)
 * - Orbe 3 (Center): Movimiento diagonal (combinación x/y)
 */

export const AnimatedBackground: React.FC = () => {
  const { isGeekMode } = useTheme();
  const { scrollYProgress } = useScroll();

  // 🌊 Parallax transforms para cada orbe
  // scrollYProgress va de 0 (top) a 1 (bottom)
  
  // Orbe 1: Sube lentamente (movimiento invertido)
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const orb1X = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Orbe 2: Baja rápido
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const orb2X = useTransform(scrollYProgress, [0, 1], [0, -150]);

  // Orbe 3: Movimiento diagonal
  const orb3Y = useTransform(scrollYProgress, [0, 1], [0, 350]);
  const orb3X = useTransform(scrollYProgress, [0, 1], [0, 200]);

  // 🎨 Colores según el modo
  const colors = isGeekMode
    ? {
        orb1: 'rgba(6, 182, 212, 0.15)',      // Cyan
        orb2: 'rgba(139, 92, 246, 0.15)',     // Purple
        orb3: 'rgba(236, 72, 153, 0.12)',     // Pink
      }
    : {
        orb1: 'rgba(59, 130, 246, 0.08)',     // Blue
        orb2: 'rgba(147, 197, 253, 0.06)',    // Light Blue
        orb3: 'rgba(191, 219, 254, 0.05)',    // Very Light Blue
      };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* 📐 Textura Grain (Ruido Premium) */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          mixBlendMode: isGeekMode ? 'overlay' : 'soft-light',
        }}
      />

      {/* 💫 Orbe 1 - Top Left (Cyan/Blue) */}
      <motion.div
        style={{
          y: orb1Y,
          x: orb1X,
          willChange: 'transform',
        }}
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.orb1} 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />
      </motion.div>

      {/* 💫 Orbe 2 - Bottom Right (Purple/Light Blue) */}
      <motion.div
        style={{
          y: orb2Y,
          x: orb2X,
          willChange: 'transform',
        }}
        className="absolute -bottom-40 -right-40 w-[800px] h-[800px] rounded-full blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.orb2} 0%, transparent 65%)`,
            filter: 'blur(80px)',
          }}
        />
      </motion.div>

      {/* 💫 Orbe 3 - Center (Pink/Very Light Blue) */}
      <motion.div
        style={{
          y: orb3Y,
          x: orb3X,
          willChange: 'transform',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.orb3} 0%, transparent 70%)`,
            filter: 'blur(70px)',
          }}
        />
      </motion.div>

      {/* ✨ Overlay sutil para unificar */}
      <div
        className="absolute inset-0"
        style={{
          background: isGeekMode
            ? 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.1) 100%)'
            : 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(255, 255, 255, 0.3) 100%)',
        }}
      />

      {/* 🌟 Sparkles aleatorios (opcional - solo Geek Mode) */}
      {isGeekMode && (
        <div className="absolute inset-0 opacity-20">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
