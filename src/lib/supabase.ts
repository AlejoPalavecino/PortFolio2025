/**
 * Supabase Client Configuration
 * 
 * Cliente singleton para interactuar con la base de datos de Supabase.
 * Utiliza variables de entorno para la configuración segura.
 * 
 * Variables requeridas en .env:
 * - VITE_SUPABASE_URL: URL de tu proyecto Supabase
 * - VITE_SUPABASE_ANON_KEY: Clave pública (anon key) de Supabase
 */

import { createClient } from '@supabase/supabase-js';

// Validación de variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error(
    '❌ ERROR: VITE_SUPABASE_URL no está definida en las variables de entorno.\n' +
    '➡️  Solución: Crea un archivo .env en la raíz del proyecto con:\n' +
    '    VITE_SUPABASE_URL=https://tu-proyecto.supabase.co'
  );
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  console.error(
    '❌ ERROR: VITE_SUPABASE_ANON_KEY no está definida en las variables de entorno.\n' +
    '➡️  Solución: Agrega en tu archivo .env:\n' +
    '    VITE_SUPABASE_ANON_KEY=tu-anon-key-publica'
  );
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Crear cliente de Supabase (sin tipado estricto para evitar conflictos con 'never')
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'next-gen-portfolio',
    },
  },
});

// Helper para verificar la conexión (útil para debugging)
export const checkConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('❌ Error de conexión con Supabase:', error.message);
      return false;
    }
    console.log('✅ Conexión con Supabase establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error inesperado al conectar con Supabase:', error);
    return false;
  }
};
