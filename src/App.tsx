import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context';
import { Layout } from './components/layout/Layout';
import { SeoHead } from './components/seo';
import { Hero } from './features/home/HeroNew';
import { ProjectsGallery } from './features/projects/ProjectsGallery';
import { SkillsVelocity } from './features/skills/SkillsVelocity';
import { CertificationsVault } from './features/certifications';
import { LoginPage } from './features/auth/LoginPage';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { DashboardLayout } from './features/admin/DashboardLayout';
import { AdminProjects } from './features/admin/projects/AdminProjects';
import { ProjectForm } from './features/admin/projects/ProjectForm';
import { AdminSkills } from './features/admin/skills/AdminSkills';
import { AdminCertifications } from './features/admin/certifications/AdminCertifications';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

/**
 * App Component Principal
 * 
 * Integración completa de:
 * - SEO con react-helmet-async
 * - Theme Provider (Geek/Recruiter Mode)
 * - Layout con AnimatedBackground
 * - Sistema de rutas con React Router
 * - Autenticación y rutas protegidas
 */

// Componente de la página principal (Home)
const HomePage = () => (
  <Layout>
    <SeoHead />
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Projects Section */}
      <ProjectsGallery />

      {/* Skills Section */}
      <SkillsVelocity />

      {/* Certifications Section */}
      <CertificationsVault />
    </div>
  </Layout>
);

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider defaultMode="recruiter">
        <BrowserRouter>
          <Routes>
            {/* Ruta principal - Portfolio público */}
            <Route path="/" element={<HomePage />} />

            {/* Ruta de login - Sin protección */}
            <Route path="/admin" element={<LoginPage />} />

            {/* Rutas protegidas del admin con DashboardLayout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                {/* Dashboard principal */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                
                {/* Gestión de Proyectos */}
                <Route path="/admin/projects" element={<AdminProjects />} />
                <Route path="/admin/projects/new" element={<ProjectForm />} />
                <Route path="/admin/projects/:id/edit" element={<ProjectForm />} />
                
                {/* Gestión de Habilidades */}
                <Route path="/admin/skills" element={<AdminSkills />} />
                
                {/* Gestión de Certificaciones */}
                <Route path="/admin/certifications" element={<AdminCertifications />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
