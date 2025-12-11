import React, { useRef, useState, memo } from 'react';
import { motion, useScroll, useVelocity, useTransform, useSpring, useAnimationFrame, useMotionValue } from 'framer-motion';
import { useTheme } from '../../hooks';
import { useSkills } from '../../hooks/useSkills';

/**
 * Utility: wrap function for infinite scroll
 */
function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

/**
 * SkillsVelocity Component - Infinite Marquee with Scroll Physics
 * 
 * 🚀 OPTIMIZADO PARA 60 FPS:
 * - Logos oficiales desde cdn.simpleicons.org (precisión de marca)
 * - React.memo en componentes hijos para evitar re-renders
 * - will-change: transform para aceleración por hardware
 * - loading="lazy" y decoding="async" en imágenes
 * - Array duplicado 4x para pantallas ultra-wide 4K sin cortes
 * - Wrap infinito sin saltos visuales
 */

// Skill interface importada desde useSkills hook

interface SkillItemProps {
  skill: { name: string; logo: string; color: string };
}

// ✅ React.memo para evitar re-renders innecesarios
const SkillItem = memo<SkillItemProps>(({ skill }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isGeekMode } = useTheme();

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.15, z: 50 }}
      className="relative mx-6 cursor-pointer select-none group"
      style={{ perspective: 1000 }}
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.05 : 1,
          rotateY: isHovered ? [0, 360] : 0,
        }}
        transition={{
          scale: { duration: 0.3 },
          rotateY: { duration: 0.6, ease: 'easeOut' },
        }}
        className={`
          relative
          flex flex-col items-center justify-center
          min-w-[120px] h-32
          p-4
          rounded-2xl
          backdrop-blur-sm
          transition-all duration-300
          ${
            isGeekMode
              ? 'bg-white/5 border border-white/10 group-hover:border-white/30'
              : 'bg-white/90 border border-gray-200 shadow-lg group-hover:border-gray-300'
          }
          ${isHovered ? 'z-10' : 'z-0'}
        `}
        style={{
          boxShadow: isHovered 
            ? `0 0 30px ${skill.color}30, 0 0 60px ${skill.color}20, 0 8px 16px rgba(0,0,0,0.15)` 
            : undefined,
          transition: 'box-shadow 0.4s ease-out'
        }}
      >
        {/* ✅ Logo oficial con estrategia Monocromo → Color */}
        <motion.img
          src={skill.logo}
          alt={`${skill.name} logo`}
          loading="lazy"
          decoding="async"
          animate={{
            filter: isHovered 
              ? 'grayscale(0%) brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.3))' 
              : 'grayscale(100%) brightness(0.7)',
            opacity: isHovered ? 1 : 0.6,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-14 h-14 mb-3 object-contain"
        />

        {/* Nombre */}
        <motion.span
          animate={{
            opacity: isHovered ? 1 : 0.8,
            y: isHovered ? 0 : 2,
          }}
          transition={{ duration: 0.3 }}
          className={`
            text-sm font-semibold text-center
            ${isGeekMode ? 'text-white' : 'text-gray-800'}
          `}
        >
          {skill.name}
        </motion.span>

        {/* Glow de marca en hover (Geek Mode) */}
        {isGeekMode && isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-2xl blur-xl -z-10 pointer-events-none"
            style={{
              backgroundColor: skill.color,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
});

SkillItem.displayName = 'SkillItem';

interface ParallaxRowProps {
  skills: { name: string; logo: string; color: string }[];
  baseVelocity: number;
}

// ✅ React.memo para optimizar re-renders
const ParallaxRow = memo<ParallaxRowProps>(({ skills, baseVelocity }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v: number) => `${wrap(-25, 0, v)}%`);

  const directionFactor = useRef<number>(1);

  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // Warp speed effect: ajustar velocidad según scroll
    const velocity = velocityFactor.get();
    moveBy += directionFactor.current * velocity * (delta / 1000);

    baseX.set(baseX.get() + moveBy);
  });

  // ✅ Duplicar skills 4x para pantallas ultra-wide 4K sin cortes visuales
  const duplicatedSkills = [...skills, ...skills, ...skills, ...skills];

  return (
    <div className="overflow-hidden whitespace-nowrap flex py-16">
      {/* ✅ Padding vertical generoso (py-16) para evitar clipping en hover/scale */}
      {/* ✅ will-change: transform para aceleración por hardware */}
      <motion.div 
        className="flex items-center" 
        style={{ x, willChange: 'transform' }}
      >
        {duplicatedSkills.map((skill, index) => (
          <SkillItem key={`${skill.name}-${index}`} skill={skill} />
        ))}
      </motion.div>
    </div>
  );
});

ParallaxRow.displayName = 'ParallaxRow';

export const SkillsVelocity: React.FC = () => {
  const { isGeekMode } = useTheme();
  const { skills, loading, error } = useSkills();

  // Mostrar loading state
  if (loading) {
    return (
      <section id="lab" className="relative py-16 overflow-hidden">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">Cargando habilidades...</p>
          </div>
        </div>
      </section>
    );
  }

  // Mostrar error state
  if (error) {
    return (
      <section id="lab" className="relative py-16 overflow-hidden">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center text-red-400">
            <p>❌ Error al cargar habilidades</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // No hay skills en la BD
  if (skills.length === 0) {
    return (
      <section id="lab" className="relative py-16 overflow-hidden">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-400">No hay habilidades disponibles</p>
        </div>
      </section>
    );
  }

  return (
    <section id="lab" className="relative py-16 overflow-hidden">{/* Background decorativo */}
      {/* Background decorativo */}
      {isGeekMode && (
        <>
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
        </>
      )}

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 px-4"
        >
          <h2
            className={`
              text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6
              ${
                isGeekMode
                  ? 'bg-gradient-text bg-clip-text text-transparent'
                  : 'text-gray-900'
              }
            `}
          >
            Ecosistema Tecnológico
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
            {isGeekMode 
              ? 'Mi stack preferido para dar vida a las ideas 🚀'
              : 'Desde el Frontend pixel-perfect hasta el Backend robusto'
            }
          </p>
        </motion.div>

        {/* ✅ Marquee con todas las tecnologías (una sola fila continua) */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 px-4 text-center">
              <span
                className={`
                  text-sm font-semibold uppercase tracking-wider
                  ${isGeekMode ? 'text-cyan-400' : 'text-blue-600'}
                `}
              >
                💻 Full Stack Development • AI Engineering
              </span>
            </div>
            <ParallaxRow skills={skills} baseVelocity={-1.5} />
          </motion.div>
        </div>

        {/* Hint de interacción */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-center mt-16 px-4"
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
            💡 Tip: Haz scroll rápido para ver el efecto "warp speed"
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
