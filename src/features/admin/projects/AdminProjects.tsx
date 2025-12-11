import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Star, ExternalLink, Search, Loader2 } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/hooks';

/**
 * AdminProjects - Vista de gestión de proyectos
 * 
 * Características:
 * - Lista todos los proyectos desde Supabase
 * - Búsqueda y filtrado
 * - Acciones: Crear, Editar, Eliminar
 * - Toggle de "Featured"
 * - Navegación a formulario de edición
 */

export const AdminProjects: React.FC = () => {
  const navigate = useNavigate();
  const { isGeekMode } = useTheme();
  const { projects, loading, error, refetch } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingFeaturedId, setTogglingFeaturedId] = useState<string | null>(null);

  // Filtrar proyectos por búsqueda
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handler para eliminar proyecto
  const handleDelete = async (projectId: string, projectTitle: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${projectTitle}"?`)) return;

    setDeletingId(projectId);
    try {
      // Las relaciones en project_skills se eliminan automáticamente por CASCADE
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      console.log('✅ Proyecto eliminado:', projectTitle);
      await refetch();
    } catch (err) {
      console.error('❌ Error al eliminar proyecto:', err);
      alert('Error al eliminar el proyecto. Revisa la consola.');
    } finally {
      setDeletingId(null);
    }
  };

  // Handler para toggle featured
  const handleToggleFeatured = async (projectId: string, currentValue: boolean) => {
    setTogglingFeaturedId(projectId);
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_featured: !currentValue })
        .eq('id', projectId);

      if (error) throw error;

      console.log('✅ Featured actualizado');
      await refetch();
    } catch (err) {
      console.error('❌ Error al actualizar featured:', err);
      alert('Error al actualizar. Revisa la consola.');
    } finally {
      setTogglingFeaturedId(null);
    }
  };

  if (error) {
    return (
      <div
        className={`
          rounded-xl p-6 border
          ${isGeekMode ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-red-50 border-red-200 text-red-800'}
        `}
      >
        <h3 className="font-bold mb-2">Error al cargar proyectos</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1
            className={`
              text-3xl font-display font-bold
              ${isGeekMode ? 'text-white' : 'text-gray-900'}
            `}
          >
            Gestión de Proyectos
          </h1>
          <p
            className={`
              mt-2 text-sm
              ${isGeekMode ? 'text-gray-400' : 'text-gray-600'}
            `}
          >
            Administra el portafolio de proyectos
          </p>
        </div>

        {/* Button: Nuevo Proyecto */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/admin/projects/new')}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg
            ${isGeekMode
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
            }
            text-white font-semibold shadow-lg
            transition-all duration-200
          `}
        >
          <Plus className="w-5 h-5" />
          Nuevo Proyecto
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`w-5 h-5 ${isGeekMode ? 'text-gray-500' : 'text-gray-400'}`} />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar proyectos por título o tecnología..."
          className={`
            block w-full pl-10 pr-3 py-3 rounded-lg
            ${isGeekMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-300'}
            border
            ${isGeekMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}
            focus:outline-none
            ${isGeekMode ? 'focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}
            transition-all duration-200
          `}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className={`w-8 h-8 animate-spin ${isGeekMode ? 'text-cyan-400' : 'text-blue-500'}`} />
        </div>
      )}

      {/* Projects Table */}
      {!loading && (
        <div
          className={`
            overflow-hidden rounded-xl border
            ${isGeekMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}
            shadow-lg
          `}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className={isGeekMode ? 'bg-white/5' : 'bg-gray-50'}>
                <tr>
                  <th
                    scope="col"
                    className={`
                      px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                      ${isGeekMode ? 'text-gray-400' : 'text-gray-500'}
                    `}
                  >
                    Proyecto
                  </th>
                  <th
                    scope="col"
                    className={`
                      px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                      ${isGeekMode ? 'text-gray-400' : 'text-gray-500'}
                    `}
                  >
                    Tecnologías
                  </th>
                  <th
                    scope="col"
                    className={`
                      px-6 py-3 text-center text-xs font-medium uppercase tracking-wider
                      ${isGeekMode ? 'text-gray-400' : 'text-gray-500'}
                    `}
                  >
                    Featured
                  </th>
                  <th
                    scope="col"
                    className={`
                      px-6 py-3 text-center text-xs font-medium uppercase tracking-wider
                      ${isGeekMode ? 'text-gray-400' : 'text-gray-500'}
                    `}
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody
                className={`
                  divide-y
                  ${isGeekMode ? 'divide-white/10' : 'divide-gray-200'}
                `}
              >
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <p className={`text-sm ${isGeekMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {searchTerm ? 'No se encontraron proyectos' : 'No hay proyectos aún'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr
                      key={project.id}
                      className={`
                        transition-colors
                        ${isGeekMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}
                      `}
                    >
                      {/* Proyecto Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {/* Cover Image */}
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                            <img
                              src={project.cover_image}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {/* Title & Links */}
                          <div>
                            <h3
                              className={`
                                font-semibold
                                ${isGeekMode ? 'text-white' : 'text-gray-900'}
                              `}
                            >
                              {project.title}
                            </h3>
                            <p
                              className={`
                                text-sm mt-1
                                ${isGeekMode ? 'text-gray-400' : 'text-gray-600'}
                              `}
                            >
                              {project.short_description.slice(0, 60)}...
                            </p>
                            {/* Links */}
                            <div className="flex gap-3 mt-2">
                              {project.demo_url && (
                                <a
                                  href={project.demo_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`
                                    text-xs flex items-center gap-1
                                    ${isGeekMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'}
                                  `}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  Demo
                                </a>
                              )}
                              {project.repo_url && (
                                <a
                                  href={project.repo_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`
                                    text-xs flex items-center gap-1
                                    ${isGeekMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'}
                                  `}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  Repo
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tags */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className={`
                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${isGeekMode
                                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                                  : 'bg-blue-100 text-blue-800'
                                }
                              `}
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className={`text-xs ${isGeekMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              +{project.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Featured Toggle */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(project.id, project.is_featured)}
                          disabled={togglingFeaturedId === project.id}
                          className={`
                            inline-flex items-center justify-center w-8 h-8 rounded-lg
                            transition-all duration-200
                            ${project.is_featured
                              ? isGeekMode
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-yellow-100 text-yellow-600'
                              : isGeekMode
                                ? 'bg-white/5 text-gray-600 hover:bg-white/10'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                        >
                          {togglingFeaturedId === project.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Star className={`w-4 h-4 ${project.is_featured ? 'fill-current' : ''}`} />
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
                            className={`
                              p-2 rounded-lg
                              ${isGeekMode
                                ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                              }
                              transition-colors
                            `}
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(project.id, project.title)}
                            disabled={deletingId === project.id}
                            className={`
                              p-2 rounded-lg
                              ${isGeekMode
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                              }
                              transition-colors
                              disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                            title="Eliminar"
                          >
                            {deletingId === project.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stats Footer */}
      {!loading && filteredProjects.length > 0 && (
        <div
          className={`
            rounded-xl p-4 border
            ${isGeekMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}
          `}
        >
          <div className="flex items-center justify-between text-sm">
            <span className={isGeekMode ? 'text-gray-400' : 'text-gray-600'}>
              Total: <strong className={isGeekMode ? 'text-white' : 'text-gray-900'}>{projects.length}</strong> proyectos
            </span>
            <span className={isGeekMode ? 'text-gray-400' : 'text-gray-600'}>
              Featured: <strong className={isGeekMode ? 'text-white' : 'text-gray-900'}>
                {projects.filter(p => p.is_featured).length}
              </strong>
            </span>
            {searchTerm && (
              <span className={isGeekMode ? 'text-gray-400' : 'text-gray-600'}>
                Mostrando: <strong className={isGeekMode ? 'text-white' : 'text-gray-900'}>{filteredProjects.length}</strong>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
