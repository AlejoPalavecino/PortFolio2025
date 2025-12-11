/**
 * Script de diagnóstico para Supabase Auth
 * 
 * Este archivo ayuda a diagnosticar problemas de autenticación
 * Ejecuta varios tests para verificar la configuración
 */

import { supabase } from './supabase';

export const diagnoseAuth = async (email: string, password: string) => {
  console.group('🔍 DIAGNÓSTICO DE AUTENTICACIÓN');
  
  // 1. Verificar configuración
  console.log('\n1️⃣ Verificando configuración:');
  console.log('   Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('   Anon Key presente:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
  console.log('   Anon Key (primeros 20 chars):', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');

  // 2. Verificar conexión
  console.log('\n2️⃣ Verificando conexión a Supabase:');
  try {
    const { error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.error('   ❌ Error de conexión:', error.message);
    } else {
      console.log('   ✅ Conexión exitosa a la base de datos');
    }
  } catch (err) {
    console.error('   ❌ Error al conectar:', err);
  }

  // 3. Verificar estado de sesión actual
  console.log('\n3️⃣ Verificando sesión actual:');
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('   ❌ Error al obtener sesión:', error.message);
    } else if (session) {
      console.log('   ✅ Sesión activa encontrada');
      console.log('   Usuario:', session.user.email);
      console.log('   Expira:', new Date(session.expires_at! * 1000).toLocaleString());
    } else {
      console.log('   ℹ️  No hay sesión activa');
    }
  } catch (err) {
    console.error('   ❌ Error:', err);
  }

  // 4. Intentar login
  console.log('\n4️⃣ Intentando login:');
  console.log('   Email:', email);
  console.log('   Password length:', password.length);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      console.error('   ❌ Error de login:');
      console.error('      Código:', error.status);
      console.error('      Mensaje:', error.message);
      console.error('      Nombre:', error.name);
      
      // Sugerencias según el error
      if (error.message.includes('Invalid login credentials')) {
        console.log('\n   💡 Posibles causas:');
        console.log('      • Email o contraseña incorrectos');
        console.log('      • Usuario no existe en Supabase');
        console.log('      • Email no confirmado');
        console.log('      • Contraseña no cumple requisitos (min 6 caracteres)');
      }
    } else if (data.session) {
      console.log('   ✅ Login exitoso!');
      console.log('      Usuario:', data.user.email);
      console.log('      ID:', data.user.id);
      console.log('      Session token presente:', !!data.session.access_token);
    } else {
      console.error('   ❌ Login sin error pero sin sesión creada');
    }
  } catch (err) {
    console.error('   ❌ Error inesperado:', err);
  }

  // 5. Verificar políticas RLS
  console.log('\n5️⃣ Verificando políticas de seguridad (RLS):');
  console.log('   Las políticas RLS deben permitir auth.sign_in');
  console.log('   Revisa en Supabase Dashboard > Authentication > Policies');

  console.groupEnd();
};

// Helper para ejecutar desde la consola del navegador
(window as any).diagnoseAuth = diagnoseAuth;

console.log('💡 TIP: Ejecuta diagnoseAuth("tu@email.com", "tupassword") en la consola para diagnosticar');
