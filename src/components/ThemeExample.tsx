import React from 'react';
import { useTheme } from '../hooks';
import type { ThemeMode } from '../types';

/**
 * Componente de ejemplo que demuestra el uso del sistema de temas
 * 
 * Este componente sirve como referencia de cómo:
 * - Consumir el ThemeContext usando el hook useTheme
 * - Aplicar estilos condicionales según el tema activo
 * - Implementar controles para cambiar entre temas
 * 
 * NO renderices este componente en producción, es solo para referencia.
 */
export const ThemeExample: React.FC = () => {
  const { mode, toggleTheme, setTheme, isRecruiterMode, isGeekMode } = useTheme();

  const handleSetTheme = (newMode: ThemeMode) => {
    setTheme(newMode);
  };

  return (
    <div className="min-h-screen bg-recruiter-background dark:bg-geek-background transition-colors duration-300">
      <div className="container-custom section">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="section-title text-gradient">
            Sistema de Temas
          </h1>
          <p className="section-subtitle">
            Modo actual: <strong>{mode}</strong>
          </p>
        </header>

        {/* Controles de tema */}
        <div className="card-base p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-recruiter-text dark:text-geek-text">
            Controles de Tema
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={toggleTheme}
              className="btn-primary"
            >
              Toggle Theme (Alternar)
            </button>

            <button
              onClick={() => handleSetTheme('recruiter')}
              className={`btn-secondary ${isRecruiterMode ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isRecruiterMode}
            >
              Activar Modo Recruiter
            </button>

            <button
              onClick={() => handleSetTheme('geek')}
              className={`btn-secondary ${isGeekMode ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isGeekMode}
            >
              Activar Modo Geek
            </button>
          </div>
        </div>

        {/* Estado actual */}
        <div className="card-base p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-recruiter-text dark:text-geek-text">
            Estado del Tema
          </h2>
          
          <div className="space-y-3 font-mono text-sm">
            <div className="flex items-center gap-3">
              <span className="text-recruiter-secondary dark:text-geek-text-secondary">
                Modo:
              </span>
              <code className="bg-recruiter-primary-light dark:bg-geek-primary-light px-3 py-1 rounded">
                {mode}
              </code>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-recruiter-secondary dark:text-geek-text-secondary">
                isRecruiterMode:
              </span>
              <code className={`px-3 py-1 rounded ${
                isRecruiterMode 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              }`}>
                {isRecruiterMode.toString()}
              </code>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-recruiter-secondary dark:text-geek-text-secondary">
                isGeekMode:
              </span>
              <code className={`px-3 py-1 rounded ${
                isGeekMode 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              }`}>
                {isGeekMode.toString()}
              </code>
            </div>
          </div>
        </div>

        {/* Paleta de colores */}
        <div className="card-base p-8">
          <h2 className="text-2xl font-bold mb-6 text-recruiter-text dark:text-geek-text">
            Paleta de Colores Activa
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-full h-20 rounded-lg bg-recruiter-background dark:bg-geek-background border-2 border-recruiter-border dark:border-geek-border mb-2" />
              <p className="text-sm font-medium">Background</p>
            </div>
            
            <div className="text-center">
              <div className="w-full h-20 rounded-lg bg-recruiter-primary dark:bg-geek-primary mb-2" />
              <p className="text-sm font-medium">Primary</p>
            </div>
            
            <div className="text-center">
              <div className="w-full h-20 rounded-lg bg-recruiter-secondary dark:bg-geek-secondary mb-2" />
              <p className="text-sm font-medium">Secondary</p>
            </div>
            
            <div className="text-center">
              <div className="w-full h-20 rounded-lg bg-recruiter-accent dark:bg-geek-accent mb-2" />
              <p className="text-sm font-medium">Accent</p>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 p-6 bg-recruiter-primary-light dark:bg-geek-primary-light rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-recruiter-text dark:text-geek-text">
            💡 Uso del Hook useTheme
          </h3>
          <pre className="text-sm overflow-x-auto">
{`import { useTheme } from './hooks';

function MyComponent() {
  const { mode, toggleTheme, isGeekMode } = useTheme();
  
  return (
    <div className="bg-recruiter-background dark:bg-geek-background">
      <p>Modo: {mode}</p>
      <button onClick={toggleTheme}>Cambiar Tema</button>
    </div>
  );
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};
