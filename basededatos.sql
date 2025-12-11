-- ============================================================================
-- NEXT-GEN PORTFOLIO - DATABASE SCHEMA
-- PostgreSQL + Supabase RLS
-- ============================================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. TABLA: profiles (Extensión de auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  bio_short TEXT,
  bio_long TEXT,
  cv_url TEXT,
  avatar_url TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas por nombre
CREATE INDEX idx_profiles_full_name ON public.profiles(full_name);

-- ============================================================================
-- 2. TABLA: skills
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  icon_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('Frontend', 'Backend', 'Tools', 'Soft')),
  proficiency INTEGER NOT NULL CHECK (proficiency >= 0 AND proficiency <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para filtrado por categoría
CREATE INDEX idx_skills_category ON public.skills(category);
CREATE INDEX idx_skills_proficiency ON public.skills(proficiency DESC);

-- ============================================================================
-- 3. TABLA: projects
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  full_description TEXT, -- Markdown
  cover_image_url TEXT,
  demo_url TEXT,
  repo_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas y ordenamiento
CREATE INDEX idx_projects_slug ON public.projects(slug);
CREATE INDEX idx_projects_is_featured ON public.projects(is_featured);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);

-- ============================================================================
-- 4. TABLA: certifications
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Event', 'Study', 'Competition')),
  credential_url TEXT,
  related_project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para filtrado y ordenamiento
CREATE INDEX idx_certifications_category ON public.certifications(category);
CREATE INDEX idx_certifications_issue_date ON public.certifications(issue_date DESC);
CREATE INDEX idx_certifications_related_project ON public.certifications(related_project_id);

-- ============================================================================
-- 5. TABLA: project_skills (Tabla Pivote Muchos-a-Muchos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.project_skills (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (project_id, skill_id)
);

-- Índices para consultas bidireccionales
CREATE INDEX idx_project_skills_project ON public.project_skills(project_id);
CREATE INDEX idx_project_skills_skill ON public.project_skills(skill_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - POLÍTICAS DE SEGURIDAD
-- ============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_skills ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLÍTICAS DE LECTURA PÚBLICA (SELECT)
-- ============================================================================

-- Profiles: Lectura pública
CREATE POLICY "Allow public read access to profiles"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (true);

-- Skills: Lectura pública
CREATE POLICY "Allow public read access to skills"
  ON public.skills FOR SELECT
  TO anon, authenticated
  USING (true);

-- Projects: Lectura pública
CREATE POLICY "Allow public read access to projects"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (true);

-- Certifications: Lectura pública
CREATE POLICY "Allow public read access to certifications"
  ON public.certifications FOR SELECT
  TO anon, authenticated
  USING (true);

-- Project Skills: Lectura pública
CREATE POLICY "Allow public read access to project_skills"
  ON public.project_skills FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================================================================
-- POLÍTICAS DE ESCRITURA PARA ADMINISTRADORES (INSERT, UPDATE, DELETE)
-- ============================================================================

-- Profiles: Escritura solo para usuarios autenticados (su propio perfil)
CREATE POLICY "Allow authenticated users to insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow authenticated users to update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow authenticated users to delete their own profile"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Skills: Escritura total para usuarios autenticados
CREATE POLICY "Allow authenticated users to insert skills"
  ON public.skills FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update skills"
  ON public.skills FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete skills"
  ON public.skills FOR DELETE
  TO authenticated
  USING (true);

-- Projects: Escritura total para usuarios autenticados
CREATE POLICY "Allow authenticated users to insert projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (true);

-- Certifications: Escritura total para usuarios autenticados
CREATE POLICY "Allow authenticated users to insert certifications"
  ON public.certifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update certifications"
  ON public.certifications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete certifications"
  ON public.certifications FOR DELETE
  TO authenticated
  USING (true);

-- Project Skills: Escritura total para usuarios autenticados
CREATE POLICY "Allow authenticated users to insert project_skills"
  ON public.project_skills FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete project_skills"
  ON public.project_skills FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- TRIGGER: Crear perfil automáticamente al registrar usuario
-- ============================================================================

-- Función que crea el perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que ejecuta la función
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- FUNCIÓN: Actualizar updated_at automáticamente
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger de updated_at a todas las tablas
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_skills
  BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_projects
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_certifications
  BEFORE UPDATE ON public.certifications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- ✅ SCRIPT COMPLETADO
-- ============================================================================
-- Próximos pasos:
-- 1. Copiar este script en el SQL Editor de Supabase
-- 2. Ejecutar el script
-- 3. Verificar que las tablas se crearon correctamente
-- 4. Insertar datos de prueba (opcional)
-- ============================================================================