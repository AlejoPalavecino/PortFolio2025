import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/hooks';

/**
 * ProtectedRoute - Componente para proteger rutas del admin
 * 
 * Funcionalidades:
 * - Verifica si existe una sesión activa con Supabase Auth
 * - Redirige a /admin si no hay sesión válida
 * - Muestra loading spinner durante la verificación
 * - Renderiza el contenido hijo (Outlet) si la autenticación es exitosa
 * - Se suscribe a cambios en el estado de autenticación
 */

export const ProtectedRoute: React.FC = () => {
  const { isGeekMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar sesión inicial
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error al verificar sesión:', error);
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(!!session);
          console.log(session ? '✅ Sesión activa' : '⚠️ Sin sesión activa');
        }
      } catch (err) {
        console.error('❌ Error inesperado al verificar sesión:', err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Suscribirse a cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event);
        setIsAuthenticated(!!session);
        
        // Si el usuario cierra sesión, redirigir inmediatamente
        if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
        }
      }
    );

    // Cleanup: cancelar suscripción al desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Mostrar loading spinner mientras verifica la sesión
  if (loading) {
    return (
      <div
        className={`
          min-h-screen flex items-center justify-center
          ${isGeekMode ? 'bg-glass-dark' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}
        `}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {/* Loading Card */}
          <div
            className={`
              inline-flex flex-col items-center gap-6 p-10
              rounded-2xl
              ${isGeekMode ? 'bg-glass-white/5' : 'bg-white'}
              backdrop-blur-xl
              border ${isGeekMode ? 'border-white/10' : 'border-gray-200'}
              shadow-2xl
              ${isGeekMode ? 'shadow-cyan-500/10' : 'shadow-black/5'}
            `}
          >
            {/* Icon */}
            <div
              className={`
                relative inline-flex items-center justify-center
                w-20 h-20
                rounded-full
                ${isGeekMode ? 'bg-gradient-to-br from-cyan-500 to-blue-500' : 'bg-gradient-to-br from-blue-500 to-purple-500'}
                shadow-lg
              `}
            >
              <Shield className="w-10 h-10 text-white" />
              
              {/* Spinning loader overlay */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-white/30"
              />
            </div>

            {/* Text */}
            <div className="space-y-2">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center justify-center gap-2"
              >
                <Loader2
                  className={`w-5 h-5 animate-spin ${isGeekMode ? 'text-cyan-400' : 'text-blue-500'}`}
                />
                <span
                  className={`
                    text-lg font-semibold
                    ${isGeekMode ? 'text-white' : 'text-gray-900'}
                  `}
                >
                  Verificando sesión
                </span>
              </motion.div>
              
              <p
                className={`
                  text-sm
                  ${isGeekMode ? 'text-gray-400' : 'text-gray-600'}
                `}
              >
                Por favor espera un momento...
              </p>
            </div>
          </div>
        </motion.div>

        {/* Animated Background (Geek Mode) */}
        {isGeekMode && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
            />
          </div>
        )}
      </div>
    );
  }

  // Si no está autenticado, redirigir a la página de login
  if (!isAuthenticated) {
    console.log('🚫 Acceso denegado - Redirigiendo a /admin');
    return <Navigate to="/admin" replace />;
  }

  // Usuario autenticado - Renderizar el contenido protegido
  console.log('✅ Acceso permitido - Renderizando contenido protegido');
  return <Outlet />;
};
