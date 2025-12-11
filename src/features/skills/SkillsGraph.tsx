import React, { useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import ForceGraph2D from 'react-force-graph-2d';
import * as LucideIcons from 'lucide-react';
import { mockSkills } from '../../mocks/data';
import { useTheme } from '../../hooks';
import type { Skill } from '../../types/database';

/**
 * SkillsGraph Component
 * 
 * Visualización de habilidades técnicas con dos modos distintos:
 * 
 * - Recruiter Mode: Grid limpio de pills/cards organizadas por categoría
 *   (Frontend, Backend, Tools) para lectura rápida y profesional
 * 
 * - Geek Mode: Force Directed Graph interactivo con física de nodos
 *   - Nodos con tamaño según proficiency
 *   - Colores cyberpunk (cyan, magenta, neon green)
 *   - Hover para ver nombre de tecnología
 *   - Efecto de repulsión y flotación
 */

interface GraphNode {
  id: string;
  name: string;
  val: number; // size of node (proficiency)
  color: string;
  category: Skill['category'];
}

interface GraphLink {
  source: string;
  target: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export const SkillsGraph: React.FC = () => {
  const { isGeekMode, isRecruiterMode } = useTheme();
  const graphRef = useRef<any>();

  /**
   * Obtener el componente de icono de Lucide
   */
  const getIcon = (iconName: string): React.ElementType => {
    const pascalCase = iconName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    // @ts-ignore
    return LucideIcons[pascalCase] || LucideIcons.Code2;
  };

  /**
   * Agrupar skills por categoría para Recruiter Mode
   */
  const skillsByCategory = useMemo(() => {
    const categories: Record<string, Skill[]> = {
      language: [],
      framework: [],
      tool: [],
    };

    mockSkills.forEach(skill => {
      categories[skill.category].push(skill);
    });

    // Ordenar por proficiency descendente en cada categoría
    Object.keys(categories).forEach(key => {
      categories[key].sort((a, b) => b.proficiency - a.proficiency);
    });

    return categories;
  }, []);

  /**
   * Preparar datos para Force Graph (Geek Mode)
   */
  const graphData = useMemo<GraphData>(() => {
    // Colores cyberpunk según categoría
    const categoryColors: Record<Skill['category'], string> = {
      language: '#06B6D4', // Cyan
      framework: '#EC4899', // Magenta/Pink
      tool: '#10B981', // Neon Green
    };

    const nodes: GraphNode[] = mockSkills.map(skill => ({
      id: skill.id,
      name: skill.name,
      val: skill.proficiency / 10, // Scale down for node size
      color: categoryColors[skill.category],
      category: skill.category,
    }));

    // Crear links entre skills de la misma categoría (opcional, para agrupación visual)
    const links: GraphLink[] = [];
    
    // Agrupar nodos por categoría para crear conexiones sutiles
    Object.keys(skillsByCategory).forEach(category => {
      const categorySkills = skillsByCategory[category as Skill['category']];
      
      // Conectar cada skill con la siguiente en su categoría
      for (let i = 0; i < categorySkills.length - 1; i++) {
        links.push({
          source: categorySkills[i].id,
          target: categorySkills[i + 1].id,
        });
      }
    });

    return { nodes, links };
  }, [skillsByCategory]);

  /**
   * Configurar nodo del grafo (Geek Mode)
   */
  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Inter, sans-serif`;
    
    // Dibujar nodo circular
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
    ctx.fillStyle = node.color;
    ctx.fill();

    // Glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = node.color;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Borde del nodo
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 0.5 / globalScale;
    ctx.stroke();

    // Mostrar label en hover o si el nodo es grande
    if (node.val > 8 || node.__indexColor) {
      const textWidth = ctx.measureText(label).width;
      const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);

      // Background del texto
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(
        node.x - bckgDimensions[0] / 2,
        node.y - node.val - bckgDimensions[1],
        bckgDimensions[0],
        bckgDimensions[1]
      );

      // Texto
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(label, node.x, node.y - node.val - fontSize / 2);
    }
  }, []);

  /**
   * Configurar link del grafo (Geek Mode)
   */
  const paintLink = useCallback((link: any, ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)'; // Purple transparente
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(link.source.x, link.source.y);
    ctx.lineTo(link.target.x, link.target.y);
    ctx.stroke();
  }, []);

  /**
   * Mapeo de categorías a nombres legibles
   */
  const categoryLabels: Record<Skill['category'], string> = {
    language: 'Lenguajes de Programación',
    framework: 'Frameworks & Librerías',
    tool: 'Herramientas & Tecnologías',
  };

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h2 className={`
          text-3xl md:text-4xl font-bold mb-4
          ${isGeekMode ? 'text-geek-text' : 'text-recruiter-text'}
        `}>
          {isGeekMode ? '🧪 Skills Lab' : '💼 Habilidades Técnicas'}
        </h2>
        <p className={`
          text-lg max-w-2xl mx-auto
          ${isGeekMode ? 'text-geek-text-secondary' : 'text-recruiter-secondary'}
        `}>
          {isGeekMode
            ? 'Explora mi stack tecnológico en un grafo de fuerzas interactivo'
            : 'Una visión general de mis competencias técnicas organizadas por categoría'
          }
        </p>
      </motion.div>

      {/* Vista según el modo */}
      {isRecruiterMode ? (
        // RECRUITER MODE: Grid limpio de pills por categoría
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-8"
        >
          {Object.entries(skillsByCategory).map(([category, skills], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + categoryIndex * 0.1 }}
              className="card-base p-6"
            >
              {/* Categoría header */}
              <h3 className="text-xl font-bold text-recruiter-text mb-4 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-recruiter-primary" />
                {categoryLabels[category as Skill['category']]}
                <span className="text-sm font-normal text-recruiter-secondary">
                  ({skills.length})
                </span>
              </h3>

              {/* Grid de skills */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {skills.map((skill, index) => {
                  const IconComponent = getIcon(skill.icon);
                  return (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: categoryIndex * 0.1 + index * 0.02 }}
                      className="bg-recruiter-background border border-recruiter-border rounded-lg p-4 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <IconComponent className="w-5 h-5 text-recruiter-primary group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-recruiter-text">{skill.name}</span>
                      </div>
                      
                      {/* Barra de proficiency */}
                      <div className="w-full bg-recruiter-border rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.proficiency}%` }}
                          transition={{ duration: 0.8, delay: categoryIndex * 0.1 + index * 0.02 + 0.2 }}
                          className="h-full bg-gradient-to-r from-recruiter-primary to-recruiter-accent rounded-full"
                        />
                      </div>
                      
                      <div className="text-xs text-recruiter-secondary mt-1 text-right">
                        {skill.proficiency}%
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {/* Estadísticas resumen */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card-base p-6"
          >
            <h3 className="text-lg font-semibold text-recruiter-text mb-4">Resumen</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-recruiter-primary mb-1">
                  {mockSkills.length}
                </div>
                <div className="text-sm text-recruiter-secondary">Total Skills</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-recruiter-primary mb-1">
                  {Math.round(mockSkills.reduce((sum, s) => sum + s.proficiency, 0) / mockSkills.length)}%
                </div>
                <div className="text-sm text-recruiter-secondary">Promedio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-recruiter-primary mb-1">
                  {mockSkills.filter(s => s.proficiency >= 90).length}
                </div>
                <div className="text-sm text-recruiter-secondary">Experto (90%+)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-recruiter-primary mb-1">
                  {new Set(mockSkills.map(s => s.category)).size}
                </div>
                <div className="text-sm text-recruiter-secondary">Categorías</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        // GEEK MODE: Force Directed Graph
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          {/* Contenedor del grafo */}
          <div className="card-base overflow-hidden" style={{ height: '600px' }}>
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              nodeLabel="name"
              nodeAutoColorBy="category"
              nodeCanvasObject={paintNode}
              linkCanvasObject={paintLink}
              linkDirectionalParticles={2}
              linkDirectionalParticleSpeed={0.002}
              linkDirectionalParticleWidth={1}
              linkDirectionalParticleColor={() => 'rgba(139, 92, 246, 0.5)'}
              backgroundColor="#0F172A"
              cooldownTime={3000}
              d3AlphaDecay={0.02}
              d3VelocityDecay={0.3}
              onNodeHover={(node) => {
                document.body.style.cursor = node ? 'pointer' : 'default';
              }}
              width={typeof window !== 'undefined' ? window.innerWidth * 0.9 : 800}
              height={600}
            />
          </div>

          {/* Leyenda */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 card-base p-4"
          >
            <h4 className="text-sm font-semibold text-geek-text mb-3">Leyenda del Grafo</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#06B6D4] shadow-lg shadow-cyan-500/50" />
                <div>
                  <div className="text-sm font-medium text-geek-text">Lenguajes</div>
                  <div className="text-xs text-geek-text-secondary">Programming Languages</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#EC4899] shadow-lg shadow-pink-500/50" />
                <div>
                  <div className="text-sm font-medium text-geek-text">Frameworks</div>
                  <div className="text-xs text-geek-text-secondary">Frameworks & Libraries</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#10B981] shadow-lg shadow-green-500/50" />
                <div>
                  <div className="text-sm font-medium text-geek-text">Herramientas</div>
                  <div className="text-xs text-geek-text-secondary">Tools & Technologies</div>
                </div>
              </div>
            </div>
            <p className="text-xs text-geek-text-secondary mt-4">
              💡 El tamaño de cada nodo representa el nivel de dominio (proficiency). 
              Los nodos están conectados por categoría y flotan con física de repulsión.
            </p>
          </motion.div>

          {/* Estadísticas cyberpunk */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: 'Total Nodes', value: mockSkills.length, color: 'text-geek-primary' },
              { label: 'Avg Proficiency', value: `${Math.round(mockSkills.reduce((sum, s) => sum + s.proficiency, 0) / mockSkills.length)}%`, color: 'text-geek-secondary' },
              { label: 'Expert Level', value: mockSkills.filter(s => s.proficiency >= 90).length, color: 'text-green-400' },
              { label: 'Categories', value: new Set(mockSkills.map(s => s.category)).size, color: 'text-cyan-400' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                className="card-base p-4 text-center border border-geek-border bg-geek-card/30 backdrop-blur-sm hover:border-geek-primary transition-colors"
              >
                <div className={`text-3xl font-bold mb-1 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-geek-text-secondary uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
