import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Award, Trophy, Code2 } from 'lucide-react';
import { useTheme } from '../../hooks';
import { CertCard } from './components';
import { useCertifications } from '../../hooks/useCertifications';

/**
 * CertificationsVault Component - Premium Achievement Vault
 * 
 * 🏆 DISEÑO GLASSMORPHISM ELEGANTE:
 * - Título premium con gradiente y shield icon animado
 * - Estadísticas visuales de logros (Total, Eventos, Estudios, etc.)
 * - Grid responsivo de credenciales tipo ID Card futurista
 * - StaggerChildren para aparición secuencial suave
 * - Killer Feature: Muestra qué certificaciones tienen proyectos relacionados
 * 
 * ⚡ PERFORMANCE:
 * - useMemo para cálculos de estadísticas
 * - Mapeo eficiente de proyectos relacionados
 */

export const CertificationsVault: React.FC = () => {
  const { isGeekMode } = useTheme();
  const { certifications, loading, error, statistics } = useCertifications();

  // Mapear certificaciones con título del proyecto relacionado
  const certificationsWithProjects = useMemo(() => {
    return certifications.map(cert => ({
      ...cert,
      relatedProjectTitle: cert.related_project_title,
    }));
  }, [certifications]);

  // Estadísticas (ya vienen del hook)
  const stats = useMemo(() => ({
    total: statistics.total,
    events: statistics.byCategory.Event,
    studies: statistics.byCategory.Study,
    competitions: statistics.byCategory.Competition,
    withProjects: statistics.withProjects,
  }), [statistics]);

  return (
    <section id="certs" className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decorativo */}
      {isGeekMode && (
        <>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
        </>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header con animación */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Icono Hero */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
              delay: 0.2,
            }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div
              className={`
                relative
                w-20 h-20 rounded-2xl
                flex items-center justify-center
                backdrop-blur-md
                ${
                  isGeekMode
                    ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400/30'
                    : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-500/30 shadow-xl'
                }
              `}
            >
              <Shield size={40} className={isGeekMode ? 'text-cyan-400' : 'text-blue-600'} />

              {/* Partículas decorativas */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={`
                  absolute inset-0 rounded-2xl
                  ${isGeekMode ? 'bg-cyan-400' : 'bg-blue-500'}
                  opacity-20 blur-xl
                `}
              />
            </div>
          </motion.div>

          {/* Título */}
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
            Aprendizaje Continuo
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light"
          >
            {isGeekMode
              ? '🎯 Validación teórica aplicada en proyectos prácticos'
              : 'Certificaciones profesionales y competencias verificadas'
            }
          </motion.p>
        </motion.div>

        {/* 📊 Estadísticas - Achievement Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <div
            className={`
              grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6
              p-6 md:p-8 rounded-2xl
              backdrop-blur-xl
              ${
                isGeekMode
                  ? 'bg-slate-900/50 border-2 border-white/10'
                  : 'bg-white/90 border-2 border-gray-200 shadow-xl'
              }
            `}
          >
            {/* Total */}
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              className="text-center"
            >
              <div className={`text-4xl font-bold mb-2 ${isGeekMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.total}
              </div>
              <div className={`text-sm font-medium ${isGeekMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total
              </div>
            </motion.div>

            {/* Eventos */}
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              className="text-center"
            >
              <div className={`text-4xl font-bold mb-2 ${isGeekMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                <Sparkles className="inline-block mb-1" size={32} />
              </div>
              <div className={`text-sm font-medium ${isGeekMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {stats.events} Eventos
              </div>
            </motion.div>

            {/* Estudios */}
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              className="text-center"
            >
              <div className={`text-4xl font-bold mb-2 ${isGeekMode ? 'text-purple-400' : 'text-purple-600'}`}>
                <Award className="inline-block mb-1" size={32} />
              </div>
              <div className={`text-sm font-medium ${isGeekMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {stats.studies} Certificados
              </div>
            </motion.div>

            {/* Competencias */}
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              className="text-center"
            >
              <div className={`text-4xl font-bold mb-2 ${isGeekMode ? 'text-rose-400' : 'text-rose-600'}`}>
                <Trophy className="inline-block mb-1" size={32} />
              </div>
              <div className={`text-sm font-medium ${isGeekMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {stats.competitions} Premios
              </div>
            </motion.div>

            {/* Aplicados */}
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              className="text-center col-span-2 md:col-span-1"
            >
              <div className={`text-4xl font-bold mb-2 ${isGeekMode ? 'text-emerald-400' : 'text-green-600'}`}>
                <Code2 className="inline-block mb-1" size={32} />
              </div>
              <div className={`text-sm font-medium ${isGeekMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {stats.withProjects} Aplicados
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-400">Cargando certificaciones...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center text-red-400">
              <p>❌ Error al cargar certificaciones</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          </div>
        )}

        {/* 🎴 Grid de Certificaciones con StaggerChildren */}
        {!loading && !error && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {certificationsWithProjects.map((cert, index) => (
            <CertCard
              key={cert.id}
              certification={cert}
              index={index}
              relatedProjectTitle={cert.relatedProjectTitle}
            />
          ))}
        </motion.div>
        )}

        {/* Empty State (si no hay certificaciones) */}
        {!loading && !error && certifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Shield size={64} className={`mx-auto mb-4 ${isGeekMode ? 'text-gray-700' : 'text-gray-300'}`} />
            <p className={`text-lg ${isGeekMode ? 'text-gray-500' : 'text-gray-600'}`}>
              No hay certificaciones disponibles aún
            </p>
          </motion.div>
        )}

        {/* Call to Action final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <motion.p
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-sm text-gray-500 dark:text-gray-400 font-light"
          >
            💡 Las credenciales vinculadas con proyectos muestran conocimiento aplicado en la práctica
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
