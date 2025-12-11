/**
 * useSkills Hook
 * 
 * Custom hook para obtener habilidades desde Supabase.
 * Ordenadas por proficiency (mayor a menor) para el componente SkillsVelocity.
 * 
 * Features:
 * - Fetch automático al montar el componente
 * - Ordenamiento por proficiency descendente
 * - Transformación de datos DB → UI format
 * - Filtrado opcional por categoría
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Skill as DBSkill, SkillCategory } from '@/types/supabase';

// Tipo de skill como lo espera la UI (basado en SkillsVelocity)
export interface Skill {
  name: string;
  logo: string; // Mapeado desde icon_url
  color: string; // Extraído del icon_url o generado
  category: SkillCategory;
  proficiency: number;
}

interface UseSkillsOptions {
  category?: SkillCategory;
  minProficiency?: number;
}

interface UseSkillsReturn {
  skills: Skill[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Extrae el color hex del URL de SimpleIcons
 * Ejemplo: https://cdn.simpleicons.org/react/61DAFB → #61DAFB
 */
const extractColorFromUrl = (url: string): string => {
  const match = url.match(/\/([A-Fa-f0-9]{6})$/);
  return match ? `#${match[1]}` : '#3B82F6'; // Fallback a blue-500
};

/**
 * Transforma una skill de DB al formato esperado por la UI
 */
const transformSkill = (dbSkill: DBSkill): Skill => {
  const color = dbSkill.icon_url 
    ? extractColorFromUrl(dbSkill.icon_url)
    : '#3B82F6';

  return {
    name: dbSkill.name,
    logo: dbSkill.icon_url || `https://via.placeholder.com/48?text=${dbSkill.name.charAt(0)}`,
    color,
    category: dbSkill.category,
    proficiency: dbSkill.proficiency,
  };
};

export const useSkills = (options: UseSkillsOptions = {}): UseSkillsReturn => {
  const { category, minProficiency = 0 } = options;

  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);

      // Query base ordenada por proficiency
      let query = supabase
        .from('skills')
        .select('*')
        .gte('proficiency', minProficiency)
        .order('proficiency', { ascending: false });

      // Filtrar por categoría si se especifica
      if (category) {
        query = query.eq('category', category);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('❌ Error al obtener skills:', fetchError);
        throw new Error(fetchError.message);
      }

      // Transformar datos DB → UI format
      const transformedSkills = (data || []).map(transformSkill);
      setSkills(transformedSkills);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar skills';
      setError(errorMessage);
      console.error('❌ useSkills error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [category, minProficiency]);

  return {
    skills,
    loading,
    error,
    refetch: fetchSkills,
  };
};

/**
 * Hook para obtener skills agrupadas por categoría
 * Útil para dashboards o vistas organizadas
 */
export const useSkillsByCategory = () => {
  const { skills, loading, error, refetch } = useSkills();

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<SkillCategory, Skill[]>);

  return {
    skillsByCategory,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook para obtener el top N de skills por proficiency
 * Útil para mostrar "Mis mejores habilidades"
 */
export const useTopSkills = (limit: number = 5) => {
  const { skills, loading, error, refetch } = useSkills();

  const topSkills = skills.slice(0, limit);

  return {
    topSkills,
    loading,
    error,
    refetch,
  };
};
