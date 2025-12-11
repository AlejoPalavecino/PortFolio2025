# 🎨 Configuración del Sistema de Temas - Next-Gen Interactive Portfolio

## 📦 Estructura Creada

```
PortFolio/
├── tailwind.config.js          ✅ Configuración completa de TailwindCSS
├── src/
│   ├── index.css              ✅ Directivas Tailwind + estilos base
│   ├── README.md              ✅ Documentación del proyecto
│   ├── types/
│   │   ├── theme.ts           ✅ Tipos TypeScript para el tema
│   │   └── index.ts           ✅ Barrel export
│   ├── context/
│   │   ├── ThemeContext.tsx   ✅ Context Provider con localStorage
│   │   └── index.ts           ✅ Barrel export
│   ├── hooks/
│   │   ├── useTheme.ts        ✅ Hook personalizado tipado
│   │   └── index.ts           ✅ Barrel export
│   ├── components/
│   │   └── ThemeExample.tsx   ✅ Componente de ejemplo
│   ├── features/              ✅ Para lógica por funcionalidad
│   ├── layouts/               ✅ Para estructuras de página
│   └── ...
```

---

## 1️⃣ TAILWIND.CONFIG.JS

### Características implementadas:

✅ **darkMode: 'class'** - Control del tema mediante clase CSS  
✅ **Colores personalizados** para ambos modos:

- **Recruiter Mode**: Background `#FAFAFA`, Primary `#2563EB`
- **Geek Mode**: Background `#0F172A`, Primary `#06B6D4`, Secondary `#8B5CF6`

✅ **Animaciones personalizadas**: fade-in, slide-up, slide-down, scale-in  
✅ **Shadows personalizados**: diferentes para cada modo  
✅ **Gradientes**: específicos para cada tema  
✅ **Fuentes**: Inter (sans) y Fira Code (mono)

### Uso en componentes:

```tsx
// Colores automáticos según el tema
<div className="bg-recruiter-background dark:bg-geek-background">
  <p className="text-recruiter-text dark:text-geek-text">Texto adaptativo</p>
  <button className="bg-recruiter-primary dark:bg-geek-primary">
    Botón con tema
  </button>
</div>
```

---

## 2️⃣ THEME CONTEXT (src/context/ThemeContext.tsx)

### Características:

✅ **Persistencia en localStorage** con clave `portfolio-theme-mode`  
✅ **Gestión de clase 'dark'** en el elemento `<html>`  
✅ **Inicialización inteligente** desde localStorage o modo default  
✅ **Error handling** para problemas de localStorage  
✅ **Callbacks optimizados** con `useCallback`

### API del Context:

```typescript
interface ThemeContextValue {
  mode: "recruiter" | "geek"; // Modo actual
  toggleTheme: () => void; // Alterna entre modos
  setTheme: (mode: ThemeMode) => void; // Establece modo específico
  isRecruiterMode: boolean; // true si modo recruiter
  isGeekMode: boolean; // true si modo geek
}
```

### Uso:

```tsx
import { ThemeProvider } from "./context";

function App() {
  return (
    <ThemeProvider defaultMode="recruiter">
      <YourApp />
    </ThemeProvider>
  );
}
```

---

## 3️⃣ HOOK USETHEME (src/hooks/useTheme.ts)

### Características:

✅ **Validación de contexto** - Lanza error si se usa fuera del Provider  
✅ **TypeScript completo** - Tipos seguros en toda la aplicación  
✅ **Documentación JSDoc** - Incluye ejemplos de uso

### Uso en componentes:

```tsx
import { useTheme } from "./hooks";

function MyComponent() {
  const { mode, toggleTheme, isGeekMode } = useTheme();

  return (
    <div className={isGeekMode ? "dark-mode" : "light-mode"}>
      <p>Modo actual: {mode}</p>
      <button onClick={toggleTheme}>
        Cambiar a {isGeekMode ? "Recruiter" : "Geek"}
      </button>
    </div>
  );
}
```

---

## 4️⃣ INDEX.CSS (src/index.css)

### Características implementadas:

✅ **Directivas Tailwind**: @tailwind base, components, utilities  
✅ **CSS Variables**: Custom properties que cambian con el tema  
✅ **Componentes reutilizables**:

- `.container-custom` - Contenedor con padding responsivo
- `.card-base` - Tarjeta con estilos adaptativos
- `.btn-primary` / `.btn-secondary` - Botones estilizados
- `.text-gradient` - Texto con gradiente
- `.section-title` / `.section-subtitle` - Títulos de sección

✅ **Utilidades personalizadas**:

- `.glass-effect` - Efecto glassmorphism
- `.hover-lift` - Efecto hover con elevación
- `.custom-scrollbar` - Scrollbar personalizado

✅ **Estilos base**:

- Transiciones suaves entre temas
- Scroll suave
- Selección de texto personalizada
- Estilos para código

---

## 🎯 PALETA DE COLORES

### Modo Recruiter (Light - Profesional)

```
Background:    #FAFAFA  (Gris muy claro)
Card:          #FFFFFF  (Blanco)
Text:          #333333  (Gris oscuro)
Primary:       #2563EB  (Azul)
Primary Hover: #1D4ED8  (Azul oscuro)
Accent:        #10B981  (Verde)
Border:        #E5E7EB  (Gris claro)
```

### Modo Geek (Dark - Técnico)

```
Background:         #0F172A  (Azul muy oscuro)
Background Second.: #1E293B  (Azul oscuro)
Card:              #1E293B  (Azul oscuro)
Text:              #FFFFFF  (Blanco)
Text Secondary:    #CBD5E1  (Gris claro)
Primary:           #06B6D4  (Cyan)
Primary Hover:     #0891B2  (Cyan oscuro)
Secondary:         #8B5CF6  (Púrpura)
Secondary Hover:   #7C3AED  (Púrpura oscuro)
Accent:            #10B981  (Verde)
Border:            #334155  (Gris azulado)
```

---

## 🚀 CÓMO USAR

### 1. Envolver la app con ThemeProvider

```tsx
// main.tsx o App.tsx
import { ThemeProvider } from "./context";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultMode="recruiter">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

### 2. Usar el hook en cualquier componente

```tsx
import { useTheme } from "./hooks";

function Header() {
  const { mode, toggleTheme, isGeekMode } = useTheme();

  return (
    <header className="bg-recruiter-card dark:bg-geek-card">
      <button onClick={toggleTheme} className="btn-primary">
        {isGeekMode ? "☀️ Modo Recruiter" : "🌙 Modo Geek"}
      </button>
    </header>
  );
}
```

### 3. Aplicar estilos condicionales

```tsx
// Opción 1: Clases de Tailwind
<div className="bg-recruiter-background dark:bg-geek-background">
  <p className="text-recruiter-primary dark:text-geek-primary">
    Texto con color adaptativo
  </p>
</div>

// Opción 2: Clases personalizadas del index.css
<div className="card-base">
  <button className="btn-primary">Click</button>
</div>

// Opción 3: Lógica condicional
const { isGeekMode } = useTheme();
<div className={isGeekMode ? 'geek-specific' : 'recruiter-specific'}>
  Contenido
</div>
```

---

## 📝 EJEMPLO COMPLETO

Ver el archivo `src/components/ThemeExample.tsx` para un ejemplo interactivo completo que demuestra:

- Uso del hook `useTheme`
- Controles para cambiar temas
- Visualización del estado actual
- Paleta de colores activa
- Aplicación de estilos condicionales

---

## ✅ CHECKLIST DE CONFIGURACIÓN

- [x] Estructura de carpetas feature-based
- [x] tailwind.config.js con temas personalizados
- [x] ThemeContext con persistencia en localStorage
- [x] Hook useTheme con tipos TypeScript
- [x] index.css con directivas Tailwind y utilidades
- [x] Tipos TypeScript para el sistema de temas
- [x] Componente de ejemplo
- [x] Documentación completa

---

## 🎓 PRÓXIMOS PASOS

1. **Instalar dependencias** (si aún no lo has hecho):

   ```bash
   npm install
   ```

2. **Crear un App.tsx básico** que use el ThemeProvider

3. **Desarrollar componentes UI** en `src/components/`:

   - Button
   - Input
   - Card
   - Modal
   - etc.

4. **Implementar features** en `src/features/`:

   - projects (Gestión de proyectos)
   - skills (Habilidades técnicas)
   - admin (Panel de administración)
   - certifications (Certificaciones)
   - about (Sobre mí)

5. **Crear layouts** en `src/layouts/`:
   - MainLayout
   - AdminLayout
   - etc.

---

## 💡 TIPS

- El tema se persiste automáticamente en localStorage
- La clase 'dark' se aplica al `<html>` cuando está en modo geek
- Todas las clases de Tailwind con `dark:` se activan automáticamente
- Usa `isRecruiterMode` o `isGeekMode` para lógica condicional
- Los CSS variables en `:root` se actualizan automáticamente

---

**¡El sistema de temas está completamente configurado y listo para usar!** 🎉
