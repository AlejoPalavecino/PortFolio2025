import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LogOut, 
  Home, 
  FolderKanban, 
  Award,
  Zap,
  Menu, 
  X,
  ChevronRight 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/hooks';

/**
 * DashboardLayout - Layout principal para el panel de administración
 * 
 * Características:
 * - Sidebar con navegación
 * - Header con breadcrumbs
 * - Botón de logout
 * - Responsive con menú móvil
 * - Outlet para renderizar rutas hijas
 */

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isGeekMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('✅ Sesión cerrada correctamente');
      navigate('/admin');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: Home,
      exact: true,
    },
    {
      name: 'Proyectos',
      href: '/admin/projects',
      icon: FolderKanban,
    },
    {
      name: 'Habilidades',
      href: '/admin/skills',
      icon: Zap,
    },
    {
      name: 'Certificaciones',
      href: '/admin/certifications',
      icon: Award,
    },
  ];

  // Generar breadcrumbs desde la ruta actual
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Admin', path: '/admin/dashboard' }];

    if (paths.length > 1) {
      paths.slice(1).forEach((segment, index) => {
        const name = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        const path = '/admin/' + paths.slice(1, index + 2).join('/');
        breadcrumbs.push({ name, path });
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div
      className={`
        min-h-screen
        ${isGeekMode ? 'bg-glass-dark' : 'bg-gray-50'}
      `}
    >
      {/* Sidebar Desktop */}
      <aside
        className={`
          hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col
          ${isGeekMode ? 'bg-glass-white/5' : 'bg-white'}
          backdrop-blur-xl
          border-r ${isGeekMode ? 'border-white/10' : 'border-gray-200'}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className={`
                w-10 h-10 rounded-lg
                bg-gradient-to-br ${isGeekMode ? 'from-cyan-500 to-blue-500' : 'from-blue-500 to-purple-500'}
                flex items-center justify-center
                shadow-lg
              `}
            >
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1
                className={`
                  text-lg font-display font-bold
                  ${isGeekMode ? 'text-white' : 'text-gray-900'}
                `}
              >
                Admin Panel
              </h1>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-y-7 overflow-y-auto px-4 py-6">
          <ul role="list" className="flex flex-1 flex-col gap-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact 
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href);

              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={`
                      group flex gap-x-3 rounded-lg p-3 text-sm font-semibold
                      transition-all duration-200
                      ${isActive
                        ? isGeekMode
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/30'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : isGeekMode
                          ? 'text-gray-400 hover:text-white hover:bg-white/5'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="h-6 w-6 shrink-0" />
                    {item.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 px-3 py-3 rounded-lg
              ${isGeekMode
                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
              }
              transition-all duration-200
              font-semibold text-sm
            `}
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            className={`
              fixed inset-y-0 left-0 z-50 w-64
              ${isGeekMode ? 'bg-glass-dark' : 'bg-white'}
              backdrop-blur-xl
              border-r ${isGeekMode ? 'border-white/10' : 'border-gray-200'}
              flex flex-col
            `}
          >
            {/* Close Button */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
              <span className={`font-display font-bold ${isGeekMode ? 'text-white' : 'text-gray-900'}`}>
                Admin Panel
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className={`p-2 rounded-lg ${isGeekMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                title="Cerrar menú"
                aria-label="Cerrar menú de navegación"
              >
                <X className={`w-5 h-5 ${isGeekMode ? 'text-white' : 'text-gray-900'}`} />
              </button>
            </div>

            {/* Navigation (same as desktop) */}
            <nav className="flex flex-1 flex-col gap-y-7 overflow-y-auto px-4 py-6">
              <ul role="list" className="flex flex-1 flex-col gap-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact 
                    ? location.pathname === item.href
                    : location.pathname.startsWith(item.href);

                  return (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`
                          group flex gap-x-3 rounded-lg p-3 text-sm font-semibold
                          transition-all duration-200
                          ${isActive
                            ? isGeekMode
                              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/30'
                              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                            : isGeekMode
                              ? 'text-gray-400 hover:text-white hover:bg-white/5'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                          }
                        `}
                      >
                        <Icon className="h-6 w-6 shrink-0" />
                        {item.name}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg
                  ${isGeekMode
                    ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                  }
                  transition-all duration-200
                  font-semibold text-sm
                `}
              >
                <LogOut className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </nav>
          </motion.aside>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header with Breadcrumbs */}
        <header
          className={`
            sticky top-0 z-30
            ${isGeekMode ? 'bg-glass-white/5' : 'bg-white'}
            backdrop-blur-xl
            border-b ${isGeekMode ? 'border-white/10' : 'border-gray-200'}
            shadow-sm
          `}
        >
          <div className="flex h-16 items-center gap-x-4 px-4 sm:px-6 lg:px-8">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className={`
                lg:hidden p-2 rounded-lg
                ${isGeekMode ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-900'}
              `}
              title="Abrir menú"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Breadcrumbs */}
            <nav className="flex flex-1" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                {breadcrumbs.map((crumb, index) => (
                  <li key={crumb.path} className="flex items-center">
                    {index > 0 && (
                      <ChevronRight
                        className={`w-4 h-4 mx-2 ${isGeekMode ? 'text-gray-600' : 'text-gray-400'}`}
                      />
                    )}
                    {index === breadcrumbs.length - 1 ? (
                      <span
                        className={`
                          text-sm font-medium
                          ${isGeekMode ? 'text-white' : 'text-gray-900'}
                        `}
                      >
                        {crumb.name}
                      </span>
                    ) : (
                      <NavLink
                        to={crumb.path}
                        className={`
                          text-sm font-medium
                          ${isGeekMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                          transition-colors
                        `}
                      >
                        {crumb.name}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </header>

        {/* Page Content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
