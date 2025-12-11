/**
 * useProjects Hook
 * 
 * Custom hook para obtener proyectos desde Supabase.
 * Incluye relación con skills a través de project_skills.
 * 
 * Features:
 * - Fetch automático al montar el componente
 * - Estados de loading y error
 * - Transformación de datos DB → UI format
 * - Filtrado opcional por is_featured
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Project as DBProject, Skill as DBSkill } from '@/types/supabase';

// Tipo de proyecto como lo espera la UI (basado en mockProjects)
export interface Project {
  id: string;
  title: string;
  short_description: string;
  description: string; // Alias para short_description
  tags: string[]; // Mapeado desde skills
  cover_image: string; // Mapeado desde cover_image_url
  demo_url: string | null;
  demoUrl: string | null; // Alias para demo_url
  repo_url: string | null;
  githubUrl: string | null; // Alias para repo_url
  is_featured: boolean;
  slug: string;
  full_description?: string;
  type: string; // Tipo de proyecto (web, mobile, fullstack)
  status: string; // Estado (published, draft)
}

interface UseProjectsOptions {
  featuredOnly?: boolean;
}

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Transforma un proyecto de DB al formato esperado por la UI
 */
const transformProject = (dbProject: DBProject & { skills?: DBSkill[] }): Project => {
  return {
    id: dbProject.id,
    title: dbProject.title,
    short_description: dbProject.short_description,
    description: dbProject.short_description, // Alias
    tags: dbProject.skills?.map((skill: DBSkill) => skill.name) || [],
    cover_image: dbProject.cover_image_url || '/placeholder-project.jpg',
    demo_url: dbProject.demo_url,
    demoUrl: dbProject.demo_url, // Alias
    repo_url: dbProject.repo_url,
    githubUrl: dbProject.repo_url, // Alias
    is_featured: dbProject.is_featured,
    slug: dbProject.slug,
    full_description: dbProject.full_description || undefined,
    type: 'web', // Default, puede personalizarse según tags
    status: dbProject.is_featured ? 'published' : 'draft', // Inferido
  };
};

export const useProjects = (options: UseProjectsOptions = {}): UseProjectsReturn => {
  const { featuredOnly = false } = options;

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // Query base con JOIN a skills a través de project_skills
      let query = supabase
        .from('projects')
        .select(`
          *,
          project_skills!inner (
            skills (*)
          )
        `)
        .order('created_at', { ascending: false });

      // Filtrar solo proyectos destacados si se especifica
      if (featuredOnly) {
        query = query.eq('is_featured', true);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('❌ Error al obtener proyectos:', fetchError);
        throw new Error(fetchError.message);
      }

      // Transformar datos: aplanar la estructura de skills
      const transformedProjects = (data || []).map((project: any) => {
        // Extraer skills del array anidado de project_skills
        const skills = project.project_skills
          ?.map((ps: { skills: DBSkill | null }) => ps.skills)
          .filter((skill: DBSkill | null): skill is DBSkill => skill !== null) || [];

        return transformProject({
          ...project,
          skills,
        });
      });

      setProjects(transformedProjects);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar proyectos';
      setError(errorMessage);
      console.error('❌ useProjects error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [featuredOnly]);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
  };
};
