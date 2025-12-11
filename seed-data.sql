-- =====================================================
-- SEED DATA SCRIPT - Portfolio Database
-- =====================================================
-- Script para poblar la base de datos con datos de prueba
-- Usa PL/pgSQL para manejar relaciones automáticamente
-- =====================================================

DO $$
DECLARE
  -- Variables para Skills
  skill_react_id UUID;
  skill_typescript_id UUID;
  skill_tailwind_id UUID;
  skill_nodejs_id UUID;
  skill_postgresql_id UUID;
  skill_openai_id UUID;
  skill_nextjs_id UUID;
  skill_framer_id UUID;
  
  -- Variables para Projects
  project_ecommerce_id UUID;
  project_aichat_id UUID;
  
  -- Variable para Profile (si necesitamos crear uno)
  profile_id UUID;

BEGIN
  -- =====================================================
  -- PASO 1: LIMPIAR DATOS EXISTENTES (OPCIONAL)
  -- =====================================================
  -- Descomentar si quieres empezar desde cero
  -- DELETE FROM project_skills;
  -- DELETE FROM certifications;
  -- DELETE FROM projects;
  -- DELETE FROM skills;
  
  RAISE NOTICE '🚀 Iniciando inserción de datos...';
  
  -- =====================================================
  -- PASO 2: INSERTAR SKILLS Y CAPTURAR IDs
  -- =====================================================
  RAISE NOTICE '📦 Insertando Skills...';
  
  -- React
  INSERT INTO skills (name, icon_url, category, proficiency)
  VALUES (
    'React',
    'https://cdn.simpleicons.org/react/61DAFB',
    'Frontend',
    95
  )
  RETURNING id INTO skill_react_id;
  
  -- TypeScript
  INSERT INTO skills (name, icon_url, category, proficiency)
  VALUES (
    'TypeScript',
    'https://cdn.simpleicons.org/typescript/3178C6',
    'Frontend',
    90
  )
  RETURNING id INTO skill_typescript_id;
  
  -- Tailwind CSS
  INSERT INTO skills (name, icon_url, category, proficiency)
  VALUES (
    'Tailwind CSS',
    'https://cdn.simpleicons.org/tailwindcss/06B6D4',
    'Frontend',
    88
  )
  RETURNING id INTO skill_tailwind_id;
  
  -- Next.js
  INSERT INTO skills (name, icon_url, category, proficiency)
  VALUES (
    'Next.js',
    'https://cdn.simpleicons.org/nextdotjs/000000',
    'Frontend',
    85
  )
  RETURNING id INTO skill_nextjs_id;
  
  -- Framer Motion
  INSERT INTO skills (name, icon_url, category, proficiency)
  VALUES (
    'Framer Motion',
    'https://cdn.simpleicons.org/framer/0055FF',
    'Frontend',
    82
  )
  RETURNING id INTO skill_framer_id;
  
  -- Node.js
  INSERT INTO skills (name, icon_url, category, proficiency)
  VALUES (
    'Node.js',
    'https://cdn.simpleicons.org/nodedotjs/339933',
    'Backend',
    87
  )
  RETURNING id INTO skill_nodejs_id;
  
  -- PostgreSQL
  INSERT INTO skills (name, icon_url, category, proficiency)
  VALUES (
    'PostgreSQL',
    'https://cdn.simpleicons.org/postgresql/4169E1',
    'Backend',
    85
  )
  RETURNING id INTO skill_postgresql_id;
  
  -- OpenAI
  INSERT INTO skills (name, icon_url, category, proficiency)
  VALUES (
    'OpenAI',
    'https://cdn.simpleicons.org/openai/412991',
    'Backend',
    80
  )
  RETURNING id INTO skill_openai_id;
  
  RAISE NOTICE '✅ Skills insertadas correctamente';
  
  -- =====================================================
  -- PASO 3: INSERTAR PROYECTOS Y CAPTURAR IDs
  -- =====================================================
  RAISE NOTICE '🎨 Insertando Proyectos...';
  
  -- Proyecto A: Neon E-commerce
  INSERT INTO projects (
    title,
    slug,
    short_description,
    full_description,
    cover_image_url,
    demo_url,
    repo_url,
    is_featured
  )
  VALUES (
    'Neon E-commerce',
    'neon-ecommerce',
    'Tienda online futurista con animaciones 3D y experiencia de compra inmersiva.',
    E'E-commerce de última generación construido con Next.js 14 y React 18.\n\n**Características destacadas:**\n- Animaciones 3D con Framer Motion\n- Checkout optimizado con Stripe\n- Dashboard admin en tiempo real\n- PWA con soporte offline\n- Modo dark/light con transiciones suaves\n\n**Stack técnico:**\nFrontend moderno con TypeScript, validación con Zod, estado global con Zustand y sistema de diseño personalizado con Tailwind CSS.',
    'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
    'https://neon-ecommerce-demo.vercel.app',
    'https://github.com/tu-usuario/neon-ecommerce',
    true
  )
  RETURNING id INTO project_ecommerce_id;
  
  -- Proyecto B: AI Chat Assistant
  INSERT INTO projects (
    title,
    slug,
    short_description,
    full_description,
    cover_image_url,
    demo_url,
    repo_url,
    is_featured
  )
  VALUES (
    'AI Chat Assistant',
    'ai-chat-assistant',
    'Asistente conversacional inteligente potenciado por GPT-4 con memoria contextual.',
    E'Chatbot avanzado con capacidades de procesamiento de lenguaje natural.\n\n**Capacidades:**\n- Integración con OpenAI GPT-4\n- Memoria conversacional con Pinecone\n- Streaming de respuestas en tiempo real\n- Autenticación segura con NextAuth\n- Rate limiting y caché con Redis\n\n**Arquitectura:**\nAPI REST en Node.js + Express, base de datos PostgreSQL para persistencia de conversaciones, y sistema de embeddings para búsqueda semántica.',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    'https://ai-chat-demo.vercel.app',
    'https://github.com/tu-usuario/ai-chat-assistant',
    true
  )
  RETURNING id INTO project_aichat_id;
  
  RAISE NOTICE '✅ Proyectos insertados correctamente';
  
  -- =====================================================
  -- PASO 4: CREAR RELACIONES PROJECT_SKILLS
  -- =====================================================
  RAISE NOTICE '🔗 Creando relaciones proyecto-skills...';
  
  -- Proyecto A (E-commerce): React, TypeScript, Tailwind, Next.js, Framer
  INSERT INTO project_skills (project_id, skill_id)
  VALUES
    (project_ecommerce_id, skill_react_id),
    (project_ecommerce_id, skill_typescript_id),
    (project_ecommerce_id, skill_tailwind_id),
    (project_ecommerce_id, skill_nextjs_id),
    (project_ecommerce_id, skill_framer_id);
  
  -- Proyecto B (AI Chat): OpenAI, Node.js, PostgreSQL, TypeScript
  INSERT INTO project_skills (project_id, skill_id)
  VALUES
    (project_aichat_id, skill_openai_id),
    (project_aichat_id, skill_nodejs_id),
    (project_aichat_id, skill_postgresql_id),
    (project_aichat_id, skill_typescript_id);
  
  RAISE NOTICE '✅ Relaciones creadas correctamente';
  
  -- =====================================================
  -- PASO 5: INSERTAR CERTIFICACIONES
  -- =====================================================
  RAISE NOTICE '🏆 Insertando Certificaciones...';
  
  -- Certificación 1: Meta Frontend Developer
  INSERT INTO certifications (
    title,
    issuer,
    issue_date,
    credential_url,
    category,
    related_project_id
  )
  VALUES (
    'Meta Frontend Developer Professional Certificate',
    'Meta',
    '2024-06-15',
    'https://www.coursera.org/account/accomplishments/professional-cert/ABC123',
    'Study',
    project_ecommerce_id  -- Vinculado al proyecto E-commerce
  );
  
  -- Certificación 2: AWS Cloud Practitioner
  INSERT INTO certifications (
    title,
    issuer,
    issue_date,
    credential_url,
    category,
    related_project_id
  )
  VALUES (
    'AWS Certified Cloud Practitioner',
    'Amazon Web Services',
    '2024-03-20',
    'https://www.credly.com/badges/aws-ccp-xyz789',
    'Study',
    project_aichat_id  -- Vinculado al proyecto AI Chat (Backend)
  );
  
  -- Certificación 3: React Advanced Patterns
  INSERT INTO certifications (
    title,
    issuer,
    issue_date,
    credential_url,
    category,
    related_project_id
  )
  VALUES (
    'Advanced React Patterns Workshop',
    'Kent C. Dodds',
    '2024-08-10',
    'https://epicreact.dev/certificates/456',
    'Event',
    NULL  -- Sin proyecto relacionado específico
  );
  
  -- Certificación 4: Hackathon Winner
  INSERT INTO certifications (
    title,
    issuer,
    issue_date,
    credential_url,
    category,
    related_project_id
  )
  VALUES (
    '1st Place - AI Innovation Hackathon',
    'Tech Conference 2024',
    '2024-09-25',
    'https://hackathon2024.com/winners',
    'Competition',
    project_aichat_id  -- El proyecto AI fue el ganador
  );
  
  RAISE NOTICE '✅ Certificaciones insertadas correctamente';
  
  -- =====================================================
  -- PASO 6: VERIFICACIÓN FINAL
  -- =====================================================
  RAISE NOTICE '🔍 Verificando datos insertados...';
  RAISE NOTICE '   - Skills: %', (SELECT COUNT(*) FROM skills);
  RAISE NOTICE '   - Projects: %', (SELECT COUNT(*) FROM projects);
  RAISE NOTICE '   - Project-Skills: %', (SELECT COUNT(*) FROM project_skills);
  RAISE NOTICE '   - Certifications: %', (SELECT COUNT(*) FROM certifications);
  
  RAISE NOTICE '✨ ¡Seed data insertado exitosamente!';
  
END $$;

-- =====================================================
-- CONSULTAS DE VERIFICACIÓN (OPCIONAL)
-- =====================================================
-- Descomentar para ver los datos insertados

-- SELECT * FROM skills ORDER BY category, proficiency DESC;
-- SELECT * FROM projects;
-- SELECT p.title, s.name, s.icon_url 
-- FROM projects p
-- JOIN project_skills ps ON p.id = ps.project_id
-- JOIN skills s ON ps.skill_id = s.id
-- ORDER BY p.title, s.name;
-- SELECT * FROM certifications ORDER BY issue_date DESC;
