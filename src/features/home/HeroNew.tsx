import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Download, Linkedin, Github } from 'lucide-react';
import { useTheme } from '../../hooks';

/**
 * Hero Component - Personal Branding & Premium Experience
 * 
 * Diseño asimétrico moderno con scroll-reactive parallax:
 * - Texto inspirador a la izquierda con animaciones word-by-word
 * - Foto de perfil con Glass Blob animado a la derecha
 * - CTAs premium: Descargar CV + Social Icons glassmorphism
 * - Copy personal sobre crear experiencias digitales únicas
 * - Elementos de fondo con parallax
 */

export const Hero: React.FC = () => {
  const { isGeekMode } = useTheme();

  // Scroll parallax para elementos de fondo
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const titleWords = ['Hola,', 'soy', 'Alejo', 'Palavecino'];

  return (
    <motion.section 
      id="home"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-20"
      style={{ opacity }}
    >
      {/* Background decorativo con parallax */}
      {isGeekMode && (
        <>
          <motion.div 
            className="absolute top-20 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl"
            style={{ y: y1 }}
          />
          <motion.div 
            className="absolute bottom-20 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"
            style={{ y: y2 }}
          />
        </>
      )}

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Columna Izquierda - Texto */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8 lg:pr-8"
          >
            {/* Título animado word-by-word */}
            <motion.h1
              className={`
                text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight
                ${isGeekMode ? 'text-white' : 'text-gray-900'}
              `}
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.12,
                  },
                },
              }}
            >
              {titleWords.map((word, index) => (
                <motion.span
                  key={index}
                  className="inline-block mr-3"
                  variants={{
                    hidden: { opacity: 0, y: 50, rotateX: -90 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      transition: {
                        type: 'spring',
                        damping: 12,
                        stiffness: 100,
                      },
                    },
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* Rol con gradiente animado */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className={`
                text-2xl md:text-3xl font-display font-semibold
                bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400
                bg-clip-text text-transparent
                animate-gradient-x
              `}
            >
              Creando Experiencias Digitales con Código y Creatividad
            </motion.p>

            {/* Copy inspirador personal */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className={`
                text-lg md:text-xl font-light leading-relaxed
                ${isGeekMode ? 'text-gray-300' : 'text-gray-600'}
                max-w-xl
              `}
            >
              Soy Alejo Palavecino, un{' '}
              <span className={`font-medium ${isGeekMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                Desarrollador Full Stack
              </span>{' '}
              enfocado en construir aplicaciones web escalables, interactivas y memorables.
              Especializado en React, Node.js y Modern Web Performance.
            </motion.p>

            {/* CTAs - Botones + Social Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-wrap gap-4 items-center"
            >
              {/* Botón Primario - Descargar CV */}
              <motion.a
                href="/cv-alejo-palavecino.pdf"
                download
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  inline-flex items-center gap-2 px-8 py-4 rounded-full
                  font-semibold text-white text-lg
                  ${
                    isGeekMode
                      ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:shadow-glow-cyan'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl hover:shadow-2xl'
                  }
                  transition-all duration-300
                  relative overflow-hidden group
                `}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <Download size={20} className="relative z-10" />
                <span className="relative z-10">Descargar CV</span>
              </motion.a>

              {/* Divisor vertical */}
              <div
                className={`
                  h-12 w-px
                  ${isGeekMode ? 'bg-white/20' : 'bg-gray-300'}
                `}
              />

              {/* Social Icons - Glassmorphism */}
              <div className="flex gap-3">
                {/* LinkedIn */}
                <motion.a
                  href="https://www.linkedin.com/in/alejo-palavecino/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    p-4 rounded-full
                    backdrop-blur-md
                    ${
                      isGeekMode
                        ? 'bg-white/10 border border-white/20 hover:bg-white/20 hover:shadow-glow-cyan'
                        : 'bg-white shadow-lg hover:shadow-xl border border-gray-200'
                    }
                    transition-all duration-300
                    group
                  `}
                  aria-label="LinkedIn"
                >
                  <Linkedin
                    size={24}
                    className={`
                      ${
                        isGeekMode
                          ? 'text-white group-hover:text-cyan-400'
                          : 'text-gray-700 group-hover:text-blue-600'
                      }
                      transition-colors duration-300
                    `}
                  />
                </motion.a>

                {/* GitHub */}
                <motion.a
                  href="https://github.com/AlejoPalavecino"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    p-4 rounded-full
                    backdrop-blur-md
                    ${
                      isGeekMode
                        ? 'bg-white/10 border border-white/20 hover:bg-white/20 hover:shadow-glow-purple'
                        : 'bg-white shadow-lg hover:shadow-xl border border-gray-200'
                    }
                    transition-all duration-300
                    group
                  `}
                  aria-label="GitHub"
                >
                  <Github
                    size={24}
                    className={`
                      ${
                        isGeekMode
                          ? 'text-white group-hover:text-purple-400'
                          : 'text-gray-700 group-hover:text-gray-900'
                      }
                      transition-colors duration-300
                    `}
                  />
                </motion.a>
              </div>
            </motion.div>

            {/* Estadísticas rápidas */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="flex flex-wrap gap-8 pt-4"
            >
              <div className="space-y-1">
                <div className={`text-3xl font-bold ${isGeekMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                  3+
                </div>
                <div className={`text-sm ${isGeekMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  años de experiencia
                </div>
              </div>
              <div className="space-y-1">
                <div className={`text-3xl font-bold ${isGeekMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  20+
                </div>
                <div className={`text-sm ${isGeekMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  proyectos completados
                </div>
              </div>
              <div className="space-y-1">
                <div className={`text-3xl font-bold ${isGeekMode ? 'text-pink-400' : 'text-pink-600'}`}>
                  15+
                </div>
                <div className={`text-sm ${isGeekMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  tecnologías dominadas
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Columna Derecha - Foto de Perfil con Glass Blob */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Glass Blob animado (fondo) */}
            <motion.div
              animate={{
                rotate: [0, 360],
                borderRadius: [
                  '60% 40% 30% 70%/60% 30% 70% 40%',
                  '30% 60% 70% 40%/50% 60% 30% 60%',
                  '60% 40% 30% 70%/60% 30% 70% 40%',
                ],
              }}
              transition={{
                rotate: {
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                },
                borderRadius: {
                  duration: 10,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
              className={`
                absolute inset-0 -z-10
                w-full h-full
                backdrop-blur-3xl
                ${
                  isGeekMode
                    ? 'bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10'
                    : 'bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10'
                }
                blur-2xl
              `}
            />

            {/* Contenedor de foto con animación flotante */}
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative"
            >
              {/* Marco con glassmorphism */}
              <div
                className={`
                  relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96
                  rounded-[60%_40%_30%_70%/60%_30%_70%_40%]
                  overflow-hidden
                  backdrop-blur-md
                  ${
                    isGeekMode
                      ? 'bg-white/5 ring-2 ring-cyan-400/30'
                      : 'bg-white/80 ring-2 ring-blue-500/30 shadow-2xl'
                  }
                  p-2
                `}
              >
                {/* Foto de perfil */}
                <div
                  className={`
                    w-full h-full
                    rounded-[60%_40%_30%_70%/60%_30%_70%_40%]
                    overflow-hidden
                    flex items-center justify-center
                    text-8xl
                    ${
                      isGeekMode
                        ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20'
                        : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
                    }
                  `}
                >
                  👨‍💻
                  {/* Para usar imagen real:
                  <img
                    src="/path-to-your-photo.jpg"
                    alt="Alejo Palavecino"
                    className="w-full h-full object-cover"
                  />
                  */}
                </div>
              </div>

              {/* Efecto de glow pulsante */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={`
                  absolute inset-0 -z-20
                  rounded-[60%_40%_30%_70%/60%_30%_70%_40%]
                  ${
                    isGeekMode
                      ? 'bg-gradient-to-br from-cyan-400 via-purple-400 to-pink-400'
                      : 'bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400'
                  }
                  blur-3xl
                `}
              />

              {/* Partículas flotantes decorativas */}
              {isGeekMode && (
                <>
                  <motion.div
                    animate={{
                      y: [0, -30, 0],
                      x: [0, 15, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: 0,
                    }}
                    className="absolute top-10 right-10 w-2 h-2 bg-cyan-400 rounded-full"
                  />
                  <motion.div
                    animate={{
                      y: [0, 30, 0],
                      x: [0, -15, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: 1,
                    }}
                    className="absolute bottom-10 left-10 w-2 h-2 bg-purple-400 rounded-full"
                  />
                  <motion.div
                    animate={{
                      y: [0, -20, 0],
                      x: [0, -10, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: 2,
                    }}
                    className="absolute top-1/2 left-0 w-2 h-2 bg-pink-400 rounded-full"
                  />
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className={`w-6 h-10 rounded-full border-2 flex justify-center p-2 ${
            isGeekMode ? 'border-gray-600' : 'border-gray-400'
          }`}
        >
          <motion.div className={`w-1.5 h-1.5 rounded-full ${
            isGeekMode ? 'bg-gray-600' : 'bg-gray-400'
          }`} />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};
