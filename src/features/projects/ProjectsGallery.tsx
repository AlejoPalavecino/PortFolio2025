import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { ProjectCard } from './components/ProjectCard';
import { useProjects, type Project } from '../../hooks/useProjects';
import { useTheme } from '../../hooks';

/**
 * ProjectsGallery Component - High-End Edition
 * 
 * Características Awwwards:
 * - Scroll Parallax: Filas con movimiento diferencial
 * - FilterTabs minimalista con línea animada
 * - Integración con ProjectCard 3D Tilt
 * - Animaciones de entrada con rotación
 * - Glassmorphism ultra refinado
 */

type FilterType = 'all' | string;

export const ProjectsGallery: React.FC = () => {
  const { isGeekMode } = useTheme();
  const { projects, loading, error } = useProjects();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const sectionRef = useRef<HTMLElement>(null);
  
  // Scroll tracking para parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Diferentes velocidades de parallax para crear profundidad
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [150, -150]);

  // Extraer tecnologías únicas de todos los proyectos
  const availableTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach(project => {
      project.tags.forEach(tag => techSet.add(tag));
    });
    return Array.from(techSet).sort();
  }, [projects]);

  // Filtrado de proyectos
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    if (selectedFilter !== 'all') {
      filtered = filtered.filter((project: Project) =>
        project.tags.some((tag: string) => tag === selectedFilter)
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((project: Project) =>
        project.title.toLowerCase().includes(query) ||
        project.short_description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [projects, selectedFilter, searchQuery]);

  // Organizar proyectos en filas para parallax
  const projectRows = useMemo(() => {
    const rows: Array<typeof filteredProjects> = [];
    for (let i = 0; i < filteredProjects.length; i += 3) {
      rows.push(filteredProjects.slice(i, i + 3));
    }
    return rows;
  }, [filteredProjects]);

  return (
    <section 
      ref={sectionRef}
      id="portfolio" 
      className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background decorativo */}
      {isGeekMode && (
        <>
          <motion.div 
            className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"
            style={{ y: y1 }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"
            style={{ y: y2 }}
          />
        </>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-400">Cargando proyectos...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center text-red-400">
              <p>❌ Error al cargar proyectos</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
        {/* Header con animación de entrada */}
        <motion.div
          initial={{ opacity: 0, y: -40, rotateX: -15 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="text-center mb-16 space-y-4"
          style={{ perspective: 1000 }}
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
            Trabajos Seleccionados
          </h2>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Una colección de aplicaciones que resuelven problemas reales. Filtrado por tecnología.
          </motion.p>
        </motion.div>

        {/* Search Bar - Glassmorphism Premium */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12 max-w-xl mx-auto"
        >
          <GlassCard variant="strong" hover={false} className="p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar proyectos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 font-light"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </motion.div>

        {/* FilterTabs - Minimal con línea animada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex flex-wrap justify-center gap-2 relative">
            {/* Tab: All */}
            <motion.button
              onClick={() => setSelectedFilter('all')}
              className={`
                relative px-6 py-3 text-sm font-medium
                transition-colors duration-300
                ${
                  selectedFilter === 'all'
                    ? isGeekMode
                      ? 'text-cyan-400'
                      : 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Todos
              {selectedFilter === 'all' && (
                <motion.div
                  layoutId="activeTab"
                  className={`
                    absolute bottom-0 left-0 right-0 h-0.5
                    ${isGeekMode ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-blue-600'}
                  `}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </motion.button>

            {/* Tabs de Tecnologías */}
            {availableTechnologies.slice(0, 5).map((tech) => (
              <motion.button
                key={tech}
                onClick={() => setSelectedFilter(tech)}
                className={`
                  relative px-6 py-3 text-sm font-medium
                  transition-colors duration-300
                  ${
                    selectedFilter === tech
                      ? isGeekMode
                        ? 'text-cyan-400'
                        : 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tech}
                {selectedFilter === tech && (
                  <motion.div
                    layoutId="activeTab"
                    className={`
                      absolute bottom-0 left-0 right-0 h-0.5
                      ${isGeekMode ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-blue-600'}
                    `}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid con Parallax por filas */}
        <AnimatePresence mode="wait">
          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <p className="text-lg text-gray-500 dark:text-gray-400 font-light">
                No se encontraron proyectos 😢
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={selectedFilter + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {projectRows.map((row, rowIndex) => {
                // Asignar parallax diferente a cada fila
                const parallaxY = rowIndex % 3 === 0 ? y1 : rowIndex % 3 === 1 ? y2 : y3;

                return (
                  <motion.div
                    key={`row-${rowIndex}`}
                    style={{ y: parallaxY }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {row.map((project: Project, projectIndex: number) => {
                      const absoluteIndex = rowIndex * 3 + projectIndex;
                      
                      return (
                        <motion.div
                          key={project.id}
                          initial={{
                            opacity: 0,
                            y: 60,
                            rotateX: 20,
                          }}
                          whileInView={{
                            opacity: 1,
                            y: 0,
                            rotateX: 0,
                          }}
                          viewport={{ once: true, margin: '-100px' }}
                          transition={{
                            duration: 0.7,
                            delay: projectIndex * 0.15,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                          style={{ perspective: 1000 }}
                        >
                          <ProjectCard 
                            project={project} 
                            index={absoluteIndex}
                          />
                        </motion.div>
                      );
                    })}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Estadísticas al final */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 text-center"
        >
          <GlassCard variant="strong" className="inline-block px-8 py-6">
            <div className="flex flex-wrap justify-center gap-12">
              <div>
                <p className={`text-4xl font-display font-bold ${isGeekMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                  {projects.length}+
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Proyectos totales
                </p>
              </div>
              <div>
                <p className={`text-4xl font-display font-bold ${isGeekMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  {availableTechnologies.length}+
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Tecnologías usadas
                </p>
              </div>
              <div>
                <p className={`text-4xl font-display font-bold ${isGeekMode ? 'text-pink-400' : 'text-pink-600'}`}>
                  {projects.filter(p => p.is_featured).length}+
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Destacados
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
          </>
        )}
      </div>
    </section>
  );
};
