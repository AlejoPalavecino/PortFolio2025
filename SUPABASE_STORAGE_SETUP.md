# Configuración de Supabase Storage

## 📦 Crear Bucket para Imágenes

Para que el upload de imágenes funcione, debes crear un bucket en Supabase Storage:

### Pasos:

1. **Ve a tu Dashboard de Supabase:**

   - https://supabase.com/dashboard

2. **Navega a Storage:**

   - En el menú lateral, click en "Storage"

3. **Crear Nuevo Bucket:**

   - Click en "New bucket"
   - Nombre: `portfolio-assets`
   - **Público:** ✅ Marca como **PUBLIC** (importante)
   - Click en "Create bucket"

4. **Configurar Políticas de Acceso (RLS):**

   Ve a "Policies" del bucket y agrega estas políticas:

   **Política de LECTURA PÚBLICA:**

   ```sql
   -- Permitir lectura pública de archivos
   CREATE POLICY "Allow public read access"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'portfolio-assets');
   ```

   **Política de ESCRITURA PARA AUTENTICADOS:**

   ```sql
   -- Permitir subida de archivos para usuarios autenticados
   CREATE POLICY "Allow authenticated users to upload"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'portfolio-assets');
   ```

   **Política de ELIMINACIÓN PARA AUTENTICADOS:**

   ```sql
   -- Permitir eliminar archivos para usuarios autenticados
   CREATE POLICY "Allow authenticated users to delete"
   ON storage.objects FOR DELETE
   TO authenticated
   USING (bucket_id = 'portfolio-assets');
   ```

5. **Verificar Configuración:**
   - El bucket debe aparecer con un icono de candado abierto (público)
   - Las políticas deben estar activas

## 🧪 Probar Upload

Una vez configurado:

1. Ve a `/admin/projects/new`
2. Completa el formulario
3. Sube una imagen
4. Verifica que se suba correctamente

## 🔧 Troubleshooting

### Error: "Bucket not found"

- Verifica que el bucket se llame exactamente `portfolio-assets`
- Verifica que esté marcado como público

### Error: "Permission denied"

- Revisa las políticas RLS en Storage > Policies
- Asegúrate de estar autenticado

### Error: "File too large"

- El límite por defecto es 50MB
- Puedes ajustarlo en Storage > Configuration

## 📁 Estructura de Archivos

Los archivos se guardan con esta estructura:

```
portfolio-assets/
  └── projects/
      ├── 1234567890-abc123.jpg
      ├── 1234567891-def456.png
      └── ...
```

El nombre incluye timestamp + random string para evitar colisiones.
