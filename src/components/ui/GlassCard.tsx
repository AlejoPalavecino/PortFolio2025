import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useTheme } from '../../hooks';

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, 'ref'> {
  children: React.ReactNode;
  variant?: 'default' | 'strong' | 'subtle';
  glow?: boolean;
  hover?: boolean;
  className?: string;
}

/**
 * GlassCard Component
 * 
 * Componente reutilizable con efecto glassmorphism:
 * - Backdrop blur para efecto de vidrio esmerilado
 * - Transparencias sutiles
 * - Bordes translúcidos
 * - Opcional: efecto glow en hover
 * 
 * Variantes:
 * - default: Balance entre transparencia y legibilidad
 * - strong: Más opaco, para contenido importante
 * - subtle: Muy translúcido, para elementos decorativos
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  glow = false,
  hover = true,
  className = '',
  ...motionProps
}) => {
  const { isGeekMode } = useTheme();

  const variantStyles = {
    default: isGeekMode
      ? 'bg-glass-white border-glass-border-light'
      : 'bg-white/70 border-gray-200/50',
    strong: isGeekMode
      ? 'bg-glass-white-20 border-glass-border-light'
      : 'bg-white/90 border-gray-300/60',
    subtle: isGeekMode
      ? 'bg-glass-white border-glass-border-light/50'
      : 'bg-white/50 border-gray-100/40',
  };

  const glowClass = glow && isGeekMode ? 'hover:shadow-glow-mixed' : '';
  const hoverClass = hover
    ? 'hover:scale-[1.02] hover:border-glass-border-light/80 transition-all duration-300'
    : '';

  return (
    <motion.div
      className={`
        backdrop-blur-xl
        ${variantStyles[variant]}
        border
        rounded-2xl
        ${glowClass}
        ${hoverClass}
        ${className}
      `}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

/**
 * GlassPanel Component
 * 
 * Variante de GlassCard para paneles más grandes (secciones completas)
 */
export const GlassPanel: React.FC<GlassCardProps> = ({
  children,
  className = '',
  ...props
}) => {
  const { isGeekMode } = useTheme();

  return (
    <GlassCard
      className={`
        p-8 md:p-12
        ${isGeekMode ? 'shadow-glass' : 'shadow-xl shadow-gray-200/50'}
        ${className}
      `}
      hover={false}
      {...props}
    >
      {children}
    </GlassCard>
  );
};

/**
 * GlassPill Component
 * 
 * Pequeñas píldoras de cristal para tags, badges, etc.
 */
interface GlassPillProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const GlassPill: React.FC<GlassPillProps> = ({
  children,
  className = '',
  glow = false,
}) => {
  const { isGeekMode } = useTheme();

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1.5
        backdrop-blur-md
        ${isGeekMode ? 'bg-glass-white border-glass-border-light' : 'bg-white/60 border-gray-200/40'}
        border
        rounded-full
        text-xs font-medium
        ${glow && isGeekMode ? 'hover:shadow-glow-cyan' : ''}
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </span>
  );
};
