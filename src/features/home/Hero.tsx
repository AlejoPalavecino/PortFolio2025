import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Download, ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '../../hooks';

/**
 * Hero Component
 * 
 * Sección hero moderna con:
 * - Split layout (texto izquierda, imagen derecha)
 * - Título con gradiente animado
 * - CTAs prominentes (Descargar CV, Ver Proyectos)
 * - Foto de perfil con glow pulsante
 * - Animaciones stagger para texto
 * - Foto flotante suave (infinite y-axis)
 */

export const Hero: React.FC = () => {
  const { isGeekMode } = useTheme();

  // Control de opacidad basado en scroll - Nunca baja de 0.1
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0.1]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  // Animación de texto palabra por palabra
  const titleWords = ['Hola,', 'soy', 'Alejo', 'Palavecino'];
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
  };

  const wordVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  // Animación del subtítulo con gradiente
  const subtitleVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.8,
        duration: 0.6,
      },
    },
  };

  // Animación de los botones
  const buttonContainerVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.2,
        duration: 0.6,
      },
    },
  };

  // Animación de la foto
  const imageVariant = {
    hidden: { opacity: 0, scale: 0.8, x: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        delay: 0.5,
        duration: 0.8,
        type: 'spring',
        stiffness: 80,
      },
    },
  };

  return (
    <motion.section
      id="home"
      className="relative min-h-screen flex items-center pt-20 md:pt-24 pb-16 overflow-hidden"
      style={{ opacity, scale, pointerEvents: 'auto' }}
    >
      {/* Background decorativo */}
      {isGeekMode && (
        <>
          <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
        </>
      )}

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Columna Izquierda - Texto */}
          <div className="space-y-8">
            {/* Título - Animación palabra por palabra */}
            <motion.h1
              variants={container}
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold leading-tight"
            >
              {titleWords.map((word, index) => (
                <motion.span
                  key={index}
                  variants={wordVariant}
                  className={`
                    inline-block mr-4
                    ${index === titleWords.length - 1 && isGeekMode
                      ? 'bg-gradient-text bg-clip-text text-transparent'
                      : 'text-gray-900 dark:text-white'
                    }
                  `}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subtítulo con gradiente animado */}
            <motion.div
              variants={subtitleVariant}
              initial="hidden"
              animate="visible"
            >
              <h2
                className={`
                  text-2xl md:text-3xl lg:text-4xl font-display font-semibold
                  ${
                    isGeekMode
                      ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x'
                      : 'text-gray-700'
                  }
                `}
              >
                Desarrollador Full Stack
                <br />
                <span className="inline-flex items-center gap-2">
                  & Creative Coder
                  <Sparkles className={`w-6 h-6 ${isGeekMode ? 'text-cyan-400' : 'text-blue-600'} animate-pulse`} />
                </span>
              </h2>
            </motion.div>

            {/* Descripción breve */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-xl font-light"
            >
              Transformo ideas en experiencias digitales elegantes. 
              Especializado en React, TypeScript y arquitecturas escalables.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={buttonContainerVariant}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-4"
            >
              {/* Botón Primario - Descargar CV */}
              <motion.a
                href="/cv-alejo-palavecino.pdf" // Actualizar con tu CV
                download
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  group
                  inline-flex items-center gap-3 
                  px-8 py-4 
                  rounded-full 
                  font-semibold text-base
                  ${
                    isGeekMode
                      ? 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:shadow-glow-mixed text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }
                  shadow-xl
                  transition-all duration-300
                `}
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                <span>Descargar CV</span>
              </motion.a>

              {/* Botón Secundario - Ver Proyectos */}
              <motion.a
                href="#portfolio"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  group
                  inline-flex items-center gap-3 
                  px-8 py-4 
                  rounded-full 
                  font-semibold text-base
                  backdrop-blur-md bg-glass-white 
                  border-2 border-glass-border-light
                  hover:border-cyan-400/50
                  text-gray-900 dark:text-white
                  hover:shadow-glass
                  transition-all duration-300
                "
              >
                <span>Ver Proyectos</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </motion.div>

            {/* Estadísticas rápidas */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="flex flex-wrap gap-8 pt-8"
            >
              <div className="space-y-1">
                <div className={`text-3xl font-bold ${isGeekMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                  3+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Años de experiencia
                </div>
              </div>
              <div className="space-y-1">
                <div className={`text-3xl font-bold ${isGeekMode ? 'text-purple-400' : 'text-blue-600'}`}>
                  20+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Proyectos completados
                </div>
              </div>
              <div className="space-y-1">
                <div className={`text-3xl font-bold ${isGeekMode ? 'text-pink-400' : 'text-blue-600'}`}>
                  15+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Tecnologías dominadas
                </div>
              </div>
            </motion.div>
          </div>

          {/* Columna Derecha - Foto de perfil */}
          <motion.div
            variants={imageVariant}
            initial="hidden"
            animate="visible"
            className="relative flex items-center justify-center lg:justify-end"
          >
            {/* Contenedor de la imagen con animación flotante */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative"
            >
              {/* Glow pulsante detrás de la foto */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={`
                  absolute inset-0 -z-10
                  rounded-[60%_40%_30%_70%/60%_30%_70%_40%]
                  blur-3xl
                  ${
                    isGeekMode
                      ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400'
                      : 'bg-gradient-to-r from-blue-400 to-indigo-400'
                  }
                `}
              />

              {/* Imagen de perfil con marco orgánico */}
              <div
                className={`
                  relative w-80 h-80 md:w-96 md:h-96
                  rounded-[60%_40%_30%_70%/60%_30%_70%_40%]
                  overflow-hidden
                  border-4
                  ${isGeekMode ? 'border-cyan-400/30' : 'border-blue-400/30'}
                  shadow-2xl
                  backdrop-blur-sm
                  bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800
                `}
              >
                {/* Placeholder para la foto - Reemplazar con tu foto real */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
                  <span className="text-8xl">👨‍💻</span>
                  {/* Descomentar y usar tu foto:
                  <img
                    src="/images/profile-photo.jpg"
                    alt="Alejo Palavecino"
                    className="w-full h-full object-cover"
                  />
                  */}
                </div>
              </div>

              {/* Elementos decorativos flotantes */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20 blur-xl"
              />
              <motion.div
                animate={{
                  rotate: [360, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 opacity-20 blur-xl"
              />
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
          className="w-6 h-10 rounded-full border-2 border-gray-400 dark:border-gray-600 flex justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};
