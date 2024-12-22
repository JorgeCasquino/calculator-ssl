import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';

const nodeTypes = {
  start: {
    style: { background: '#4CAF50', color: 'white' },
  },
  process: {
    style: { background: '#2196F3', color: 'white' },
  },
  decision: {
    style: { background: '#FFC107' },
  },
  end: {
    style: { background: '#F44336', color: 'white' },
  },
};

const FlowChart = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeName, setNodeName] = useState('');
  const [nodeType, setNodeType] = useState('process');

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = () => {
    if (nodeName) {
      const newNode = {
        id: Date.now().toString(),
        type: nodeType,
        data: { label: nodeName },
        position: { x: 100, y: 100 },
      };
      setNodes((nodes) => [...nodes, newNode]);
      setNodeName('');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-bold">Diagrama de Flujo</h2>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          className="flex-1 rounded border p-2"
          placeholder="Nombre del nodo..."
        />
        <select
          value={nodeType}
          onChange={(e) => setNodeType(e.target.value)}
          className="rounded border p-2"
        >
          <option value="start">Inicio</option>
          <option value="process">Proceso</option>
          <option value="decision">Decisión</option>
          <option value="end">Fin</option>
        </select>
        <Button onClick={addNode}>Agregar Nodo</Button>
      </div>

      <div className="h-[600px] w-full border">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};
export default FlowChart;