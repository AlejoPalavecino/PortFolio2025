# Next-Gen Interactive Portfolio - Project Structure

## 📁 Folder Structure

```
src/
├── features/              # Feature-based modules
│   ├── projects/         # Project showcase functionality
│   ├── skills/           # Skills visualization (graph nodes)
│   ├── certifications/   # Certifications display
│   ├── admin/            # Admin panel & CRUD operations
│   └── about/            # About me section
│
├── components/           # Reusable UI components
│   ├── ui/              # Pure UI components (buttons, cards, etc.)
│   └── layout/          # Layout components (header, footer, etc.)
│
├── context/             # React Context providers
│   └── ThemeContext.tsx # Global theme management
│
├── hooks/               # Custom React hooks
│   └── useTheme.ts      # Theme consumption hook
│
├── types/               # TypeScript type definitions
│   └── theme.ts         # Theme-related types
│
├── lib/                 # External library configurations
│   └── (supabase, etc.)
│
└── utils/               # Utility functions
    └── (helpers, constants, etc.)
```

## 🎨 Theme System

The portfolio uses a dual-theme system:

### Recruiter Mode

- **Target**: Recruiters and HR professionals
- **Style**: Clean, professional, corporate
- **Colors**:
  - Background: #FAFAFA (Off-white)
  - Text: #333333 (Dark gray)
  - Accent: #2563EB (Corporate blue)

### Geek Mode

- **Target**: Technical professionals and developers
- **Style**: Dark, immersive, with neon accents
- **Colors**:
  - Background: #0F172A (Deep dark blue)
  - Text: #FFFFFF (White)
  - Accents: #06B6D4 (Cyan) & #8B5CF6 (Purple)
  - Effects: Gradients, glassmorphism, glow effects

## 🚀 Usage Examples

### Setting up ThemeProvider in your App

```tsx
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App";

function Root() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
```

### Using the theme in components

```tsx
import { useTheme } from "./hooks/useTheme";

function MyComponent() {
  const { mode, toggleTheme, isGeekMode } = useTheme();

  return (
    <div
      className={isGeekMode ? "bg-geek-background" : "bg-recruiter-background"}
    >
      <h1 className={isGeekMode ? "text-geek-text" : "text-recruiter-text"}>
        Welcome to {mode} mode!
      </h1>
      <button
        onClick={toggleTheme}
        className={isGeekMode ? "bg-geek-cyan" : "bg-recruiter-accent"}
      >
        Toggle Theme
      </button>
    </div>
  );
}
```

## 📦 Features Organization

Each feature folder should contain:

- Components specific to that feature
- Custom hooks for that feature
- Types/interfaces for that feature
- Utilities specific to that feature

Example structure for `features/projects/`:

```
projects/
├── components/
│   ├── ProjectCard.tsx
│   ├── ProjectGrid.tsx
│   └── ProjectDetail.tsx
├── hooks/
│   └── useProjects.ts
├── types/
│   └── project.types.ts
└── index.ts (exports)
```

## 🎯 Design Principles

1. **Feature-based architecture**: Group by feature, not by type
2. **Composability**: Build small, reusable components
3. **Type safety**: Leverage TypeScript for better DX
4. **Performance**: Use React 18 features (Suspense, Transitions)
5. **Accessibility**: WCAG 2.1 AA compliance
6. **Responsive**: Mobile-first approach

## 🔧 TailwindCSS Custom Classes

Use semantic class names for themes:

- `bg-recruiter-background` / `bg-geek-background`
- `text-recruiter-text` / `text-geek-text`
- `bg-recruiter-accent` / `bg-geek-cyan` / `bg-geek-purple`

Custom animations available:

- `animate-fade-in`
- `animate-slide-up`
- `animate-glow-pulse`
- `animate-float`

## 📝 Next Steps

1. Install dependencies: `npm install react react-dom framer-motion`
2. Set up Supabase client in `src/lib/supabase.ts`
3. Create UI components in `src/components/ui/`
4. Build feature modules starting with `projects/`
5. Implement routing and page structure
