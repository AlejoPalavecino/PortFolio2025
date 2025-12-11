# 🧪 Skills Lab - Visualización de Habilidades Técnicas

## ✅ Implementación Completada

Se ha implementado la sección "Lab / Skills" con visualización adaptativa según el tema, utilizando **react-force-graph-2d** para el modo Geek y un grid limpio para el modo Recruiter.

---

## 📦 Dependencia Agregada

### **react-force-graph-2d** v1.25.4

```json
"react-force-graph-2d": "^1.25.4"
```

**Instalación:**

```powershell
npm install
```

Esta librería proporciona un componente de React para renderizar grafos de fuerzas (Force Directed Graphs) usando D3.js y Canvas, optimizado para rendimiento.

---

## 🎨 Componente Principal: SkillsGraph

### **Ubicación:** `src/features/skills/SkillsGraph.tsx`

Este componente tiene **DOS modos visuales completamente diferentes** según el tema activo:

---

## 📊 MODO RECRUITER (Profesional)

### Características:

✅ **Grid limpio y organizado** por categorías  
✅ **Pills/Cards** con diseño minimalista  
✅ **Legibilidad rápida** para reclutadores  
✅ **Barras de progreso** animadas mostrando proficiency  
✅ **Iconos** de Lucide React para cada skill  
✅ **Organización por categoría:**

- 💻 Lenguajes de Programación
- ⚛️ Frameworks & Librerías
- 🛠️ Herramientas & Tecnologías

### Diseño Visual:

```
┌─────────────────────────────────────┐
│ Lenguajes de Programación (4)      │
├─────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │TS   │ │ JS  │ │ Py  │ │Java │   │
│ │98%██│ │95%██│ │85%█ │ │75%█ │   │
│ └─────┘ └─────┘ └─────┘ └─────┘   │
└─────────────────────────────────────┘
```

### Interacciones:

- **Hover**: Elevación de card + shadow
- **Animación de entrada**: Stagger effect por categoría
- **Barras de progreso**: Animación de llenado gradual

### Estadísticas Incluidas:

- 📊 Total de Skills
- 📈 Promedio de Proficiency
- ⭐ Skills nivel Experto (90%+)
- 🏷️ Número de Categorías

---

## 🎮 MODO GEEK (Cyberpunk Interactive)

### Características:

✅ **Force Directed Graph** interactivo  
✅ **Física de nodos** con repulsión y flotación  
✅ **Colores cyberpunk** por categoría:

- 🔵 **Cyan** (#06B6D4) - Lenguajes
- 🔴 **Magenta** (#EC4899) - Frameworks
- 🟢 **Neon Green** (#10B981) - Herramientas

✅ **Tamaño de nodo** proporcional al proficiency  
✅ **Glow effects** en cada nodo  
✅ **Labels** en hover o nodos grandes  
✅ **Partículas animadas** en los links  
✅ **Canvas rendering** para máximo rendimiento

### Configuración del Grafo:

#### **Nodos:**

```typescript
{
  id: string,           // Identificador único
  name: string,         // Nombre de la skill
  val: number,          // Tamaño (proficiency/10)
  color: string,        // Color según categoría
  category: string      // language | framework | tool
}
```

#### **Links:**

- Conectan skills de la misma categoría
- Partículas animadas fluyendo
- Color púrpura semi-transparente
- Grosor: 0.5px

#### **Física del Grafo:**

```typescript
d3Force: {
  charge: { strength: -200 },      // Repulsión entre nodos
  center: { strength: 0.05 },       // Atracción al centro
  collision: {
    radius: node.val + 5            // Prevenir overlap
  }
}
```

#### **Renderizado Custom:**

**Nodos:**

```typescript
paintNode(node, ctx, globalScale) {
  // 1. Círculo con color de categoría
  // 2. Glow effect (shadowBlur: 10)
  // 3. Borde oscuro
  // 4. Label con background en hover
}
```

**Links:**

```typescript
paintLink(link, ctx) {
  // Línea púrpura semi-transparente
  // Partículas animadas fluyendo
}
```

### Interacciones:

- **Hover**: Cursor pointer + label visible
- **Drag**: Mover nodos (física se adapta)
- **Zoom**: Scroll para hacer zoom
- **Pan**: Drag del fondo para mover vista

### Leyenda Incluida:

- 🔵 Cyan = Lenguajes
- 🔴 Magenta = Frameworks
- 🟢 Green = Herramientas
- 💡 Tip: Tamaño = Nivel de dominio

### Estadísticas Cyberpunk:

- Total Nodes (cyan)
- Avg Proficiency (purple)
- Expert Level (green)
- Categories (cyan)

---

## 🎨 Comparación Visual

### Recruiter Mode:

```
Diseño:     Grid ordenado 2-4 columnas
Background: #FFFFFF (blanco)
Cards:      Bordes suaves, sombra ligera
Progress:   Barra horizontal con gradiente
Iconos:     Lucide icons pequeños
Animación:  Subtle, profesional
Objetivo:   Lectura rápida y clara
```

### Geek Mode:

```
Diseño:     Force Graph dinámico
Background: #0F172A (azul oscuro)
Nodos:      Círculos con glow cyberpunk
Tamaño:     Variable según proficiency
Colores:    Cyan, Magenta, Neon Green
Animación:  Física de repulsión continua
Objetivo:   Exploración interactiva
```

---

## 📂 Estructura de Archivos

```
src/
└── features/
    └── skills/
        ├── index.ts              ✅ Barrel export
        └── SkillsGraph.tsx       ✅ Componente principal
```

---

## 🚀 Integración en App.tsx

```tsx
import { SkillsGraph } from "./features/skills";

<section id="lab" className="py-16">
  <SkillsGraph />
</section>;
```

El componente detecta automáticamente el tema activo y renderiza la vista correspondiente.

---

## 🔧 Configuración del Force Graph

### Parámetros Principales:

```typescript
<ForceGraph2D
  graphData={graphData} // Nodos + Links
  nodeLabel="name" // Tooltip del nodo
  nodeAutoColorBy="category" // Color por categoría
  nodeCanvasObject={paintNode} // Render custom
  linkCanvasObject={paintLink} // Render custom links
  // Partículas animadas
  linkDirectionalParticles={2}
  linkDirectionalParticleSpeed={0.002}
  linkDirectionalParticleWidth={1}
  // Física
  cooldownTime={3000} // Tiempo de estabilización
  d3AlphaDecay={0.02} // Decay de energía
  d3VelocityDecay={0.3} // Fricción
  // Fuerzas
  d3Force={{
    charge: { strength: -200 }, // Repulsión
    center: { strength: 0.05 }, // Centramiento
    collision: { radius: val + 5 }, // Colisión
  }}
  // Visual
  backgroundColor="#0F172A"
  width={window.innerWidth * 0.9}
  height={600}
/>
```

---

## ✨ Animaciones Implementadas

### **Recruiter Mode:**

**Entrada de categorías:**

```typescript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
delay: 0.1 + categoryIndex * 0.1
```

**Cards individuales:**

```typescript
initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
delay: categoryIndex * 0.1 + index * 0.02
```

**Barras de progreso:**

```typescript
initial={{ width: 0 }}
animate={{ width: `${proficiency}%` }}
duration: 0.8
```

### **Geek Mode:**

**Entrada del grafo:**

```typescript
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
duration: 0.5
```

**Física del grafo:**

- Cooldown de 3 segundos
- Nodos flotan y se repelen continuamente
- Partículas animadas en links

---

## 🎯 Datos Utilizados

### **mockSkills** (15 tecnologías):

**Languages (Cyan):**

- TypeScript 95%
- JavaScript 98%
- Python 85%
- Java 75%

**Frameworks (Magenta):**

- React 95%
- Next.js 90%
- Node.js 88%
- Express 85%
- TailwindCSS 92%
- Django 78%

**Tools (Green):**

- Git 90%
- Docker 82%
- PostgreSQL 85%
- MongoDB 88%
- Figma 75%

---

## 💡 Características Técnicas

### **Performance:**

- ✅ Canvas rendering para el grafo (no SVG/HTML)
- ✅ Throttling automático de framer-motion
- ✅ Memoización de datos del grafo
- ✅ Callbacks optimizados con useCallback

### **Accesibilidad:**

- ✅ Labels en todos los nodos
- ✅ Tooltips en hover (Recruiter)
- ✅ Cursor pointer en nodos interactivos
- ✅ Keyboard navigation (futuro)

### **Responsive:**

- ✅ Grid adaptativo (2-4 columnas en Recruiter)
- ✅ Grafo responsive al ancho de ventana
- ✅ Estadísticas en grid responsive

---

## 🎨 Colores Cyberpunk (Geek Mode)

```css
/* Nodos por categoría */
Cyan:     #06B6D4  /* Languages */
Magenta:  #EC4899  /* Frameworks */
Green:    #10B981  /* Tools */

/* Links */
Purple:   rgba(139, 92, 246, 0.2)  /* Semi-transparente */

/* Background */
Dark:     #0F172A  /* Canvas background */

/* Glow Effects */
Shadow:   10px blur con color del nodo
Border:   #0F172A (contraste con nodos)
```

---

## 🔄 Transición Entre Modos

Cuando el usuario cambia el tema con el **ThemeToggle**:

1. **Desmonta** el componente actual
2. **Monta** el nuevo componente
3. **Animación** de entrada (fade + scale)
4. **No hay glitches** gracias a AnimatePresence

---

## 📊 Estadísticas Calculadas

Ambos modos muestran:

| Métrica      | Cálculo                     |
| ------------ | --------------------------- |
| Total Skills | `mockSkills.length`         |
| Promedio     | `sum(proficiency) / length` |
| Experto      | `filter(proficiency >= 90)` |
| Categorías   | `new Set(categories).size`  |

---

## 🚀 Instalación y Uso

### 1. Instalar dependencias:

```powershell
npm install
```

### 2. Ejecutar el proyecto:

```powershell
npm run dev
```

### 3. Navegar a Skills:

- Hacer clic en "Lab" en la navbar
- O scroll hasta la sección de Skills
- Cambiar el tema con el **ThemeToggle**

### 4. Interactuar con el grafo (Geek Mode):

- **Hover** sobre nodos para ver nombres
- **Drag** nodos para moverlos
- **Zoom** con scroll del mouse
- **Pan** arrastrando el fondo

---

## 🎯 Casos de Uso

### **Recruiter Mode:**

- 📄 CV visual para recruiters
- 📊 Vista rápida de competencias
- 📈 Nivel de expertise claro
- 🎯 Organizado por categoría

### **Geek Mode:**

- 🎮 Portfolio interactivo para devs
- 🔬 Exploración visual del stack
- 💫 Demostración de creatividad
- ⚡ Efecto "wow" para tech recruiters

---

## ✅ Checklist de Implementación

- [x] Dependencia react-force-graph-2d agregada
- [x] Componente SkillsGraph creado
- [x] Vista Grid para Recruiter Mode
- [x] Vista Force Graph para Geek Mode
- [x] Colores cyberpunk (cyan, magenta, green)
- [x] Tamaño de nodo según proficiency
- [x] Física de repulsión y flotación
- [x] Hover para mostrar nombres
- [x] Glow effects en nodos
- [x] Partículas animadas en links
- [x] Leyenda del grafo
- [x] Estadísticas en ambos modos
- [x] Animaciones con framer-motion
- [x] Integración en App.tsx
- [x] Navegación desde Navbar

---

## 🎓 Próximos Pasos Sugeridos

1. **Añadir más skills** a mockSkills
2. **Implementar filtros** en Recruiter Mode
3. **Zoom controls** para el grafo
4. **Exportar grafo** como imagen
5. **Modo 3D** con react-force-graph-3d
6. **Animación de entrada** del grafo más elaborada
7. **Click en nodo** para ver detalles de skill
8. **Search bar** para destacar skills específicas

---

**¡La visualización de Skills está completamente implementada!** 🎉

Ejecuta `npm install && npm run dev` y navega a la sección "Lab" para ver el grafo interactivo en Geek Mode o el grid organizado en Recruiter Mode.
