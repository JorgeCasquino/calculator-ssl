import React from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  {
    id: 'A',
    type: 'input',
    data: { label: 'Inicio' },
    position: { x: 250, y: 0 },
    style: { 
      background: '#4CAF50', 
      color: 'white', 
      borderRadius: '25px',
      width: 150,
      padding: '10px'
    }
  },
  {
    id: 'B',
    data: { label: 'Leer datos de calidad\ndel aire' },
    position: { x: 250, y: 80 },
    style: { 
      background: '#2196F3', 
      color: 'white',
      width: 150,
      padding: '10px'
    }
  },
  {
    id: 'C',
    data: { label: 'Preprocesar datos' },
    position: { x: 250, y: 160 },
    style: { 
      background: '#2196F3', 
      color: 'white',
      width: 150,
      padding: '10px'
    }
  },
  {
    id: 'D',
    data: { label: '¿Datos válidos?' },
    position: { x: 250, y: 240 },
    style: { 
      background: '#FFC107',
      width: 150,
      padding: '10px',
      textAlign: 'center'
    }
  },
  {
    id: 'G',
    data: { label: 'Descartar datos\ninválidos' },
    position: { x: 450, y: 240 },
    style: { 
      background: '#FF5722', 
      color: 'white',
      width: 150,
      padding: '10px'
    }
  },
  {
    id: 'E',
    data: { label: 'Generar análisis de\ncalidad del aire' },
    position: { x: 250, y: 320 },
    style: { 
      background: '#2196F3', 
      color: 'white',
      width: 150,
      padding: '10px'
    }
  },
  {
    id: 'F',
    data: { label: 'Mostrar resultados' },
    position: { x: 250, y: 400 },
    style: { 
      background: '#2196F3', 
      color: 'white',
      width: 150,
      padding: '10px'
    }
  },
  {
    id: 'H',
    type: 'output',
    data: { label: 'Fin' },
    position: { x: 250, y: 480 },
    style: { 
      background: '#F44336', 
      color: 'white', 
      borderRadius: '25px',
      width: 150,
      padding: '10px'
    }
  }
];

const initialEdges = [
  { id: 'A-B', source: 'A', target: 'B' },
  { id: 'B-C', source: 'B', target: 'C' },
  { 
    id: 'C-D', 
    source: 'C', 
    target: 'D',
    type: 'smoothstep'
  },
  { 
    id: 'D-G', 
    source: 'D', 
    target: 'G', 
    label: 'No',
    type: 'smoothstep'
  },
  { 
    id: 'D-E', 
    source: 'D', 
    target: 'E',
    label: 'Sí',
    type: 'smoothstep'
  },
  { id: 'E-F', source: 'E', target: 'F' },
  { id: 'F-H', source: 'F', target: 'H' }
];

const FlowChart = () => {
  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-bold">Diagrama de Flujo - Proceso de Calidad del Aire</h2>
      <div className="h-[600px] w-full border">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowChart;