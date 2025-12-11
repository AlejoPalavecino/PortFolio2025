import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Loader2, X, Save, ExternalLink, Upload } from 'lucide-react';
import { useCertifications } from '@/hooks/useCertifications';
import { useProjects } from '@/hooks/useProjects';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/hooks';
import type { CertificationCategory } from '@/types/supabase';

/**
 * AdminCertifications - Vista de gestión de certificaciones
 * 
 * Características:
 * - Lista todas las certificaciones desde Supabase
 * - Modal para crear/editar
 * - Selector de proyecto relacionado
 * - Validación de fechas y URLs
 */

interface CertFormData {
  title: string;
  issuer: string;
  issue_date: string;
  category: CertificationCategory;
  credential_url: string;
  certificate_file_url: string;
  related_project_id: string | null;
}

const CATEGORIES: CertificationCategory[] = ['Event', 'Study', 'Competition'];

export const AdminCertifications: React.FC = () => {
  const { isGeekMode } = useTheme();
  const { certifications, loading, error, refetch } = useCertifications();
  const { projects } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<CertFormData>({
    title: '',
    issuer: '',
    issue_date: new Date().toISOString().split('T')[0],
    category: 'Study',
    credential_url: '',
    certificate_file_url: '',
    related_project_id: null,
  });

  // Filtrar certificaciones por búsqueda
  const filteredCerts = certifications.filter((cert) =>
    cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal para crear
  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      issuer: '',
      issue_date: new Date().toISOString().split('T')[0],
      category: 'Study',
      credential_url: '',
      certificate_file_url: '',
      related_project_id: null,
    });
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = async (certId: string) => {
    setEditingId(certId);
    
    // Obtener datos completos de la certificación
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('id', certId)
      .single();

    if (error) {
      console.error('Error al cargar certificación:', error);
      return;
    }

    setFormData({
      title: data.title,
      issuer: data.issuer,
      issue_date: data.issue_date,
      category: data.category,
      credential_url: data.credential_url || '',
      certificate_file_url: data.certificate_file_url || '',
      related_project_id: data.related_project_id,
    });
    setIsModalOpen(true);
  };

  // Guardar (crear o actualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const dataToSave = {
        title: formData.title,
        issuer: formData.issuer,
        issue_date: formData.issue_date,
        category: formData.category,
        credential_url: formData.credential_url || null,
        certificate_file_url: formData.certificate_file_url || null,
        related_project_id: formData.related_project_id || null,
      };

      if (editingId) {
        // Actualizar
        const { error } = await supabase
          .from('certifications')
          .update(dataToSave)
          .eq('id', editingId);

        if (error) throw error;
        console.log('✅ Certificación actualizada');
      } else {
        // Crear
        const { error } = await supabase
          .from('certifications')
          .insert(dataToSave);

        if (error) throw error;
        console.log('✅ Certificación creada');
      }

      await refetch();
      setIsModalOpen(false);
    } catch (err) {
      console.error('❌ Error al guardar certificación:', err);
      alert('Error al guardar. Revisa la consola.');
    } finally {
      setSubmitting(false);
    }
  };

  // Eliminar
  const handleDelete = async (certId: string, certTitle: string) => {
    if (!confirm(`¿Eliminar "${certTitle}"?`)) return;

    setDeletingId(certId);
    try {
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', certId);

      if (error) throw error;
      console.log('✅ Certificación eliminada');
      await refetch();
    } catch (err) {
      console.error('❌ Error al eliminar:', err);
      alert('Error al eliminar. Revisa la consola.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  // Handler para upload de archivo (imagen o PDF)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Solo se permiten imágenes (JPG, PNG, WebP) o archivos PDF');
      return;
    }

    // Validar tamaño (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo no debe superar 10MB');
      return;
    }

    setUploadingFile(true);

    try {
      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `certifications/${fileName}`;

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
        certificate_file_url: publicUrl,
      }));
      setFilePreview(publicUrl);

      console.log('✅ Archivo subido:', publicUrl);
    } catch (err: any) {
      console.error('❌ Error al subir archivo:', err);
      alert(`Error al subir archivo: ${err.message}`);
    } finally {
      setUploadingFile(false);
    }
  };

  if (error) {
    return (
      <div className={`rounded-xl p-6 border ${isGeekMode ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-red-50 border-red-200 text-red-800'}`}>
        <h3 className="font-bold mb-2">Error al cargar certificaciones</h3>
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
            Gestión de Certificaciones
          </h1>
          <p className={`text-sm ${isGeekMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            {certifications.length} certificaciones registradas
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
          Nueva Certificación
        </motion.button>
      </div>

      {/* Búsqueda */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isGeekMode ? 'text-gray-500' : 'text-gray-400'}`} />
        <input
          type="text"
          placeholder="Buscar por título o emisor..."
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

      {/* Grid de Certificaciones */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                rounded-xl p-6 border transition-all
                ${isGeekMode ? 'bg-gray-800 border-gray-700 hover:border-cyan-500' : 'bg-white border-gray-200 hover:border-blue-500'}
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`
                  px-2 py-1 rounded text-xs font-medium
                  ${cert.category === 'Event' ? 'bg-cyan-500/20 text-cyan-400' :
                    cert.category === 'Study' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-rose-500/20 text-rose-400'}
                `}>
                  {cert.category}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(cert.id)}
                    className={`p-1.5 rounded-lg transition-colors ${isGeekMode ? 'hover:bg-gray-700 text-gray-400 hover:text-cyan-400' : 'hover:bg-gray-100 text-gray-600 hover:text-blue-600'}`}
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id, cert.title)}
                    disabled={deletingId === cert.id}
                    className={`p-1.5 rounded-lg transition-colors ${isGeekMode ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400' : 'hover:bg-gray-100 text-gray-600 hover:text-red-600'}`}
                    title="Eliminar"
                  >
                    {deletingId === cert.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <h3 className={`font-bold mb-2 line-clamp-2 ${isGeekMode ? 'text-white' : 'text-gray-900'}`}>
                {cert.title}
              </h3>

              <p className={`text-sm mb-1 ${isGeekMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {cert.issuer}
              </p>

              <p className={`text-xs mb-3 ${isGeekMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {formatDate(cert.issue_date)}
              </p>

              {cert.related_project_id && (
                <div className={`text-xs px-2 py-1 rounded ${isGeekMode ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-50 text-blue-600'}`}>
                  🔗 Vinculado a proyecto
                </div>
              )}

              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-3 flex items-center gap-1 text-xs font-medium ${isGeekMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  Ver credencial <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </motion.div>
          ))}

          {filteredCerts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className={isGeekMode ? 'text-gray-500' : 'text-gray-400'}>
                No se encontraron certificaciones
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal de formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-2xl rounded-xl p-6 my-8 ${isGeekMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${isGeekMode ? 'text-white' : 'text-gray-900'}`}>
                {editingId ? 'Editar Certificación' : 'Nueva Certificación'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-1 ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Título *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isGeekMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    placeholder="ej: AWS Certified Cloud Practitioner"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Emisor *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isGeekMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    placeholder="ej: Amazon AWS"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Fecha de Emisión *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isGeekMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    aria-label="Issue date"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Categoría *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CertificationCategory })}
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
                    Proyecto Relacionado (Opcional)
                  </label>
                  <select
                    value={formData.related_project_id || ''}
                    onChange={(e) => setFormData({ ...formData, related_project_id: e.target.value || null })}
                    className={`w-full px-3 py-2 rounded-lg border ${isGeekMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    aria-label="Related project"
                  >
                    <option value="">Sin proyecto relacionado</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                  <p className={`text-xs mt-1 ${isGeekMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Vincula esta certificación con un proyecto del portfolio
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-1 ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    URL de Credencial (Opcional)
                  </label>
                  <input
                    type="url"
                    value={formData.credential_url}
                    onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isGeekMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    placeholder="https://..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Archivo del Certificado (Opcional)
                  </label>
                  
                  {/* Preview del archivo si existe */}
                  {(filePreview || formData.certificate_file_url) && (
                    <div className={`mb-3 p-3 rounded-lg border ${isGeekMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      {(filePreview || formData.certificate_file_url)?.endsWith('.pdf') ? (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📄</span>
                          <span className={`text-sm ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            PDF cargado
                          </span>
                          <a
                            href={filePreview || formData.certificate_file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`ml-auto text-xs ${isGeekMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'}`}
                          >
                            Ver PDF
                          </a>
                        </div>
                      ) : (
                        <img
                          src={filePreview || formData.certificate_file_url}
                          alt="Preview"
                          className="w-full h-32 object-contain rounded"
                        />
                      )}
                    </div>
                  )}

                  <label
                    className={`
                      flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer
                      transition-colors
                      ${uploadingFile ? 'opacity-50 cursor-not-allowed' : ''}
                      ${isGeekMode 
                        ? 'border-gray-600 hover:border-cyan-500 hover:bg-cyan-500/10 text-gray-300' 
                        : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700'
                      }
                    `}
                  >
                    {uploadingFile ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Subiendo...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>{filePreview || formData.certificate_file_url ? 'Cambiar Archivo' : 'Subir Imagen o PDF'}</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      disabled={uploadingFile}
                      className="hidden"
                    />
                  </label>
                  <p className={`mt-1 text-xs ${isGeekMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    JPG, PNG, WebP o PDF. Máximo 10MB
                  </p>
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
