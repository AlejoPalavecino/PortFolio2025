/**
 * Supabase Database Types
 * 
 * Definiciones de tipos TypeScript que reflejan el esquema de la base de datos.
 * Estos tipos coinciden exactamente con las tablas creadas en el script SQL.
 * 
 * IMPORTANTE: Mantener sincronizados con el esquema de la base de datos.
 * Si modificas el SQL, actualiza estos tipos.
 */

// ============================================================================
// ENUMS
// ============================================================================

export type SkillCategory = 'Frontend' | 'Backend' | 'Tools' | 'Soft';
export type CertificationCategory = 'Event' | 'Study' | 'Competition';

// ============================================================================
// TABLAS DE LA BASE DE DATOS
// ============================================================================

export interface Profile {
  id: string; // UUID - FK a auth.users
  full_name: string | null;
  bio_short: string | null;
  bio_long: string | null;
  cv_url: string | null;
  avatar_url: string | null;
  social_links: SocialLinks;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
  [key: string]: string | undefined; // Permite otros campos personalizados
}

export interface Project {
  id: string; // UUID
  title: string;
  slug: string; // Unique
  short_description: string;
  full_description: string | null; // Markdown
  cover_image_url: string | null;
  demo_url: string | null;
  repo_url: string | null;
  is_featured: boolean;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface Skill {
  id: string; // UUID
  name: string;
  icon_url: string | null;
  category: SkillCategory;
  proficiency: number; // 0-100
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface Certification {
  id: string; // UUID
  title: string;
  issuer: string;
  issue_date: string; // ISO date (YYYY-MM-DD)
  category: CertificationCategory;
  credential_url: string | null;
  certificate_file_url: string | null; // Imagen o PDF del certificado
  related_project_id: string | null; // FK a projects (nullable)
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface ProjectSkill {
  project_id: string; // FK a projects
  skill_id: string; // FK a skills
  created_at: string; // ISO timestamp
}

// ============================================================================
// TIPOS EXTENDIDOS (con relaciones)
// ============================================================================

/**
 * Proyecto con sus habilidades relacionadas (JOIN con project_skills y skills)
 */
export interface ProjectWithSkills extends Project {
  skills?: Skill[];
}

/**
 * Certificación con proyecto relacionado (JOIN con projects)
 */
export interface CertificationWithProject extends Certification {
  related_project?: Project | null;
}

/**
 * Habilidad con proyectos donde se usó (JOIN inverso)
 */
export interface SkillWithProjects extends Skill {
  projects?: Project[];
}

// ============================================================================
// DATABASE SCHEMA (para Supabase Client)
// ============================================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'> & {
          id: string; // Requerido en INSERT (debe coincidir con auth.users.id)
        };
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>;
      };
      skills: {
        Row: Skill;
        Insert: Omit<Skill, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Skill, 'id' | 'created_at' | 'updated_at'>>;
      };
      certifications: {
        Row: Certification;
        Insert: Omit<Certification, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Certification, 'id' | 'created_at' | 'updated_at'>>;
      };
      project_skills: {
        Row: ProjectSkill;
        Insert: Omit<ProjectSkill, 'created_at'>;
        Update: never; // No se permite UPDATE en tablas pivote (solo INSERT/DELETE)
      };
    };
    Views: Record<string, never>; // Sin vistas por ahora
    Functions: Record<string, never>; // Sin funciones personalizadas por ahora
    Enums: {
      skill_category: SkillCategory;
      certification_category: CertificationCategory;
    };
  };
}

// ============================================================================
// HELPERS DE TIPOS
// ============================================================================

/**
 * Extrae el tipo Row de una tabla específica
 * Ejemplo: TableRow<'projects'> → Project
 */
export type TableRow<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

/**
 * Extrae el tipo Insert de una tabla específica
 * Ejemplo: TableInsert<'projects'> → Omit<Project, 'id' | 'created_at' | 'updated_at'>
 */
export type TableInsert<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert'];

/**
 * Extrae el tipo Update de una tabla específica
 * Ejemplo: TableUpdate<'projects'> → Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
 */
export type TableUpdate<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update'];
