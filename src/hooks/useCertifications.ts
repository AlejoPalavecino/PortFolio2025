/**
 * useCertifications Hook
 * 
 * Custom hook para obtener certificaciones desde Supabase.
 * Incluye relación con proyectos relacionados (related_project_id).
 * 
 * Features:
 * - Fetch automático al montar el componente
 * - JOIN con proyectos relacionados
 * - Transformación de datos DB → UI format
 * - Filtrado opcional por categoría
 * - Estadísticas calculadas automáticamente
 */

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import type { Certification as DBCertification, CertificationCategory, Project as DBProject } from '@/types/supabase';

// Tipo de certificación como lo espera la UI (basado en CertificationsVault)
export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string; // Formato: "2024-03-15"
  category: CertificationCategory;
  credential_url: string | null;
  certificate_file_url: string | null; // Imagen o PDF del certificado
  related_project_id: string | null;
  related_project_title?: string; // Nombre del proyecto vinculado (si existe)
}

interface UseCertificationsOptions {
  category?: CertificationCategory;
  withProjectsOnly?: boolean; // Solo certificaciones con proyectos relacionados
}

interface UseCertificationsReturn {
  certifications: Certification[];
  loading: boolean;
  error: string | null;
  statistics: CertificationStatistics;
  refetch: () => Promise<void>;
}

export interface CertificationStatistics {
  total: number;
  byCategory: Record<CertificationCategory, number>;
  withProjects: number; // Cuántas tienen proyectos relacionados
}

/**
 * Transforma una certificación de DB al formato esperado por la UI
 */
const transformCertification = (
  dbCert: DBCertification,
  relatedProject?: DBProject | null
): Certification => {
  return {
    id: dbCert.id,
    title: dbCert.title,
    issuer: dbCert.issuer,
    issue_date: dbCert.issue_date,
    category: dbCert.category,
    credential_url: dbCert.credential_url,
    certificate_file_url: dbCert.certificate_file_url,
    related_project_id: dbCert.related_project_id,
    related_project_title: relatedProject?.title,
  };
};

export const useCertifications = (options: UseCertificationsOptions = {}): UseCertificationsReturn => {
  const { category, withProjectsOnly = false } = options;

  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      setError(null);

      // Query con LEFT JOIN a projects (para traer related_project si existe)
      let query = supabase
        .from('certifications')
        .select(`
          *,
          related_project:projects!related_project_id (
            id,
            title,
            slug
          )
        `)
        .order('issue_date', { ascending: false });

      // Filtrar por categoría si se especifica
      if (category) {
        query = query.eq('category', category);
      }

      // Filtrar solo certificaciones con proyectos relacionados
      if (withProjectsOnly) {
        query = query.not('related_project_id', 'is', null);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('❌ Error al obtener certificaciones:', fetchError);
        throw new Error(fetchError.message);
      }

      // Transformar datos DB → UI format
      const transformedCertifications = (data || []).map((cert: any) => {
        // Supabase devuelve related_project como objeto o null
        const relatedProject = cert.related_project as DBProject | null;
        return transformCertification(cert, relatedProject);
      });

      setCertifications(transformedCertifications);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar certificaciones';
      setError(errorMessage);
      console.error('❌ useCertifications error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas automáticamente
  const statistics = useMemo<CertificationStatistics>(() => {
    const byCategory: Record<CertificationCategory, number> = {
      Event: 0,
      Study: 0,
      Competition: 0,
    };

    let withProjects = 0;

    certifications.forEach(cert => {
      byCategory[cert.category]++;
      if (cert.related_project_id) {
        withProjects++;
      }
    });

    return {
      total: certifications.length,
      byCategory,
      withProjects,
    };
  }, [certifications]);

  useEffect(() => {
    fetchCertifications();
  }, [category, withProjectsOnly]);

  return {
    certifications,
    loading,
    error,
    statistics,
    refetch: fetchCertifications,
  };
};

/**
 * Hook para obtener certificaciones de un proyecto específico
 * Útil para mostrar "Certificaciones relacionadas" en la vista de un proyecto
 */
export const useCertificationsByProject = (projectId: string | null) => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setCertifications([]);
      setLoading(false);
      return;
    }

    const fetchCertifications = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('certifications')
          .select('*')
          .eq('related_project_id', projectId)
          .order('issue_date', { ascending: false });

        if (fetchError) throw new Error(fetchError.message);

        const transformed = (data || []).map((cert: DBCertification) => transformCertification(cert));
        setCertifications(transformed);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar certificaciones';
        setError(errorMessage);
        console.error('❌ useCertificationsByProject error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, [projectId]);

  return { certifications, loading, error };
};
