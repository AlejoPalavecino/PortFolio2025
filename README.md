# 🚀 Next-Gen Interactive Portfolio

Portfolio interactivo y moderno con sistema de temas dual, construido con React 18, TypeScript, TailwindCSS y Framer Motion.

## ✨ Características

- 🎨 **Sistema de Temas Dual**
  - **Modo Recruiter**: Diseño limpio y profesional (light)
  - **Modo Geek**: Estilo inmersivo cyber-clean (dark)
  - Persistencia automática en localStorage
- ⚡ **Tecnologías Modernas**

  - React 18.3 con TypeScript
  - Vite para desarrollo ultra-rápido
  - TailwindCSS para estilos utility-first
  - Framer Motion para animaciones fluidas
  - Lucide React para iconos modernos

- 🏗️ **Arquitectura Feature-based**

  - Código organizado por funcionalidad
  - Componentes reutilizables
  - Custom hooks globales
  - Context API para estado global

- 📱 **Diseño Responsivo**
  - Mobile-first approach
  - Navegación adaptativa
  - Menú hamburguesa animado

## 🎯 Modos Visuales

### Modo Recruiter (Profesional)

- Fondo claro y limpio `#FAFAFA`
- Paleta azul profesional `#2563EB`
- Look minimalista orientado a reclutadores

### Modo Geek (Técnico)

- Fondo oscuro inmersivo `#0F172A`
- Paleta cyan/púrpura `#06B6D4` / `#8B5CF6`
- Efectos visuales sutiles (gradientes, ruido, grid)
- Estética cyber-clean para developers

## 📦 Instalación

```powershell
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Preview de producción
npm run preview
```

## 🗂️ Estructura del Proyecto

```
src/
├── components/          # Componentes UI
│   ├── ui/             # Componentes reutilizables (ThemeToggle)
│   └── layout/         # Layouts y navegación (Navbar, Layout)
├── context/            # Context Providers (ThemeContext)
├── hooks/              # Custom hooks (useTheme)
├── types/              # Definiciones TypeScript
├── features/           # Features por funcionalidad
├── layouts/            # Page layouts
└── index.css           # Estilos globales con Tailwind
```

## 🎨 Uso del Sistema de Temas

```tsx
import { useTheme } from "./hooks";

function MyComponent() {
  const { mode, toggleTheme, isGeekMode } = useTheme();

  return (
    <div className="bg-recruiter-background dark:bg-geek-background">
      <button onClick={toggleTheme}>
        Cambiar a {isGeekMode ? "Recruiter" : "Geek"}
      </button>
    </div>
  );
}
```

## 🧩 Componentes Implementados

### ThemeToggle

Switch animado para cambiar entre modos con transiciones fluidas.

```tsx
import { ThemeToggle } from "./components/ui";

<ThemeToggle />;
```

### Navbar

Navegación principal con enlaces a secciones y ThemeToggle integrado.

- Home
- Timeline
- Portfolio (Proyectos)
- Lab (Habilidades)
- Certs (Certificaciones)

### Layout

Layout principal que envuelve la aplicación con estilos de tema automáticos.

```tsx
import { Layout } from "./components/layout";

<Layout>
  <YourContent />
</Layout>;
```

## 📚 Documentación

- 📖 [`THEME_SETUP.md`](./THEME_SETUP.md) - Guía completa del sistema de temas
- 🗂️ [`LAYOUT_NAVIGATION.md`](./LAYOUT_NAVIGATION.md) - Layout y navegación
- 📂 [`src/README.md`](./src/README.md) - Documentación de la estructura

## 🎯 Roadmap

- [x] Sistema de temas con persistencia
- [x] Layout y navegación responsiva
- [x] ThemeToggle animado
- [ ] Componentes UI base (Button, Card, Input)
- [ ] Secciones del portfolio (Home, Timeline, Projects)
- [ ] Sistema de gestión de proyectos
- [ ] Gestión de habilidades técnicas
- [ ] Panel de administración
- [ ] Sistema de certificaciones

## 🛠️ Stack Tecnológico

| Tecnología    | Versión  | Propósito    |
| ------------- | -------- | ------------ |
| React         | 18.3.1   | UI Framework |
| TypeScript    | 5.6.3    | Type Safety  |
| Vite          | 5.4.11   | Build Tool   |
| TailwindCSS   | 3.4.17   | Styling      |
| Framer Motion | 11.11.17 | Animaciones  |
| Lucide React  | 0.460.0  | Iconos       |

## 📝 Scripts Disponibles

```powershell
npm run dev       # Servidor de desarrollo (port 3000)
npm run build     # Build de producción
npm run preview   # Preview del build
npm run lint      # Linter ESLint
```

## 🎨 Personalización

### Colores del Tema

Edita `tailwind.config.js` para personalizar la paleta de colores:

```js
colors: {
  recruiter: {
    background: '#FAFAFA',
    primary: '#2563EB',
    // ...
  },
  geek: {
    background: '#0F172A',
    primary: '#06B6D4',
    // ...
  }
}
```

### Animaciones

Personaliza animaciones en `tailwind.config.js`:

```js
animation: {
  'fade-in': 'fadeIn 0.5s ease-in-out',
  'slide-up': 'slideUp 0.5s ease-out',
  // ...
}
```

## 🤝 Contribuir

Este es un proyecto de portfolio personal, pero las sugerencias son bienvenidas.

## 📄 Licencia

MIT License - Siéntete libre de usar este código como base para tu propio portfolio.

---

**Desarrollado con ❤️ usando React, TypeScript y TailwindCSS**
