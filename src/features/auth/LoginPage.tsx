import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { diagnoseAuth } from '@/lib/diagnoseAuth';
import { useTheme } from '@/hooks';

/**
 * LoginPage - Página de autenticación para el panel de administración
 * 
 * Características:
 * - Diseño glassmorphism premium
 * - Validación de formulario
 * - Integración con Supabase Auth
 * - Feedback visual de errores
 * - Loading states
 * - Redirección automática tras login exitoso
 */

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isGeekMode } = useTheme();

  // Estado del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handler para ejecutar diagnóstico
  const handleDiagnose = async () => {
    if (!email || !password) {
      alert('Por favor ingresa email y contraseña primero');
      return;
    }
    await diagnoseAuth(email, password);
  };

  // Handler del submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validación básica
      if (!email || !password) {
        throw new Error('Por favor completa todos los campos');
      }

      console.log('🔐 Intentando login...');
      console.log('📧 Email:', email.trim());
      console.log('🔗 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

      // Intentar login con Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      console.log('📦 Respuesta de Supabase:', { data, error: signInError });

      if (signInError) {
        console.error('❌ Error de Supabase:', {
          message: signInError.message,
          status: signInError.status,
          name: signInError.name,
        });

        // Mensajes de error más amigables
        if (signInError.message.includes('Invalid login credentials')) {
          throw new Error('Credenciales inválidas. Verifica tu email y contraseña.');
        } else if (signInError.message.includes('Email not confirmed')) {
          throw new Error('Por favor confirma tu email antes de iniciar sesión.');
        } else {
          throw new Error(`Error de autenticación: ${signInError.message}`);
        }
      }

      if (data.session) {
        // Login exitoso - Redirigir al dashboard
        console.log('✅ Login exitoso:', data.user?.email);
        console.log('🎫 Session:', data.session);
        navigate('/admin/dashboard');
      } else {
        throw new Error('No se pudo crear la sesión');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      console.error('❌ Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`
        min-h-screen flex items-center justify-center
        px-4 py-12
        ${isGeekMode ? 'bg-glass-dark' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}
      `}
    >
      {/* Animated Background Effects */}
      {isGeekMode && (
        <>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
              }}
            />
            {/* Glow Orbs */}
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
            <motion.div
              animate={{
                x: [0, -100, 0],
                y: [0, 100, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            />
          </div>
        </>
      )}

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10"
      >
        {/* Card Container */}
        <div
          className={`
            relative overflow-hidden
            rounded-2xl
            ${isGeekMode ? 'bg-glass-white/5' : 'bg-white'}
            backdrop-blur-xl
            border ${isGeekMode ? 'border-white/10' : 'border-gray-200'}
            shadow-2xl
            ${isGeekMode ? 'shadow-cyan-500/10' : 'shadow-black/5'}
          `}
        >
          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className={`
                inline-flex items-center justify-center
                w-16 h-16 mb-4
                rounded-full
                ${isGeekMode ? 'bg-gradient-to-br from-cyan-500 to-blue-500' : 'bg-gradient-to-br from-blue-500 to-purple-500'}
                shadow-lg
              `}
            >
              <Lock className="w-8 h-8 text-white" />
            </motion.div>

            <h1
              className={`
                text-3xl font-display font-bold mb-2
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
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-6">
            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                  flex items-start gap-3 p-4 rounded-lg
                  ${isGeekMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}
                `}
              >
                <AlertCircle
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isGeekMode ? 'text-red-400' : 'text-red-600'}`}
                />
                <p className={`text-sm ${isGeekMode ? 'text-red-300' : 'text-red-800'}`}>
                  {error}
                </p>
              </motion.div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className={`
                  block text-sm font-medium
                  ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`w-5 h-5 ${isGeekMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  placeholder="admin@example.com"
                  className={`
                    block w-full pl-10 pr-3 py-3
                    rounded-lg
                    ${isGeekMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'}
                    border
                    ${isGeekMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}
                    focus:outline-none
                    ${isGeekMode ? 'focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                  `}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className={`
                  block text-sm font-medium
                  ${isGeekMode ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`w-5 h-5 ${isGeekMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder="••••••••"
                  className={`
                    block w-full pl-10 pr-3 py-3
                    rounded-lg
                    ${isGeekMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'}
                    border
                    ${isGeekMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}
                    focus:outline-none
                    ${isGeekMode ? 'focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                  `}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className={`
                w-full py-3 px-4
                rounded-lg
                ${isGeekMode
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                }
                text-white font-semibold
                shadow-lg
                ${isGeekMode ? 'shadow-cyan-500/20' : 'shadow-blue-500/20'}
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                flex items-center justify-center gap-2
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </motion.button>

            {/* Diagnose Button (Development) */}
            {import.meta.env.DEV && (
              <button
                type="button"
                onClick={handleDiagnose}
                className={`
                  w-full py-2 px-4 text-sm
                  rounded-lg
                  ${isGeekMode
                    ? 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    : 'bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border border-yellow-300'
                  }
                  transition-all duration-200
                `}
              >
                🔍 Ejecutar Diagnóstico (Ver Consola)
              </button>
            )}
          </form>

          {/* Decorative Border Glow (Geek Mode) */}
          {isGeekMode && (
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: 'linear-gradient(45deg, transparent, rgba(6, 182, 212, 0.1), transparent)',
                mixBlendMode: 'overlay',
              }}
            />
          )}
        </div>

        {/* Footer Info */}
        <p
          className={`
            text-center text-xs mt-6
            ${isGeekMode ? 'text-gray-500' : 'text-gray-600'}
          `}
        >
          Acceso restringido solo para administradores
        </p>
      </motion.div>
    </div>
  );
};
