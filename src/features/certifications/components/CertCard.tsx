import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, Code2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../../hooks';

/**
 * CertCard Component - Futuristic ID Card / Credential Style
 * 
 * 🎨 DISEÑO GLASSMORPHISM PREMIUM:
 * - Fondo translúcido con backdrop-blur intenso
 * - Efecto holográfico con pseudo-elemento ::before (CSS puro, 0 CPU)
 * - Logos oficiales de emisores desde CDN
 * - Badges de categoría con colores neón suaves
 * - Killer Feature: Botón "Theory → Practice" si tiene proyecto vinculado
 * 
 * ⚡ PERFORMANCE:
 * - Hover holográfico usa CSS transform (aceleración GPU)
 * - will-change: transform en el brillo
 * - Sin animaciones JS costosas
 */

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  category: 'Event' | 'Study' | 'Competition';
  credential_url: string | null;
  related_project_id: string | null;
  related_project_title?: string;
}

interface CertCardProps {
  certification: Certification;
  index: number;
  relatedProjectTitle?: string;
}

// Función para navegar suavemente al proyecto relacionado
const scrollToProject = (projectId: string) => {
  // Actualizar hash para trigger del highlight
  window.location.hash = `project-${projectId}`;
  
  // Scroll suave al elemento
  const element = document.getElementById(`project-${projectId}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

export const CertCard: React.FC<CertCardProps> = ({ 
  certification, 
  index,
  relatedProjectTitle 
}) => {
  const { isGeekMode } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // 🎨 Estilos por categoría (Neón suave)
  const categoryStyles = {
    Event: {
      badge: 'from-cyan-400/90 to-blue-500/90',
      border: 'border-cyan-400/30',
      glow: 'shadow-[0_0_24px_rgba(6,182,212,0.4)]',
      icon: Sparkles,
      label: 'Evento',
      textColor: 'text-cyan-400',
    },
    Study: {
      badge: 'from-purple-400/90 to-pink-500/90',
      border: 'border-purple-400/30',
      glow: 'shadow-[0_0_24px_rgba(168,85,247,0.4)]',
      icon: Award,
      label: 'Certificación',
      textColor: 'text-purple-400',
    },
    Competition: {
      badge: 'from-rose-400/90 to-orange-500/90',
      border: 'border-rose-400/30',
      glow: 'shadow-[0_0_24px_rgba(251,113,133,0.4)]',
      icon: CheckCircle2,
      label: 'Competencia',
      textColor: 'text-rose-400',
    },
  };

  const style = categoryStyles[certification.category];

  // Logo del issuer (oficial o placeholder)
  const getIssuerLogo = (issuer: string): string => {
    const logos: Record<string, string> = {
      'Amazon AWS': 'https://cdn.simpleicons.org/amazonaws/FF9900',
      'AWS': 'https://cdn.simpleicons.org/amazonaws/FF9900',
      'Google': 'https://cdn.simpleicons.org/google/4285F4',
      'Microsoft': 'https://cdn.simpleicons.org/microsoft/5E5E5E',
      'Udemy': 'https://cdn.simpleicons.org/udemy/A435F0',
      'Platzi': 'https://cdn.simpleicons.org/platzi/98CA3F',
      'Coursera': 'https://cdn.simpleicons.org/coursera/0056D2',
      'edX': 'https://cdn.simpleicons.org/edx/02262B',
      'Meta': 'https://cdn.simpleicons.org/meta/0668E1',
      'LinkedIn': 'https://cdn.simpleicons.org/linkedin/0A66C2',
      'Globant': 'https://cdn.simpleicons.org/globant/C4D600',
      'GitHub': 'https://cdn.simpleicons.org/github/FFFFFF',
      'Oracle': 'https://cdn.simpleicons.org/oracle/F80000',
    };
    
    return logos[issuer] || 'https://cdn.simpleicons.org/certificate/FFFFFF';
  };

  // Formatear fecha (MM/YYYY)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { month: '2-digit', year: 'numeric' });
  };

  const CategoryIcon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-full"
    >
      {/* ✨ Card Principal - ID Card Futurista */}
      <motion.div
        animate={{
          y: isHovered ? -8 : 0,
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`
          relative h-full overflow-hidden
          rounded-2xl
          backdrop-blur-xl
          ${isGeekMode ? 'bg-slate-900/50 border-2 border-white/10' : 'bg-white/95 border-2 border-gray-200'}
          transition-all duration-500
          ${isHovered ? style.border + ' ' + style.glow : ''}
          ${isHovered ? 'shadow-2xl' : 'shadow-lg'}
          flex flex-col
        `}
      >
        {/* 🌈 EFECTO HOLOGRÁFICO (CSS Puro - 0 CPU) */}
        <div 
          className={`
            absolute inset-0 opacity-0 group-hover:opacity-100
            transition-opacity duration-700
            pointer-events-none overflow-hidden
          `}
        >
          <div 
            className={`
              absolute inset-0 
              bg-gradient-to-r from-transparent via-white/20 to-transparent
              -translate-x-full group-hover:translate-x-full
              transition-transform duration-1000 ease-out
              skew-x-12
            `}
            style={{ willChange: 'transform' }}
          />
        </div>

        {/* Header: Logo Issuer + Badge */}
        <div className="relative z-10 p-6 pb-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            {/* Logo del Emisor en círculo blanco para contraste */}
            <motion.div
              whileHover={{ scale: 1.08, rotate: 5 }}
              className="flex-shrink-0 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center p-2 border-2 border-gray-100"
            >
              <img 
                src={getIssuerLogo(certification.issuer)}
                alt={`${certification.issuer} logo`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain"
              />
            </motion.div>

            {/* Badge de Categoría */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              className={`
                px-3 py-1.5 rounded-full 
                bg-gradient-to-r ${style.badge}
                backdrop-blur-sm
                text-white text-xs font-bold uppercase tracking-wide
                flex items-center gap-1.5 shadow-lg
                border border-white/20
                flex-shrink-0
              `}
            >
              <CategoryIcon size={12} strokeWidth={2.5} />
              <span>{style.label}</span>
            </motion.div>
          </div>

          {/* Issuer Name + Título en la misma sección */}
          <div className="space-y-2">
            <p className={`text-sm font-semibold ${isGeekMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {certification.issuer}
            </p>
            
            {/* Título de la Certificación - Más prominente */}
            <h3 className={`
              text-xl font-bold leading-tight
              ${isGeekMode ? 'text-white' : 'text-gray-900'}
            `}>
              {certification.title}
            </h3>
          </div>

          {/* Fecha */}
          <div className="flex items-center gap-1.5 mt-3">
            <Calendar size={14} className={isGeekMode ? 'text-gray-500' : 'text-gray-400'} />
            <span className={`text-xs font-medium ${isGeekMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {formatDate(certification.issue_date)}
            </span>
          </div>
        </div>

        {/* Footer: Credential URL */}
        <div className="relative z-10 p-6 pt-4 border-t border-white/10">
          {certification.credential_url && (
            <motion.a
              href={certification.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, x: 3 }}
              whileTap={{ scale: 0.97 }}
              className={`
                inline-flex items-center gap-2 text-sm font-semibold
                ${isGeekMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'}
                transition-colors duration-200
              `}
            >
              <ExternalLink size={16} />
              <span>Ver credencial</span>
            </motion.a>
          )}
        </div>

        {/* 🔗 KILLER FEATURE: Theory → Practice Connection */}
        {relatedProjectTitle && certification.related_project_id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="relative z-10 px-6 pb-6"
          >
            <motion.button
              onClick={() => scrollToProject(certification.related_project_id!)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full relative overflow-hidden
                flex items-center gap-4 px-5 py-4 rounded-xl
                cursor-pointer group/link
                ${isGeekMode 
                  ? 'bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-2 border-cyan-400/30 hover:border-cyan-400/60' 
                  : 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 hover:border-blue-400'
                }
                transition-all duration-300
              `}
            >
              {/* Glow en hover */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className={`absolute inset-0 bg-gradient-to-r ${style.badge} opacity-5`}
              />

              {/* Icono */}
              <div className={`
                relative z-10 w-11 h-11 rounded-lg flex items-center justify-center
                ${isGeekMode ? 'bg-white/10' : 'bg-white shadow-sm'}
                group-hover/link:scale-110 transition-transform duration-300
              `}>
                <Code2 size={20} className={style.textColor} />
              </div>

              {/* Texto */}
              <div className="relative z-10 flex-1">
                <p className={`text-xs font-medium uppercase tracking-wide ${isGeekMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  Applied in Practice
                </p>
                <p className={`text-sm font-bold ${isGeekMode ? 'text-white' : 'text-gray-900'}`}>
                  {relatedProjectTitle}
                </p>
              </div>

              {/* Arrow animado */}
              <motion.div
                animate={{ x: isHovered ? [0, 6, 0] : 0 }}
                transition={{ duration: 1.2, repeat: isHovered ? Infinity : 0 }}
                className="relative z-10"
              >
                <ExternalLink size={18} className={style.textColor} />
              </motion.div>
            </motion.button>
          </motion.div>
        )}

        {/* Borde brillante interno (sutil) */}
        <div className={`
          absolute inset-0 rounded-2xl pointer-events-none
          ${isGeekMode ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-white/50 to-transparent'}
          opacity-0 group-hover:opacity-100 transition-opacity duration-500
        `} />
      </motion.div>

      {/* Sombra profunda (Geek Mode) */}
      {isGeekMode && (
        <motion.div
          animate={{
            opacity: isHovered ? 0.2 : 0.08,
            scale: isHovered ? 1.02 : 0.98,
          }}
          transition={{ duration: 0.4 }}
          className={`
            absolute inset-0 -z-10 rounded-2xl
            bg-gradient-to-br ${style.badge}
            blur-2xl
          `}
        />
      )}
    </motion.div>
  );
};
