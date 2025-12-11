import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, X, Upload, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSkills } from '@/hooks/useSkills';
import { useTheme } from '@/hooks';
import type { Project as DBProject } from '@/types/supabase';

/**
 * ProjectForm - Formulario completo para crear/editar proyectos
 * 
 * Características:
 * - Modo crear / editar según parámetros de ruta
 * - Upload de imágenes a Supabase Storage
 * - Selector múltiple de skills
 * - Validación de formulario
 * - Preview de imagen
 * - Generación automática de slug
 * - Gestión de relaciones project_skills
 */

interface ProjectFormData {
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  cover_image_url: string;
  demo_url: string;
  repo_url: string;
  is_featured: boolean;
  selectedSkills: string[]; // Array de skill IDs
}

export const ProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isGeekMode } = useTheme();
  const { skills } = useSkills();

  const isEditMode = !!id;

  // Estado del formulario
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    cover_image_url: '',
    demo_url: '',
    repo_url: '',
    is_featured: false,
    selectedSkills: [],
  });

  const [loading, setLoading] = useState(false);
  const [loadingProject, setLoadingProject] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Cargar proyecto si estamos en modo edición
  useEffect(() => {
    if (!isEditMode) return;

    const loadProject = async () => {
      try {
        console.log('🔍 [ProjectForm] Cargando proyecto para editar, ID:', id);

        // Obtener proyecto con sus skills
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            project_skills!inner (
              skill_id
            )
          `)
          .eq('id', id)
          .single() as any;

        console.log('📦 [ProjectForm] Data recibida:', data);

        if (error) throw error;

        // Extraer IDs de skills
        const skillIds = (data.project_skills as any[])?.map((ps) => ps.skill_id) || [];
        console.log('🔄 [ProjectForm] Skills extraídos:', skillIds);

        setFormData({
          title: data.title,
          slug: data.slug,
          short_description: data.short_description,
          full_description: data.full_description || '',
          cover_image_url: data.cover_image_url || '',
          demo_url: data.demo_url || '',
          repo_url: data.repo_url || '',
          is_featured: data.is_featured,
          selectedSkills: skillIds,
        });

        setImagePreview(data.cover_image_url);
      } catch (err) {
        console.error('❌ Error al cargar proyecto:', err);
        setError('Error al cargar el proyecto');
      } finally {
        setLoadingProject(false);
      }
    };

    loadProject();
  }, [id, isEditMode]);

  // Generar slug automático desde el título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  // Handler para cambios en inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Auto-generar slug cuando cambia el título
    if (name === 'title' && !isEditMode) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  // Handler para toggle de skills
  const handleSkillToggle = (skillId: string) => {
    console.log('🔄 [ProjectForm] Toggle skill, ID:', skillId);
    setFormData((prev) => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skillId)
        ? prev.selectedSkills.filter((id) => id !== skillId)
        : [...prev.selectedSkills, skillId],
    }));
  };

  // Handler para upload de imagen
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen');
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar 5MB');
      return;
    }

    setUploadingImage(true);
    setError(null);

    try {
      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      // Subir a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      setFormData((prev) => ({
        ...prev,
        cover_image_url: publicUrl,
      }));
      setImagePreview(publicUrl);

      console.log('✅ Imagen subida:', publicUrl);
    } catch (err: any) {
      console.error('❌ Error al subir imagen:', err);
      
      // Mensajes de error específicos
      if (err.message?.includes('Bucket not found')) {
        setError('Bucket "portfolio-assets" no existe. Créalo en Supabase Storage.');
      } else {
        setError(`Error al subir imagen: ${err.message}`);
      }
    } finally {
      setUploadingImage(false);
    }
  };

  // Handler para submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('💾 [ProjectForm] Guardando proyecto...', {
      isEditMode,
      formData,
    });

    try {
      // Validaciones
      if (!formData.title || !formData.slug || !formData.short_description) {
        throw new Error('Por favor completa los campos obligatorios');
      }

      if (formData.selectedSkills.length === 0) {
        throw new Error('Selecciona al menos una tecnología');
      }

      console.log('✅ [ProjectForm] Validaciones pasadas');

      // Preparar datos del proyecto
      const projectData: Partial<DBProject> = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        short_description: formData.short_description.trim(),
        full_description: formData.full_description.trim() || null,
        cover_image_url: formData.cover_image_url || null,
        demo_url: formData.demo_url.trim() || null,
        repo_url: formData.repo_url.trim() || null,
        is_featured: formData.is_featured,
      };

      let projectId: string;

      if (isEditMode) {
        // Actualizar proyecto existente
        const { data, error: updateError } = await supabase
          .from('projects')
          .update(projectData as Record<string, any>)
          .eq('id', id)
          .select()
          .single() as any;

        if (updateError) throw updateError;
        projectId = data.id;

        // Eliminar relaciones anteriores
        await supabase
          .from('project_skills')
          .delete()
          .eq('project_id', projectId);

        console.log('✅ Proyecto actualizado:', data.title);
      } else {
        // Crear nuevo proyecto
        const { data, error: insertError } = await supabase
          .from('projects')
          .insert(projectData as any)
          .select()
          .single() as any;

        if (insertError) throw insertError;
        projectId = data.id;

        console.log('✅ Proyecto creado:', data.title);
      }

      // Insertar relaciones project_skills
      const skillRelations = formData.selectedSkills.map((skillId) => ({
        project_id: projectId,
        skill_id: skillId,
      }));

      console.log('🔗 [ProjectForm] Insertando relaciones project_skills:', skillRelations);

      const { error: relationsError } = await supabase
        .from('project_skills')
        .insert(skillRelations as any);

      if (relationsError) throw relationsError;

      console.log('✅ [ProjectForm] Relaciones project_skills creadas correctamente');

      // Redirigir a la lista
      navigate('/admin/projects');
    } catch (err: any) {
      console.error('❌ Error al guardar proyecto:', err);
      setError(err.message || 'Error al guardar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProject) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className={`w-8 h-8 animate-spin ${isGeekMode ? 'text-cyan-400' : 'text-blue-500'}`} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1
          className={`
            text-3xl font-display font-bold
            ${isGeekMode ? 'text-white' : 'text-gray-900'}
          `}
        >
          {isEditMode ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        </h1>
        <p
          className={`
            mt-2 text-sm
            ${isGeekMode ? 'text-gray-400' : 'text-gray-600'}
          `}
        >
          {isEditMode ? 'Actualiza la información del proyecto' : 'Completa el formulario para agregar un nuevo proyecto'}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            mb-6 flex items-start gap-3 p-4 rounded-lg
            ${isGeekMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}
          `}
        >
          <AlertCircle
            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isGeekMode ? 'text-red-400' : 'text-red-600'}`}
          />
          <p className={`text-sm ${isGeekMode ? 'text-red-300' : 'text-red-800'}`}>
            {error}
          </p>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Container */}
        <div
          className={`
            rounded-xl p-6 border
            ${isGeekMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}
            shadow-lg
          `}
        >
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className={`
                  block text-sm font-medium mb-2
                  ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className={`
                  block w-full px-4 py-3 rounded-lg
                  ${isGeekMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'}
                  border
                  ${isGeekMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}
                  focus:outline-none
                  ${isGeekMode ? 'focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}
                  transition-all duration-200
                `}
                placeholder="Nombre del proyecto"
              />
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="slug"
                className={`
                  block text-sm font-medium mb-2
                  ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Slug (URL) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                className={`
                  block w-full px-4 py-3 rounded-lg font-mono text-sm
                  ${isGeekMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'}
                  border
                  ${isGeekMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}
                  focus:outline-none
                  ${isGeekMode ? 'focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}
                  transition-all duration-200
                `}
                placeholder="mi-proyecto"
              />
              <p className={`mt-1 text-xs ${isGeekMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Se genera automáticamente desde el título (solo letras, números y guiones)
              </p>
            </div>

            {/* Short Description */}
            <div>
              <label
                htmlFor="short_description"
                className={`
                  block text-sm font-medium mb-2
                  ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Descripción Corta <span className="text-red-500">*</span>
              </label>
              <textarea
                id="short_description"
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                required
                rows={3}
                maxLength={200}
                className={`
                  block w-full px-4 py-3 rounded-lg
                  ${isGeekMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'}
                  border
                  ${isGeekMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}
                  focus:outline-none
                  ${isGeekMode ? 'focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}
                  transition-all duration-200
                  resize-none
                `}
                placeholder="Breve descripción que aparecerá en la tarjeta del proyecto"
              />
              <p className={`mt-1 text-xs text-right ${isGeekMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {formData.short_description.length}/200
              </p>
            </div>

            {/* Full Description (Markdown) */}
            <div>
              <label
                htmlFor="full_description"
                className={`
                  block text-sm font-medium mb-2
                  ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Descripción Completa (Markdown)
              </label>
              <textarea
                id="full_description"
                name="full_description"
                value={formData.full_description}
                onChange={handleInputChange}
                rows={10}
                className={`
                  block w-full px-4 py-3 rounded-lg font-mono text-sm
                  ${isGeekMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'}
                  border
                  ${isGeekMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}
                  focus:outline-none
                  ${isGeekMode ? 'focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}
                  transition-all duration-200
                `}
                placeholder="Descripción detallada con formato Markdown..."
              />
              <p className={`mt-1 text-xs ${isGeekMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Soporta Markdown para formato (títulos, listas, negritas, etc.)
              </p>
            </div>

            {/* Cover Image Upload */}
            <div>
              <label
                className={`
                  block text-sm font-medium mb-2
                  ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Imagen de Portada
              </label>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4 relative rounded-lg overflow-hidden aspect-video bg-gray-900">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, cover_image_url: '' }));
                    }}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                    title="Eliminar imagen"
                    aria-label="Eliminar imagen"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex gap-3">
                <label
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                    ${isGeekMode
                      ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                      : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
                    }
                    ${uploadingImage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    transition-colors
                  `}
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className={`text-sm font-medium ${isGeekMode ? 'text-white' : 'text-gray-700'}`}>
                        Subiendo...
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className={`w-5 h-5 ${isGeekMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`text-sm font-medium ${isGeekMode ? 'text-white' : 'text-gray-700'}`}>
                        {imagePreview ? 'Cambiar Imagen' : 'Subir Imagen'}
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>
              <p className={`mt-1 text-xs ${isGeekMode ? 'text-gray-500' : 'text-gray-500'}`}>
                JPG, PNG o WebP. Máximo 5MB. Se subirá a Supabase Storage (bucket: portfolio-assets)
              </p>
            </div>

            {/* Demo & Repo URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="demo_url"
                  className={`
                    block text-sm font-medium mb-2
                    ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  URL Demo
                </label>
                <input
                  type="url"
                  id="demo_url"
                  name="demo_url"
                  value={formData.demo_url}
                  onChange={handleInputChange}
                  className={`
                    block w-full px-4 py-3 rounded-lg
                    ${isGeekMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'}
                    border
                    ${isGeekMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}
                    focus:outline-none
                    ${isGeekMode ? 'focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}
                    transition-all duration-200
                  `}
                  placeholder="https://demo.com"
                />
              </div>

              <div>
                <label
                  htmlFor="repo_url"
                  className={`
                    block text-sm font-medium mb-2
                    ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  URL Repositorio
                </label>
                <input
                  type="url"
                  id="repo_url"
                  name="repo_url"
                  value={formData.repo_url}
                  onChange={handleInputChange}
                  className={`
                    block w-full px-4 py-3 rounded-lg
                    ${isGeekMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'}
                    border
                    ${isGeekMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}
                    focus:outline-none
                    ${isGeekMode ? 'focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}
                    transition-all duration-200
                  `}
                  placeholder="https://github.com/user/repo"
                />
              </div>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className={`
                  w-4 h-4 rounded
                  ${isGeekMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-300'}
                  ${isGeekMode ? 'text-cyan-500 focus:ring-cyan-500' : 'text-blue-500 focus:ring-blue-500'}
                `}
              />
              <label
                htmlFor="is_featured"
                className={`
                  text-sm font-medium
                  ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Proyecto Destacado (Featured)
              </label>
            </div>
          </div>
        </div>

        {/* Skills Selection */}
        <div
          className={`
            rounded-xl p-6 border
            ${isGeekMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}
            shadow-lg
          `}
        >
          <h3
            className={`
              text-lg font-semibold mb-4
              ${isGeekMode ? 'text-white' : 'text-gray-900'}
            `}
          >
            Tecnologías <span className="text-red-500">*</span>
          </h3>
          <p className={`text-sm mb-4 ${isGeekMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Selecciona las tecnologías utilizadas en este proyecto
          </p>

          {/* Skills Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {skills.map((skill) => {
              const isSelected = formData.selectedSkills.includes(skill.id);
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => handleSkillToggle(skill.id)}
                  className={`
                    flex items-center gap-2 p-3 rounded-lg border-2
                    transition-all duration-200
                    ${isSelected
                      ? isGeekMode
                        ? 'bg-cyan-500/20 border-cyan-500 text-white'
                        : 'bg-blue-100 border-blue-500 text-blue-900'
                      : isGeekMode
                        ? 'bg-white/5 border-white/10 text-gray-400 hover:border-cyan-500/50'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-blue-300'
                    }
                  `}
                >
                  <img
                    src={skill.logo}
                    alt={skill.name}
                    className="w-6 h-6 object-contain"
                  />
                  <span className="text-sm font-medium truncate">{skill.name}</span>
                </button>
              );
            })}
          </div>

          {formData.selectedSkills.length === 0 && (
            <p className={`mt-4 text-sm ${isGeekMode ? 'text-red-400' : 'text-red-600'}`}>
              Debes seleccionar al menos una tecnología
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            disabled={loading}
            className={`
              px-6 py-3 rounded-lg font-semibold
              ${isGeekMode
                ? 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
              }
              transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            Cancelar
          </button>

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            type="submit"
            disabled={loading}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg
              ${isGeekMode
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
              }
              text-white font-semibold shadow-lg
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isEditMode ? 'Actualizar Proyecto' : 'Crear Proyecto'}
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};
