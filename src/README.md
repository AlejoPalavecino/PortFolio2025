# Next-Gen Interactive Portfolio

## 📋 Estructura del Proyecto

Este proyecto sigue una **arquitectura feature-based** para mejor organización y escalabilidad.

```
src/
├── features/         # Lógica agrupada por funcionalidad
│   ├── projects/     # Feature de proyectos
│   ├── skills/       # Feature de habilidades
│   ├── admin/        # Feature de administración
│   └── ...
├── components/       # Componentes UI compartidos
│   ├── buttons/      # Botones reutilizables
│   ├── inputs/       # Inputs y formularios
│   └── ...
├── hooks/           # Custom hooks globales
│   └── useTheme.ts  # Hook para manejo de tema
├── context/         # Contextos de React
│   └── ThemeContext.tsx
├── layouts/         # Estructuras de página
├── types/           # Definiciones TypeScript
│   └── theme.ts
└── index.css        # Estilos globales con Tailwind
```

## 🎨 Sistema de Temas

El proyecto implementa un sistema de temas dual:

### Modo Recruiter (Light)

- **Background:** `#FAFAFA`
- **Text:** `#333333`
- **Primary:** `#2563EB` (Blue)
- **Enfoque:** Profesional, limpio, orientado a reclutadores

### Modo Geek (Dark)

- **Background:** `#0F172A`
- **Text:** `#FFFFFF`
- **Primary:** `#06B6D4` (Cyan)
- **Secondary:** `#8B5CF6` (Purple)
- **Enfoque:** Técnico, moderno, orientado a desarrolladores

## 🚀 Uso del ThemeContext

```tsx
import { ThemeProvider } from "./context/ThemeContext";
import { useTheme } from "./hooks/useTheme";

// En tu App.tsx
function App() {
  return (
    <ThemeProvider defaultMode="recruiter">
      <YourApp />
    </ThemeProvider>
  );
}

// En cualquier componente
function MyComponent() {
  const { mode, toggleTheme, isGeekMode } = useTheme();

  return (
    <div className="bg-recruiter-background dark:bg-geek-background">
      <p>Modo actual: {mode}</p>
      <button onClick={toggleTheme}>Cambiar Tema</button>
    </div>
  );
}
```

## 🎯 Características

- ✅ **TypeScript** para type-safety
- ✅ **TailwindCSS** con tema personalizado
- ✅ **Feature-based architecture** para escalabilidad
- ✅ **Theme persistence** en localStorage
- ✅ **Animaciones** y transiciones suaves
- ✅ **Responsive design** desde el inicio

## 📦 Próximos Pasos

1. Crear componentes UI base (Button, Input, Card)
2. Implementar features individuales (Projects, Skills, Admin)
3. Desarrollar layouts principales
4. Integrar sistema de routing
