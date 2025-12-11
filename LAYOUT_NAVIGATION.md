# 🚀 Layout y Navegación - Next-Gen Interactive Portfolio

## ✅ Componentes Implementados

### 1️⃣ **ThemeToggle** (`src/components/ui/ThemeToggle.tsx`)

Switch animado para cambiar entre modos Recruiter y Geek.

**Características:**

- ✅ Animación fluida con **framer-motion** (efecto spring)
- ✅ Iconos de Sol/Luna de **lucide-react**
- ✅ Transiciones suaves de opacidad y escala
- ✅ Feedback visual on hover
- ✅ Accesible (aria-label)
- ✅ Dos variantes: completa y compacta

**Uso:**

```tsx
import { ThemeToggle, ThemeToggleCompact } from './components/ui';

// Versión completa con iconos y texto
<ThemeToggle />

// Versión compacta (solo switch)
<ThemeToggleCompact />
```

---

### 2️⃣ **Navbar** (`src/components/layout/Navbar.tsx`)

Barra de navegación principal con diseño responsivo.

**Características:**

- ✅ Enlaces a secciones: Home, Timeline, Portfolio, Lab, Certs
- ✅ ThemeToggle integrado
- ✅ Logo adaptativo al tema (Portfolio / &lt;Dev /&gt;)
- ✅ Menú hamburguesa para móvil con animación
- ✅ Navbar fijo (fixed) con backdrop blur
- ✅ Iconos de lucide-react para cada sección
- ✅ Animaciones de entrada con framer-motion

**Navegación:**

- 🏠 **Home** - Página principal
- ⏰ **Timeline** - Línea de tiempo profesional
- 💼 **Portfolio** - Proyectos destacados
- 🧪 **Lab** - Habilidades técnicas
- 🏆 **Certs** - Certificaciones

---

### 3️⃣ **Layout** (`src/components/layout/Layout.tsx`)

Layout principal que envuelve toda la aplicación.

**Características:**

- ✅ Aplica estilos de tema automáticamente
- ✅ Incluye Navbar en todas las páginas
- ✅ Padding top para compensar navbar fijo
- ✅ **Fondo especial en Geek Mode:**
  - Gradiente sutil con colores cyan y púrpura
  - Patrón de ruido/textura muy suave
  - Grid cyber aesthetic casi imperceptible
- ✅ Footer básico con copyright
- ✅ Variante LayoutSimple sin navbar

**Uso:**

```tsx
import { Layout, LayoutSimple } from './components/layout';

// Layout completo con Navbar
<Layout>
  <YourContent />
</Layout>

// Layout simple sin Navbar (para login, admin, etc)
<LayoutSimple>
  <YourContent />
</LayoutSimple>
```

---

### 4️⃣ **App.tsx** Actualizado

Aplicación completamente funcional con:

- ✅ ThemeProvider configurado
- ✅ Layout implementado
- ✅ Contenido de ejemplo con tarjetas
- ✅ Hero section animado
- ✅ Indicadores de estado del tema

---

## 📦 Estructura de Archivos Creados

```
PortFolio/
├── package.json                    ✅ Dependencias configuradas
├── vite.config.ts                  ✅ Configuración de Vite
├── tsconfig.json                   ✅ TypeScript config
├── tsconfig.node.json              ✅ TypeScript para Vite
├── postcss.config.js               ✅ PostCSS + Autoprefixer
├── tailwind.config.js              ✅ Tailwind con temas
├── index.html                      ✅ HTML base con fuentes
├── .gitignore                      ✅ Git ignore
│
└── src/
    ├── main.tsx                    ✅ Entry point
    ├── App.tsx                     ✅ App con Layout
    ├── index.css                   ✅ Estilos Tailwind
    │
    ├── components/
    │   ├── index.ts                ✅ Barrel export
    │   ├── ui/
    │   │   ├── index.ts            ✅ Barrel export
    │   │   └── ThemeToggle.tsx     ✅ Switch animado
    │   └── layout/
    │       ├── index.ts            ✅ Barrel export
    │       ├── Navbar.tsx          ✅ Navegación
    │       └── Layout.tsx          ✅ Layout principal
    │
    ├── context/
    │   ├── index.ts                ✅ Barrel export
    │   └── ThemeContext.tsx        ✅ Context Provider
    │
    ├── hooks/
    │   ├── index.ts                ✅ Barrel export
    │   └── useTheme.ts             ✅ Hook personalizado
    │
    └── types/
        ├── index.ts                ✅ Barrel export
        └── theme.ts                ✅ Tipos del tema
```

---

## 🎨 Diferencias Visuales por Modo

### **Modo Recruiter** (Light - Profesional)

- 🎨 Fondo limpio `#FAFAFA`
- 📝 Texto oscuro `#333333`
- 🔵 Color primario azul `#2563EB`
- ✨ Look minimalista y profesional
- 🏢 Orientado a reclutadores y empresas

### **Modo Geek** (Dark - Técnico)

- 🌌 Fondo oscuro `#0F172A`
- 💡 Texto claro `#FFFFFF`
- 🔷 Color primario cyan `#06B6D4`
- 🟣 Color secundario púrpura `#8B5CF6`
- ⚡ Efectos especiales:
  - Gradiente radial sutil (cyan + púrpura)
  - Patrón de ruido fractal (opacity 1.5%)
  - Grid cyber (opacity 2%)
- 🤖 Look inmersivo "Cyber-clean"
- 👨‍💻 Orientado a desarrolladores

---

## 🚀 Instalación y Ejecución

### 1. Instalar Dependencias

```powershell
npm install
```

Esto instalará:

- ✅ React 18.3.1
- ✅ TypeScript 5.6.3
- ✅ Vite 5.4.11
- ✅ TailwindCSS 3.4.17
- ✅ **Framer Motion 11.11.17**
- ✅ **Lucide React 0.460.0**

### 2. Ejecutar en Desarrollo

```powershell
npm run dev
```

El servidor se abrirá automáticamente en `http://localhost:3000`

### 3. Probar el Cambio de Tema

1. Haz clic en el **ThemeToggle** en la navbar
2. Observa la transición animada del switch
3. El fondo cambiará según el modo:
   - **Recruiter**: Fondo claro y limpio
   - **Geek**: Fondo oscuro con efectos sutiles
4. El tema se guarda automáticamente en localStorage

---

## 🎯 Características del Layout

### Navbar

- ✅ Fixed top (sticky navigation)
- ✅ Backdrop blur effect
- ✅ Border bottom sutil
- ✅ Logo cambia según el tema
- ✅ Enlaces con hover states
- ✅ ThemeToggle siempre visible
- ✅ Menú móvil animado (hamburguesa)

### Fondo Geek Mode

El modo Geek tiene tres capas de efectos visuales:

1. **Gradiente Radial** (5% opacity):

   ```css
   - Cyan (#06B6D4) en 20%, 30%
   - Púrpura (#8B5CF6) en 80%, 70%
   ```

2. **Patrón de Ruido** (1.5% opacity):

   - Textura fractal con feTurbulence
   - Añade profundidad sin ser distractor

3. **Grid Cyber** (2% opacity):
   - Grid de 50px x 50px
   - Líneas cyan semi-transparentes

### Responsividad

- 📱 **Mobile**: Menú hamburguesa, logo compacto
- 💻 **Tablet**: Navegación horizontal, spacing optimizado
- 🖥️ **Desktop**: Full navbar, texto del modo visible

---

## 🎓 Ejemplos de Uso

### Cambiar Tema Programáticamente

```tsx
import { useTheme } from "./hooks";

function MyComponent() {
  const { setTheme, toggleTheme, mode, isGeekMode } = useTheme();

  return (
    <div>
      <p>Modo actual: {mode}</p>

      {/* Alternar */}
      <button onClick={toggleTheme}>Toggle</button>

      {/* Establecer específico */}
      <button onClick={() => setTheme("geek")}>Modo Geek</button>
      <button onClick={() => setTheme("recruiter")}>Modo Recruiter</button>

      {/* Condicional */}
      {isGeekMode && <p>Estás en modo geek! 🤖</p>}
    </div>
  );
}
```

### Usar Clases de Tema

```tsx
// Opción 1: Clases dark: de Tailwind
<div className="bg-recruiter-background dark:bg-geek-background">
  <p className="text-recruiter-text dark:text-geek-text">
    Texto adaptativo
  </p>
</div>

// Opción 2: Clases predefinidas de index.css
<div className="card-base">
  <button className="btn-primary">Click</button>
</div>

// Opción 3: Lógica condicional
const { isGeekMode } = useTheme();
<div className={isGeekMode ? 'geek-style' : 'recruiter-style'}>
  Contenido
</div>
```

---

## 🎨 Animaciones Implementadas

### ThemeToggle

- **Toggle switch**: Spring animation (stiffness: 500, damping: 30)
- **Iconos**: Fade + scale (duration: 0.2s)
- **Hover**: Background color transition

### Navbar

- **Links desktop**: Staggered fade-in (delay incremental)
- **Menú móvil**: Height + opacity (duration: 0.3s)
- **Items móvil**: Staggered slide-in

### Layout

- **Main content**: Fade in (duration: 0.5s)
- **Hero section**: Cascada de animaciones con delays

---

## 📝 Próximos Pasos

Ahora que tienes el Layout y Navegación listos, puedes:

1. ✅ **Crear secciones individuales:**

   - Home Hero section
   - Timeline profesional
   - Portfolio de proyectos
   - Lab de habilidades
   - Certificaciones

2. ✅ **Desarrollar componentes UI:**

   - Button variants
   - Card components
   - Modal/Dialog
   - Form inputs

3. ✅ **Implementar features:**

   - Sistema de proyectos
   - Gestión de habilidades
   - Panel de administración

4. ✅ **Routing:**
   - React Router para navegación SPA
   - Rutas protegidas para admin

---

## ✅ Checklist de Implementación

- [x] ThemeToggle con framer-motion
- [x] Navbar responsivo con enlaces
- [x] Layout con fondo especial Geek Mode
- [x] App.tsx con ThemeProvider
- [x] Archivos de configuración (Vite, TS, Tailwind)
- [x] Package.json con dependencias
- [x] Barrel exports para imports limpios
- [x] Documentación completa

---

## 🎉 ¡Listo para Desarrollar!

El sistema de Layout y Navegación está completamente funcional. Ejecuta `npm install && npm run dev` y comienza a construir tu portfolio. El cambio de tema funciona perfectamente con persistencia en localStorage.

**¡Prueba el ThemeToggle y disfruta las animaciones!** ✨
