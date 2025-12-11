import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Home, FolderKanban, Award, Wrench } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/hooks';

/**
 * AdminDashboard - Panel de control principal para administradores
 * 
 * Características:
 * - Vista general de estadísticas
 * - Navegación rápida a diferentes secciones
 * - Botón de logout
 * - Diseño responsive y moderno
 */

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isGeekMode } = useTheme();

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

  const quickLinks = [
    {
      title: 'Proyectos',
      description: 'Gestionar proyectos del portafolio',
      icon: FolderKanban,
      color: isGeekMode ? 'from-cyan-500 to-blue-500' : 'from-blue-500 to-purple-500',
      path: '/admin/projects',
    },
    {
      title: 'Skills',
      description: 'Administrar habilidades técnicas',
      icon: Wrench,
      color: isGeekMode ? 'from-green-500 to-emerald-500' : 'from-green-500 to-teal-500',
      path: '/admin/skills',
    },
    {
      title: 'Certificaciones',
      description: 'Gestionar certificaciones y logros',
      icon: Award,
      color: isGeekMode ? 'from-purple-500 to-pink-500' : 'from-purple-500 to-pink-500',
      path: '/admin/certifications',
    },
  ];

  return (
    <div
      className={`
        min-h-screen
        ${isGeekMode ? 'bg-glass-dark' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}
      `}
    >
      {/* Header */}
      <header
        className={`
          sticky top-0 z-50
          ${isGeekMode ? 'bg-glass-white/5' : 'bg-white'}
          backdrop-blur-xl
          border-b ${isGeekMode ? 'border-white/10' : 'border-gray-200'}
          shadow-sm
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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
                    text-xl font-display font-bold
                    ${isGeekMode ? 'text-white' : 'text-gray-900'}
                  `}
                >
                  Panel de Administración
                </h1>
                <p
                  className={`
                    text-sm
                    ${isGeekMode ? 'text-gray-400' : 'text-gray-600'}
                  `}
                >
                  Gestiona tu portafolio
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className={`
                flex items-center gap-2 px-4 py-2
                rounded-lg
                ${isGeekMode
                  ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }
                border ${isGeekMode ? 'border-white/10' : 'border-gray-300'}
                transition-all duration-200
                font-medium
              `}
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2
            className={`
              text-3xl font-display font-bold mb-2
              ${isGeekMode ? 'text-white' : 'text-gray-900'}
            `}
          >
            Bienvenido de vuelta 👋
          </h2>
          <p
            className={`
              text-lg
              ${isGeekMode ? 'text-gray-400' : 'text-gray-600'}
            `}
          >
            ¿Qué te gustaría gestionar hoy?
          </p>
        </motion.div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.button
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(link.path)}
                className={`
                  relative group
                  p-8 rounded-2xl
                  ${isGeekMode ? 'bg-glass-white/5' : 'bg-white'}
                  backdrop-blur-xl
                  border ${isGeekMode ? 'border-white/10' : 'border-gray-200'}
                  hover:border-transparent
                  shadow-lg hover:shadow-2xl
                  transition-all duration-300
                  text-left
                `}
              >
                {/* Icon */}
                <div
                  className={`
                    inline-flex items-center justify-center
                    w-16 h-16 mb-4
                    rounded-xl
                    bg-gradient-to-br ${link.color}
                    shadow-lg
                    group-hover:scale-110
                    transition-transform duration-300
                  `}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3
                  className={`
                    text-xl font-bold mb-2
                    ${isGeekMode ? 'text-white' : 'text-gray-900'}
                  `}
                >
                  {link.title}
                </h3>
                <p
                  className={`
                    text-sm
                    ${isGeekMode ? 'text-gray-400' : 'text-gray-600'}
                  `}
                >
                  {link.description}
                </p>

                {/* Hover Border Glow */}
                <div
                  className={`
                    absolute inset-0 rounded-2xl
                    bg-gradient-to-r ${link.color}
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-300
                    -z-10 blur-xl
                  `}
                />
              </motion.button>
            );
          })}
        </div>

        {/* Coming Soon Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`
            mt-12 p-6 rounded-xl
            ${isGeekMode ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-200'}
            text-center
          `}
        >
          <p
            className={`
              text-sm font-medium
              ${isGeekMode ? 'text-yellow-300' : 'text-yellow-800'}
            `}
          >
            🚧 Las páginas de gestión detallada están en desarrollo.
            Esta es una vista previa del dashboard de administración.
          </p>
        </motion.div>
      </main>
    </div>
  );
};
