import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Layers, Wrench, Sparkles } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { mockSkills } from '../../mocks/data';
import { useTheme } from '../../hooks';

/**
 * SkillsBento Component
 * 
 * Diseño Bento Grid asimétrico moderno inspirado en Apple/Linear.
 * Reemplaza el antiguo grafo de fuerza con un diseño más elegante:
 * - Grid asimétrico con tarjetas de diferentes tamaños
 * - Glassmorphism en cada tarjeta
 * - Iconos grandes y minimalistas
 * - Hover con efecto glow sutil
 * - Agrupación por categoría con visual storytelling
 */

const categoryConfig = {
  language: {
    title: 'Lenguajes',
    subtitle: 'Los idiomas que hablo con las máquinas',
    icon: Code2,
    color: {
      light: 'from-blue-500 to-cyan-500',
      dark: 'from-cyan-400 to-blue-500',
      glow: 'hover:shadow-glow-cyan',
    },
  },
  framework: {
    title: 'Frameworks',
    subtitle: 'Las herramientas que potencian mis ideas',
    icon: Layers,
    color: {
      light: 'from-purple-500 to-pink-500',
      dark: 'from-purple-400 to-pink-400',
      glow: 'hover:shadow-glow-purple',
    },
  },
  tool: {
    title: 'Herramientas',
    subtitle: 'El arsenal que uso día a día',
    icon: Wrench,
    color: {
      light: 'from-green-500 to-emerald-500',
      dark: 'from-green-400 to-emerald-400',
      glow: 'hover:shadow-glow-mixed',
    },
  },
};

export const SkillsBento: React.FC = () => {
  const { isGeekMode } = useTheme();
  
  const languages = mockSkills.filter(s => s.category === 'language');
  const frameworks = mockSkills.filter(s => s.category === 'framework');
  const tools = mockSkills.filter(s => s.category === 'tool');

  // Main stack (las 3 skills más proficientes)
  const mainStack = mockSkills
    .sort((a, b) => b.proficiency - a.proficiency)
    .slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section id="lab" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header con título gradiente en Geek Mode */}
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
          Tecnologías que disfruto usar
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
          Un vistazo a las herramientas que uso para dar vida a ideas digitales
        </p>
      </motion.div>

      {/* Bento Grid Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
      >
        {/* Main Stack - Tarjeta Grande (ocupa 2 columnas en lg) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 lg:row-span-2">
          <GlassCard
            variant="strong"
            glow={isGeekMode}
            className="h-full p-8 group relative overflow-hidden"
          >
            {/* Decorative gradient orb */}
            {isGeekMode && (
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
            )}

            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                    Main Stack
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Las tecnologías con las que trabajo mejor
                  </p>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {mainStack.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center justify-center p-6 rounded-xl bg-glass-white-10 backdrop-blur-sm border border-glass-border-light hover:scale-105 transition-transform duration-300 group/card"
                  >
                    <span className="text-5xl mb-3 group-hover/card:animate-float">
                      {skill.icon}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white text-center">
                      {skill.name}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {skill.proficiency}% dominio
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Languages Category */}
        <motion.div variants={itemVariants}>
          <CategoryCard
            category="language"
            skills={languages}
            config={categoryConfig.language}
            isGeekMode={isGeekMode}
          />
        </motion.div>

        {/* Frameworks Category */}
        <motion.div variants={itemVariants} className="lg:row-span-2">
          <CategoryCard
            category="framework"
            skills={frameworks}
            config={categoryConfig.framework}
            isGeekMode={isGeekMode}
            tall
          />
        </motion.div>

        {/* Tools Category */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <CategoryCard
            category="tool"
            skills={tools}
            config={categoryConfig.tool}
            isGeekMode={isGeekMode}
            wide
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

interface CategoryCardProps {
  category: string;
  skills: any[];
  config: {
    title: string;
    subtitle: string;
    icon: React.ElementType;
    color: {
      light: string;
      dark: string;
      glow: string;
    };
  };
  isGeekMode: boolean;
  tall?: boolean;
  wide?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  skills,
  config,
  isGeekMode,
  tall = false,
  wide = false,
}) => {
  const IconComponent = config.icon;

  return (
    <GlassCard
      variant="default"
      glow={isGeekMode}
      className={`p-6 group relative overflow-hidden ${tall ? 'h-full' : ''}`}
    >
      {/* Header */}
      <div className="mb-6">
        <div
          className={`
          inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3
          bg-gradient-to-br ${isGeekMode ? config.color.dark : config.color.light}
          ${config.color.glow}
          transition-shadow duration-300
        `}
        >
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-1">
          {config.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
          {config.subtitle}
        </p>
      </div>

      {/* Skills Grid */}
      <div
        className={`
        grid gap-3
        ${wide ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6' : 'grid-cols-2'}
      `}
      >
        {skills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`
              flex flex-col items-center justify-center p-3 rounded-lg
              bg-glass-white backdrop-blur-sm border border-glass-border-light
              hover:border-glass-border-light/80
              transition-all duration-200
              cursor-default
            `}
            title={`${skill.name} - ${skill.proficiency}%`}
          >
            <span className="text-3xl mb-2">{skill.icon}</span>
            <span className="text-xs font-medium text-gray-900 dark:text-white text-center">
              {skill.name}
            </span>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};
