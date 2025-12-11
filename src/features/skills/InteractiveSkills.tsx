import React, { useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useTheme } from '../../hooks';
import { mockSkills } from '../../mocks/data';

/**
 * InteractiveSkills Component - Floating Gravity Skills
 * 
 * Sistema único e interactivo de skills donde cada habilidad es:
 * - Un orbe/píldora flotante que se mueve suavemente
 * - DRAGGABLE: El usuario puede arrastrarlas por la pantalla
 * - Spring physics: Rebotan con efecto spring al soltarlas
 * - Geek Mode: Orbes brillantes con glow neon
 * - Recruiter Mode: Píldoras limpias con sombra suave
 */

interface SkillOrbProps {
  skill: {
    id: string;
    name: string;
    icon: string;
    category: string;
    proficiency: number;
  };
  index: number;
  isGeekMode: boolean;
}

const SkillOrb: React.FC<SkillOrbProps> = ({ skill, index, isGeekMode }) => {
  const orbRef = useRef<HTMLDivElement>(null);
  
  // Motion values para tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Colores según categoría
  const categoryColors = {
    language: {
      geek: 'from-cyan-400 to-blue-500',
      recruiter: 'from-blue-500 to-blue-600',
      glow: 'shadow-[0_0_30px_rgba(6,182,212,0.6)]',
      border: 'border-cyan-400/30',
    },
    framework: {
      geek: 'from-purple-400 to-pink-500',
      recruiter: 'from-purple-500 to-purple-600',
      glow: 'shadow-[0_0_30px_rgba(168,85,247,0.6)]',
      border: 'border-purple-400/30',
    },
    tool: {
      geek: 'from-green-400 to-emerald-500',
      recruiter: 'from-green-500 to-green-600',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.6)]',
      border: 'border-green-400/30',
    },
  };

  const colors = categoryColors[skill.category as keyof typeof categoryColors];

  // Animación de flotación aleatoria
  const floatAnimation = {
    y: [0, -15 - (index % 3) * 5, 0],
    x: [0, (index % 2 === 0 ? 10 : -10), 0],
    rotate: [0, (index % 2 === 0 ? 5 : -5), 0],
  };

  const floatTransition = {
    duration: 4 + (index % 3),
    repeat: Infinity,
    ease: 'easeInOut',
    delay: index * 0.2,
  };

  return (
    <motion.div
      ref={orbRef}
      drag
      dragConstraints={{
        top: -300,
        left: -300,
        right: 300,
        bottom: 300,
      }}
      dragElastic={0.1}
      dragTransition={{
        bounceStiffness: 200,
        bounceDamping: 20,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={floatAnimation}
      transition={floatTransition}
      className={`
        relative cursor-grab active:cursor-grabbing
        touch-none select-none
        ${index === 0 ? 'col-span-2 row-span-2' : ''}
      `}
      style={{
        x,
        y,
      }}
    >
      {/* Orbe/Píldora de Skill */}
      <motion.div
        className={`
          relative
          ${index === 0 ? 'w-40 h-40' : 'w-32 h-32'}
          rounded-full
          backdrop-blur-md
          ${isGeekMode ? 'bg-glass-white-10' : 'bg-white/90'}
          border-2
          ${isGeekMode ? colors.border : 'border-gray-200'}
          ${isGeekMode ? colors.glow : 'shadow-xl shadow-gray-300/50'}
          flex flex-col items-center justify-center
          overflow-hidden
          transition-all duration-300
        `}
      >
        {/* Gradiente de fondo animado (Geek Mode) */}
        {isGeekMode && (
          <motion.div
            className={`
              absolute inset-0 
              bg-gradient-to-br ${colors.geek}
              opacity-20
            `}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}

        {/* Contenido */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-2">
          {/* Icono */}
          <motion.span
            className={`
              ${index === 0 ? 'text-6xl' : 'text-4xl'}
            `}
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {skill.icon}
          </motion.span>

          {/* Nombre */}
          <span
            className={`
              ${index === 0 ? 'text-sm' : 'text-xs'}
              font-semibold
              ${isGeekMode ? 'text-white' : 'text-gray-800'}
              text-center px-2
            `}
          >
            {skill.name}
          </span>

          {/* Barra de proficiencia (solo en main skill) */}
          {index === 0 && (
            <div className="w-20 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
              <motion.div
                className={`h-full bg-gradient-to-r ${colors.geek}`}
                initial={{ width: 0 }}
                animate={{ width: `${skill.proficiency}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          )}
        </div>

        {/* Partículas flotantes (Geek Mode) */}
        {isGeekMode && (
          <>
            <motion.div
              className="absolute top-2 right-2 w-1 h-1 bg-cyan-400 rounded-full"
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5,
              }}
            />
            <motion.div
              className="absolute bottom-3 left-3 w-1 h-1 bg-purple-400 rounded-full"
              animate={{
                y: [0, 20, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1,
              }}
            />
          </>
        )}

        {/* Efecto de brillo al arrastrar */}
        <motion.div
          className={`
            absolute inset-0 
            bg-gradient-to-br ${isGeekMode ? colors.geek : colors.recruiter}
            opacity-0 hover:opacity-30
            transition-opacity duration-300
            rounded-full
          `}
        />
      </motion.div>
    </motion.div>
  );
};

export const InteractiveSkills: React.FC = () => {
  const { isGeekMode } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  // Separar main skills (primeras 3) del resto
  const mainSkills = mockSkills.slice(0, 3);
  const secondarySkills = mockSkills.slice(3);

  return (
    <section id="lab" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decorativo */}
      {isGeekMode && (
        <>
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
        </>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2
            className={`
              text-5xl md:text-6xl lg:text-7xl font-display font-bold
              ${
                isGeekMode
                  ? 'bg-gradient-text bg-clip-text text-transparent'
                  : 'text-gray-900'
              }
            `}
          >
            Tecnologías Interactivas
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
            {isGeekMode 
              ? '¡Arrastra y juega con mis habilidades! Cada orbe es draggable 🎮'
              : 'Habilidades técnicas con las que trabajo. Arrastra para interactuar ✨'
            }
          </p>
        </motion.div>

        {/* Main Skills - Grandes y destacadas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {mainSkills.map((skill, index) => (
              <SkillOrb
                key={skill.id}
                skill={skill}
                index={index}
                isGeekMode={isGeekMode}
              />
            ))}
          </div>
        </motion.div>

        {/* Interactive Skills Grid - Todas draggables */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative min-h-[600px] max-w-6xl mx-auto"
        >
          {/* Grid Container */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
            {secondarySkills.map((skill, index) => (
              <SkillOrb
                key={skill.id}
                skill={skill}
                index={index + 3}
                isGeekMode={isGeekMode}
              />
            ))}
          </div>
        </motion.div>

        {/* Hint de interacción */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="text-center mt-16"
        >
          <motion.p
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-sm text-gray-500 dark:text-gray-400 font-light"
          >
            💡 Tip: Arrastra las habilidades para verlas rebotar
          </motion.p>
        </motion.div>

        {/* Leyenda de categorías */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap justify-center gap-6"
        >
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isGeekMode ? 'bg-cyan-400 shadow-glow-cyan' : 'bg-blue-500'}`} />
            <span className="text-sm text-gray-600 dark:text-gray-400">Lenguajes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isGeekMode ? 'bg-purple-400 shadow-glow-purple' : 'bg-purple-500'}`} />
            <span className="text-sm text-gray-600 dark:text-gray-400">Frameworks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isGeekMode ? 'bg-green-400 shadow-glow-mixed' : 'bg-green-500'}`} />
            <span className="text-sm text-gray-600 dark:text-gray-400">Herramientas</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
