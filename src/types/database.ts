/**
 * Definiciones de tipos para la base de datos del portfolio
 * Basado en el Contrato de Datos definido en la documentación
 */

/**
 * Categorías de habilidades técnicas
 */
export type SkillCategory = 'language' | 'framework' | 'tool';

/**
 * Skill - Habilidad técnica
 * 
 * Representa una tecnología, lenguaje, framework o herramienta
 * que forma parte del stack técnico del portfolio
 * 
 * @property id - Identificador único de la habilidad
 * @property name - Nombre de la tecnología (ej: "React", "TypeScript")
 * @property icon - Nombre del icono o URL del logo
 * @property category - Clasificación de la habilidad
 * @property proficiency - Nivel de dominio (0-100)
 */
export interface Skill {
  id: string;
  name: string;
  icon: string;
  category: SkillCategory;
  proficiency: number;
}

/**
 * Project - Proyecto del portfolio
 * 
 * Representa un proyecto destacado con sus detalles,
 * tecnologías utilizadas y enlaces relevantes
 * 
 * @property id - Identificador único del proyecto
 * @property title - Título del proyecto
 * @property short_description - Descripción breve (para cards)
 * @property full_description - Descripción completa (para vista detallada)
 * @property cover_image - URL de la imagen de portada
 * @property technologies - Array de skills utilizadas en el proyecto
 * @property demo_link - URL de la demo en vivo (opcional)
 * @property repo_link - URL del repositorio de código (opcional)
 */
export interface Project {
  id: string;
  title: string;
  short_description: string;
  full_description: string;
  cover_image: string;
  technologies: Skill[];
  demo_link?: string;
  repo_link?: string;
  // Additional properties for enhanced UI
  type?: 'web' | 'mobile' | 'fullstack';
  status?: 'draft' | 'published';
  description?: string;
  demoUrl?: string;
  githubUrl?: string;
}

/**
 * Categorías de certificaciones
 */
export type CertificationCategory = 'event' | 'study' | 'competition';

/**
 * Certification - Certificación o logro
 * 
 * Representa certificaciones, participaciones en eventos,
 * cursos completados o competiciones
 * 
 * @property id - Identificador único de la certificación
 * @property title - Título de la certificación
 * @property issuer - Organización emisora
 * @property issue_date - Fecha de emisión (formato ISO: YYYY-MM-DD)
 * @property category - Tipo de certificación
 * @property credential_url - URL del certificado o credencial
 * @property related_project_id - ID del proyecto relacionado (opcional)
 */
export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  category: CertificationCategory;
  credential_url: string;
  related_project_id?: string;
}

/**
 * Timeline Entry - Entrada de línea de tiempo profesional
 * (Futuro: para Timeline de experiencia laboral/educación)
 */
export interface TimelineEntry {
  id: string;
  title: string;
  organization: string;
  start_date: string;
  end_date?: string;
  description: string;
  type: 'work' | 'education' | 'achievement';
}

/**
 * Tipos de filtros para proyectos
 */
export type ProjectFilterType = 'all' | 'frontend' | 'backend' | 'fullstack' | 'mobile';

/**
 * Estado de carga genérico
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
