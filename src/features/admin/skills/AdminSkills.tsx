import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Loader2, X, Save } from 'lucide-react';
import { useSkills } from '@/hooks/useSkills';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/hooks';
import type { SkillCategory } from '@/types/supabase';

/**
 * AdminSkills - Vista de gestión de habilidades
 * 
 * Características:
 * - Lista todas las skills desde Supabase
 * - Modal para crear/editar
 * - Ordenadas por proficiency
 * - Validación de URLs de SimpleIcons
 */

interface SkillFormData {
  name: string;
  icon_url: string;
  category: SkillCategory;
  proficiency: number;
}

const CATEGORIES: SkillCategory[] = ['Frontend', 'Backend', 'Tools', 'Soft'];

export const AdminSkills: React.FC = () => {
  const { isGeekMode } = useTheme();
  const { skills, loading, error, refetch } = useSkills();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<SkillFormData>({
    name: '',
    icon_url: '',
    category: 'Frontend',
    proficiency: 50,
  });

  // Filtrar skills por búsqueda
  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal para crear
  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      icon_url: '',
      category: 'Frontend',
      proficiency: 50,
    });
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (skill: typeof skills[0]) => {
    setEditingId(skill.name); // Usamos name como ID temporal
    setFormData({
      name: skill.name,
      icon_url: skill.logo,
      category: skill.category,
      proficiency: skill.proficiency,
    });
    setIsModalOpen(true);
  };

  // Guardar (crear o actualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        // Actualizar
        const { error } = await supabase
          .from('skills')
          .update({
            name: formData.name,
            icon_url: formData.icon_url,
            category: formData.category,
            proficiency: formData.proficiency,
          })
          .eq('name', editingId);

        if (error) throw error;
        console.log('✅ Skill actualizada');
      } else {
        // Crear
        const { error } = await supabase
          .from('skills')
          .insert({
            name: formData.name,
            icon_url: formData.icon_url,
            category: formData.category,
            proficiency: formData.proficiency,
          });

        if (error) throw error;
        console.log('✅ Skill creada');
      }

      await refetch();
      setIsModalOpen(false);
    } catch (err) {
      console.error('❌ Error al guardar skill:', err);
      alert('Error al guardar. Revisa la consola.');
    } finally {
      setSubmitting(false);
    }
  };

  // Eliminar
  const handleDelete = async (skillName: string) => {
    if (!confirm(`¿Eliminar "${skillName}"? Esto también eliminará sus relaciones con proyectos.`)) return;

    setDeletingId(skillName);
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('name', skillName);

      if (error) throw error;
      console.log('✅ Skill eliminada');
      await refetch();
    } catch (err) {
      console.error('❌ Error al eliminar:', err);
      alert('Error al eliminar. Revisa la consola.');
    } finally {
      setDeletingId(null);
    }
  };

  if (error) {
    return (
      <div className={`rounded-xl p-6 border ${isGeekMode ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-red-50 border-red-200 text-red-800'}`}>
        <h3 className="font-bold mb-2">Error al cargar skills</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className={`text-3xl font-display font-bold ${isGeekMode ? 'text-white' : 'text-gray-900'}`}>
            Gestión de Habilidades
          </h1>
          <p className={`text-sm ${isGeekMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            {skills.length} habilidades registradas
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreate}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
            ${isGeekMode ? 'bg-cyan-500 hover:bg-cyan-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}
          `}
        >
          <Plus className="w-5 h-5" />
          Nueva Habilidad
        </motion.button>
      </div>

      {/* Búsqueda */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isGeekMode ? 'text-gray-500' : 'text-gray-400'}`} />
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`
            w-full pl-10 pr-4 py-3 rounded-lg border transition-colors
            ${isGeekMode 
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
            }
            focus:ring-2 focus:ring-opacity-20
          `}
        />
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        </div>
      ) : (
        <div className={`rounded-xl border overflow-hidden ${isGeekMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isGeekMode ? 'bg-gray-900' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isGeekMode ? 'text-gray-400' : 'text-gray-700'}`}>
                    Habilidad
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isGeekMode ? 'text-gray-400' : 'text-gray-700'}`}>
                    Categoría
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isGeekMode ? 'text-gray-400' : 'text-gray-700'}`}>
                    Proficiency
                  </th>
                  <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${isGeekMode ? 'text-gray-400' : 'text-gray-700'}`}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredSkills.map((skill) => (
                  <tr key={skill.name} className={`transition-colors ${isGeekMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={skill.logo} alt={skill.name} className="w-8 h-8 object-contain" />
                        <span className={`font-medium ${isGeekMode ? 'text-white' : 'text-gray-900'}`}>
                          {skill.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        skill.category === 'Frontend' ? 'bg-blue-500/20 text-blue-400' :
                        skill.category === 'Backend' ? 'bg-green-500/20 text-green-400' :
                        skill.category === 'Tools' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-pink-500/20 text-pink-400'
                      }`}>
                        {skill.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-2 max-w-[100px]">
                          <div 
                            className="bg-cyan-400 h-2 rounded-full transition-all"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${isGeekMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {skill.proficiency}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(skill)}
                          className={`p-2 rounded-lg transition-colors ${isGeekMode ? 'hover:bg-gray-700 text-gray-400 hover:text-cyan-400' : 'hover:bg-gray-100 text-gray-600 hover:text-blue-600'}`}
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.name)}
                          disabled={deletingId === skill.name}
                          className={`p-2 rounded-lg transition-colors ${isGeekMode ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400' : 'hover:bg-gray-100 text-gray-600 hover:text-red-600'}`}
                          title="Eliminar"
                        >
                          {deletingId === skill.name ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredSkills.length === 0 && (
              <div className="text-center py-12">
                <p className={isGeekMode ? 'text-gray-500' : 'text-gray-400'}>
                  No se encontraron habilidades
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-md rounded-xl p-6 ${isGeekMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${isGeekMode ? 'text-white' : 'text-gray-900'}`}>
                {editingId ? 'Editar Habilidad' : 'Nueva Habilidad'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`p-2 rounded-lg ${isGeekMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${isGeekMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  placeholder="ej: React"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  URL del Icono (SimpleIcons)
                </label>
                <input
                  type="url"
                  required
                  value={formData.icon_url}
                  onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${isGeekMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  placeholder="https://cdn.simpleicons.org/react/61DAFB"
                />
                {formData.icon_url && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={formData.icon_url} alt="Preview" className="w-8 h-8 object-contain" />
                    <span className="text-xs text-gray-500">Vista previa</span>
                  </div>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as SkillCategory })}
                  className={`w-full px-3 py-2 rounded-lg border ${isGeekMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  aria-label="Category"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Proficiency: {formData.proficiency}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.proficiency}
                  onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
                  className="w-full"
                  aria-label="Proficiency slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Principiante</span>
                  <span>Experto</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${isGeekMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium ${isGeekMode ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Guardar
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
