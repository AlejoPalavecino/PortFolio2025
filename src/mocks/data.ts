/**
 * Mocks de datos para desarrollo y testing
 * 
 * Incluye datos de prueba para Skills, Projects y Certifications
 * que pueden ser utilizados antes de conectar con una API real
 */

import type { Skill, Project, Certification } from '../types/database';

/**
 * Mock de Skills (Habilidades técnicas)
 * Incluye lenguajes, frameworks y herramientas con diferentes niveles de proficiency
 */
export const mockSkills: Skill[] = [
  // Languages
  {
    id: 'skill-1',
    name: 'TypeScript',
    icon: 'code-2',
    category: 'language',
    proficiency: 95,
  },
  {
    id: 'skill-2',
    name: 'JavaScript',
    icon: 'code',
    category: 'language',
    proficiency: 98,
  },
  {
    id: 'skill-3',
    name: 'Python',
    icon: 'file-code',
    category: 'language',
    proficiency: 85,
  },
  {
    id: 'skill-4',
    name: 'Java',
    icon: 'coffee',
    category: 'language',
    proficiency: 75,
  },
  // Frameworks
  {
    id: 'skill-5',
    name: 'React',
    icon: 'atom',
    category: 'framework',
    proficiency: 95,
  },
  {
    id: 'skill-6',
    name: 'Next.js',
    icon: 'zap',
    category: 'framework',
    proficiency: 90,
  },
  {
    id: 'skill-7',
    name: 'Node.js',
    icon: 'server',
    category: 'framework',
    proficiency: 88,
  },
  {
    id: 'skill-8',
    name: 'Express',
    icon: 'cloud',
    category: 'framework',
    proficiency: 85,
  },
  {
    id: 'skill-9',
    name: 'TailwindCSS',
    icon: 'palette',
    category: 'framework',
    proficiency: 92,
  },
  {
    id: 'skill-10',
    name: 'Django',
    icon: 'box',
    category: 'framework',
    proficiency: 78,
  },
  // Tools
  {
    id: 'skill-11',
    name: 'Git',
    icon: 'git-branch',
    category: 'tool',
    proficiency: 90,
  },
  {
    id: 'skill-12',
    name: 'Docker',
    icon: 'package',
    category: 'tool',
    proficiency: 82,
  },
  {
    id: 'skill-13',
    name: 'PostgreSQL',
    icon: 'database',
    category: 'tool',
    proficiency: 85,
  },
  {
    id: 'skill-14',
    name: 'MongoDB',
    icon: 'database',
    category: 'tool',
    proficiency: 88,
  },
  {
    id: 'skill-15',
    name: 'Figma',
    icon: 'figma',
    category: 'tool',
    proficiency: 75,
  },
];

/**
 * Mock de Projects (Proyectos del portfolio)
 * Proyectos variados con diferentes stacks tecnológicos
 */
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    title: 'E-Commerce Platform',
    short_description: 'Plataforma de comercio electrónico full-stack con gestión de inventario y pagos',
    full_description: `
      Plataforma completa de e-commerce construida con tecnologías modernas.
      Incluye autenticación de usuarios, carrito de compras, gestión de inventario,
      procesamiento de pagos con Stripe, y panel de administración.
      
      Características principales:
      - Autenticación y autorización con JWT
      - Sistema de pagos integrado
      - Panel de administración para gestión de productos
      - Diseño responsive y accesible
      - Optimización SEO y rendimiento
    `,
    cover_image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
    technologies: [
      mockSkills[0], // TypeScript
      mockSkills[4], // React
      mockSkills[5], // Next.js
      mockSkills[6], // Node.js
      mockSkills[12], // PostgreSQL
      mockSkills[8], // TailwindCSS
    ],
    demo_link: 'https://demo-ecommerce.example.com',
    repo_link: 'https://github.com/username/ecommerce-platform',
  },
  {
    id: 'project-2',
    title: 'Task Management Dashboard',
    short_description: 'Dashboard colaborativo para gestión de proyectos y tareas con tiempo real',
    full_description: `
      Dashboard moderno de gestión de tareas con colaboración en tiempo real.
      Permite a los equipos organizar proyectos, asignar tareas, seguir el progreso
      y colaborar eficientemente.
      
      Características principales:
      - Tableros Kanban interactivos con drag & drop
      - Actualizaciones en tiempo real con WebSockets
      - Sistema de notificaciones
      - Gestión de equipos y permisos
      - Analytics y reportes de productividad
      - Integración con calendarios
    `,
    cover_image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    technologies: [
      mockSkills[1], // JavaScript
      mockSkills[4], // React
      mockSkills[6], // Node.js
      mockSkills[7], // Express
      mockSkills[13], // MongoDB
      mockSkills[8], // TailwindCSS
    ],
    demo_link: 'https://task-dashboard.example.com',
    repo_link: 'https://github.com/username/task-dashboard',
  },
  {
    id: 'project-3',
    title: 'AI Content Generator',
    short_description: 'Generador de contenido impulsado por IA para marketing y redes sociales',
    full_description: `
      Aplicación web que utiliza modelos de IA para generar contenido de marketing,
      posts para redes sociales, emails y más. Incluye plantillas personalizables
      y análisis de tono.
      
      Características principales:
      - Generación de contenido con GPT-4
      - Plantillas para diferentes tipos de contenido
      - Análisis de tono y sentimiento
      - Optimización SEO automática
      - Exportación en múltiples formatos
      - Dashboard de analytics de contenido
      - API REST para integraciones
    `,
    cover_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    technologies: [
      mockSkills[0], // TypeScript
      mockSkills[4], // React
      mockSkills[2], // Python
      mockSkills[9], // Django
      mockSkills[12], // PostgreSQL
      mockSkills[8], // TailwindCSS
      mockSkills[11], // Docker
    ],
    demo_link: 'https://ai-content-gen.example.com',
  },
];

/**
 * Mock de Certifications (Certificaciones y logros)
 * 🎯 Datos realistas con variedad de categorías y vínculos a proyectos
 */
export const mockCertifications: Certification[] = [
  {
    id: 'cert-1',
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon AWS',
    issue_date: '2024-09-15',
    category: 'study',
    credential_url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
    related_project_id: 'project-3', // Cloud-Native Backend
  },
  {
    id: 'cert-2',
    title: 'Full Stack Web Development Professional Certificate',
    issuer: 'Udemy',
    issue_date: '2024-06-20',
    category: 'study',
    credential_url: 'https://udemy.com/certificate/full-stack-development/',
    related_project_id: 'project-1', // E-Commerce Platform
  },
  {
    id: 'cert-3',
    title: 'Hackathon Winner - Best Innovation Award',
    issuer: 'Globant',
    issue_date: '2024-03-10',
    category: 'competition',
    credential_url: 'https://globant.com/hackathon/2024',
    related_project_id: 'project-2', // AI Chatbot ganador
  },
  {
    id: 'cert-4',
    title: 'Advanced React & TypeScript',
    issuer: 'Platzi',
    issue_date: '2024-11-05',
    category: 'study',
    credential_url: 'https://platzi.com/certificate/react-typescript/',
    related_project_id: 'project-4', // Portfolio Interactivo
  },
  {
    id: 'cert-5',
    title: 'Google I/O Extended 2024',
    issuer: 'Google',
    issue_date: '2024-05-14',
    category: 'event',
    credential_url: 'https://developers.google.com/events/io-extended',
    // Sin proyecto relacionado (asistencia a evento)
  },
  {
    id: 'cert-6',
    title: 'PostgreSQL Database Administration',
    issuer: 'LinkedIn',
    issue_date: '2024-08-22',
    category: 'study',
    credential_url: 'https://linkedin.com/learning/postgresql-administration',
    related_project_id: 'project-3', // Mismo backend con PostgreSQL
  },
];

/**
 * Helper: Obtener skill por ID
 */
export const getSkillById = (id: string): Skill | undefined => {
  return mockSkills.find(skill => skill.id === id);
};

/**
 * Helper: Obtener project por ID
 */
export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find(project => project.id === id);
};

/**
 * Helper: Filtrar projects por tecnología
 */
export const getProjectsByTechnology = (technologyName: string): Project[] => {
  return mockProjects.filter(project =>
    project.technologies.some(tech => tech.name === technologyName)
  );
};

/**
 * Helper: Filtrar projects por categoría de skill
 */
export const getProjectsBySkillCategory = (category: Skill['category']): Project[] => {
  return mockProjects.filter(project =>
    project.technologies.some(tech => tech.category === category)
  );
};

/**
 * Helper: Obtener todas las tecnologías únicas usadas en projects
 */
export const getAllUsedTechnologies = (): Skill[] => {
  const techMap = new Map<string, Skill>();
  
  mockProjects.forEach(project => {
    project.technologies.forEach(tech => {
      techMap.set(tech.id, tech);
    });
  });
  
  return Array.from(techMap.values());
};
