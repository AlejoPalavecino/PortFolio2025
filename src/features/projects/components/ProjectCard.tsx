import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { useTheme } from '../../../hooks';
import type { Project } from '../../../hooks/useProjects';

/**
 * ProjectCard Component - High-End 3D Tilt Effect
 * 
 * Características Premium:
 * - 3D Tilt: Inclinación siguiendo el cursor con lógica custom
 * - Zoom-in en imagen al hacer hover
 * - Info slide-up animado
 * - Glassmorphism fuerte con bordes gradiente
 * - Sombras premium según modo
 */

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const { isGeekMode } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Efecto de highlight cuando se navega desde un certificado
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === `#project-${project.id}`) {
        setIsHighlighted(true);
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remover highlight después de 3 segundos
        setTimeout(() => {
          setIsHighlighted(false);
          // Limpiar el hash sin afectar el historial
          window.history.replaceState(null, '', window.location.pathname);
        }, 3000);
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [project.id]);

  // Motion values para tracking del mouse
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics para movimiento suave
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  });

  // Efecto de elevación
  const scale = useSpring(1, {
    stiffness: 300,
    damping: 30,
  });

  // Handler del movimiento del mouse
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calcular posición relativa del mouse (-0.5 a 0.5)
    const mouseXRelative = (e.clientX - rect.left) / width - 0.5;
    const mouseYRelative = (e.clientY - rect.top) / height - 0.5;

    mouseX.set(mouseXRelative);
    mouseY.set(mouseYRelative);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(1.05);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
  };

  // Iconos de tecnologías (placeholder)
  const techIcons: Record<string, string> = {
    react: '⚛️',
    typescript: '📘',
    nextjs: '▲',
    tailwind: '🎨',
    framer: '🎭',
    node: '🟢',
    express: '🚂',
    mongodb: '🍃',
    postgresql: '🐘',
    default: '🔧',
  };

  const getTechIcon = (tech: string) => {
    const key = tech.toLowerCase().replace(/\s+/g, '');
    return techIcons[key] || techIcons.default;
  };

  // Colores según tipo de proyecto
  const projectTypeColors = {
    web: {
      border: isGeekMode
        ? 'from-cyan-400/50 via-blue-400/50 to-cyan-400/50'
        : 'from-blue-400/40 via-blue-500/40 to-blue-400/40',
      glow: isGeekMode ? 'shadow-[0_0_40px_rgba(6,182,212,0.4)]' : 'shadow-xl shadow-blue-500/20',
      gradient: 'from-cyan-400 to-blue-500',
    },
    mobile: {
      border: isGeekMode
        ? 'from-purple-400/50 via-pink-400/50 to-purple-400/50'
        : 'from-purple-400/40 via-purple-500/40 to-purple-400/40',
      glow: isGeekMode ? 'shadow-[0_0_40px_rgba(168,85,247,0.4)]' : 'shadow-xl shadow-purple-500/20',
      gradient: 'from-purple-400 to-pink-500',
    },
    fullstack: {
      border: isGeekMode
        ? 'from-green-400/50 via-emerald-400/50 to-green-400/50'
        : 'from-green-400/40 via-green-500/40 to-green-400/40',
      glow: isGeekMode ? 'shadow-[0_0_40px_rgba(16,185,129,0.4)]' : 'shadow-xl shadow-green-500/20',
      gradient: 'from-green-400 to-emerald-500',
    },
  };

  const colors = projectTypeColors[project.type as keyof typeof projectTypeColors] || projectTypeColors.web;

  return (
    <motion.div
      id={`project-${project.id}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className="relative group cursor-pointer"
      animate={{
        boxShadow: isHighlighted 
          ? isGeekMode
            ? '0 0 0 4px rgba(6, 182, 212, 0.6), 0 0 60px rgba(6, 182, 212, 0.4)'
            : '0 0 0 4px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.4)'
          : '0 0 0 0px transparent'
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Tarjeta Principal */}
      <motion.div
        className={`
          relative overflow-hidden
          rounded-2xl
          ${isGeekMode ? 'bg-glass-white/5' : 'bg-white/95'}
          backdrop-blur-xl
          border border-transparent
          transition-all duration-500
          ${isHovered ? colors.glow : 'shadow-lg shadow-black/5'}
        `}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Borde animado con gradiente */}
        <div
          className={`
            absolute inset-0 rounded-2xl
            bg-gradient-to-r ${colors.border}
            opacity-0 group-hover:opacity-100
            transition-opacity duration-500
            -z-10
          `}
          style={{
            padding: '1px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Imagen del Proyecto con Zoom */}
        <div className="relative aspect-video overflow-hidden bg-gray-900">
          <motion.div
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
            }}
            className="w-full h-full"
          >
            {/* Placeholder gradient background */}
            <div
              className={`
                w-full h-full
                bg-gradient-to-br ${colors.gradient}
                opacity-20
              `}
            />

            {/* Icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl opacity-10 filter blur-sm">
                {getTechIcon(project.tags[0] || 'default')}
              </span>
            </div>

            {/* Overlay gradient on hover */}
            <motion.div
              animate={{
                opacity: isHovered ? 0.3 : 0,
              }}
              transition={{ duration: 0.4 }}
              className={`
                absolute inset-0
                bg-gradient-to-t from-black/80 via-black/40 to-transparent
              `}
            />
          </motion.div>

          {/* Tags flotantes (Estado + Tipo) */}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                px-3 py-1 rounded-full
                backdrop-blur-md
                ${isGeekMode ? 'bg-white/10' : 'bg-white/90'}
                border border-white/20
                text-xs font-medium
                ${isGeekMode ? 'text-white' : 'text-gray-800'}
              `}
            >
              {project.status === 'published' ? '✨ Live' : '🚧 In Progress'}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.1 }}
              className={`
                px-3 py-1 rounded-full
                backdrop-blur-md
                bg-gradient-to-r ${colors.gradient}
                text-white text-xs font-medium
              `}
            >
              {project.type}
            </motion.div>
          </div>

          {/* Links de acción (aparecen en hover) */}
          <motion.div
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 20,
            }}
            transition={{ duration: 0.3 }}
            className="absolute top-4 right-4 flex gap-2 z-10"
          >
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver demo de ${project.title}`}
                className={`
                  p-2 rounded-full
                  backdrop-blur-md
                  ${isGeekMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white/90 hover:bg-white'}
                  border border-white/20
                  transition-colors duration-200
                `}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={16} className={isGeekMode ? 'text-white' : 'text-gray-800'} />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver código en GitHub de ${project.title}`}
                className={`
                  p-2 rounded-full
                  backdrop-blur-md
                  ${isGeekMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white/90 hover:bg-white'}
                  border border-white/20
                  transition-colors duration-200
                `}
                onClick={(e) => e.stopPropagation()}
              >
                <Github size={16} className={isGeekMode ? 'text-white' : 'text-gray-800'} />
              </a>
            )}
          </motion.div>
        </div>

        {/* Contenido - Slide Up on Hover */}
        <motion.div
          animate={{
            y: isHovered ? 0 : 20,
            opacity: isHovered ? 1 : 0.8,
          }}
          transition={{
            duration: 0.4,
            ease: 'easeOut',
          }}
          className="p-6 space-y-4"
          style={{
            transform: 'translateZ(50px)',
          }}
        >
          {/* Título y Descripción */}
          <div className="space-y-2">
            <h3
              className={`
                text-xl font-display font-bold
                ${isGeekMode ? 'text-white' : 'text-gray-900'}
                line-clamp-1
              `}
            >
              {project.title}
            </h3>

            <p
              className={`
                text-sm font-light leading-relaxed
                ${isGeekMode ? 'text-gray-300' : 'text-gray-600'}
                line-clamp-2
              `}
            >
              {project.description}
            </p>
          </div>

          {/* Tecnologías */}
          <motion.div
            animate={{
              opacity: isHovered ? 1 : 0.6,
            }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap gap-2"
          >
            {project.tags.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className={`
                  inline-flex items-center gap-1
                  px-3 py-1 rounded-full
                  backdrop-blur-md
                  ${isGeekMode ? 'bg-white/5' : 'bg-gray-100/80'}
                  border border-white/10
                  text-xs font-medium
                  ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}
                  transition-all duration-200
                  hover:scale-105
                `}
              >
                <span>{getTechIcon(tech)}</span>
                {tech}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span
                className={`
                  px-3 py-1 rounded-full
                  backdrop-blur-md
                  ${isGeekMode ? 'bg-white/5' : 'bg-gray-100/80'}
                  border border-white/10
                  text-xs font-medium
                  ${isGeekMode ? 'text-gray-400' : 'text-gray-500'}
                `}
              >
                +{project.tags.length - 4}
              </span>
            )}
          </motion.div>

          {/* Barra de progreso (si está en desarrollo) */}
          {project.status === 'draft' && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: isHovered ? 1 : 0.6, scaleX: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <div className="flex justify-between text-xs">
                <span className={isGeekMode ? 'text-gray-400' : 'text-gray-500'}>
                  En desarrollo
                </span>
                <span className={`font-medium ${isGeekMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                  75%
                </span>
              </div>
              <div className="h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${colors.gradient}`}
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Brillo de seguimiento del mouse (Geek Mode) */}
        {isGeekMode && isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(600px circle at ${mouseX.get() * 100 + 50}% ${
                mouseY.get() * 100 + 50
              }%, rgba(6, 182, 212, 0.1), transparent 40%)`,
            }}
          />
        )}
      </motion.div>

      {/* Sombra 3D profunda */}
      <div
        className={`
          absolute inset-0 -z-20 rounded-2xl
          ${isGeekMode ? 'bg-gradient-to-br from-cyan-500/10 to-purple-500/10' : 'bg-gray-200'}
          blur-2xl
          transition-all duration-500
          ${isHovered ? 'opacity-60 scale-105' : 'opacity-30 scale-95'}
        `}
        style={{
          transform: 'translateZ(-50px)',
        }}
      />
    </motion.div>
  );
};
