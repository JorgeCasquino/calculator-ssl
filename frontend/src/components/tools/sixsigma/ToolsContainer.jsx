// src/components/tools/sixsigma/ToolsContainer.jsx
import React from 'react';
import { useApp } from '../../../hooks/useApp';
import { Card, CardHeader, CardTitle } from '../../../components/ui/card';

import CauseEffect from './CauseEffect';
import ParetoChart from './ParetoChart';
import ControlChart from './ControlChart';
import Histogram from './Histogram';
import ScatterPlot from './ScatterPlot';
import CheckSheet from './CheckSheet';
import FlowChart from './FlowChart';

const ToolsContainer = () => {
  const { currentTool, setCurrentTool } = useApp();

  const tools = [
    {
      id: 'cause-effect',
      title: 'Diagrama de Causa y Efecto',
      component: CauseEffect,
    },
    {
      id: 'pareto',
      title: 'Diagrama de Pareto',
      component: ParetoChart,
    },
    {
      id: 'control-chart',
      title: 'Gráfico de Control',
      component: ControlChart,
    },
    {
      id: 'histogram',
      title: 'Histograma',
      component: Histogram,
    },
    {
      id: 'scatter-plot',
      title: 'Diagrama de Dispersión',
      component: ScatterPlot,
    },
    {
      id: 'check-sheet',
      title: 'Hoja de Verificación',
      component: CheckSheet,
    },
    {
      id: 'flow-chart',
      title: 'Diagrama de Flujo',
      component: FlowChart,
    },
  ];

  const CurrentToolComponent = tools.find(
    (tool) => tool.id === currentTool
  )?.component || tools[0].component;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Herramientas Six Sigma</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card
            key={tool.id}
            className={`cursor-pointer hover:shadow-lg ${
              currentTool === tool.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setCurrentTool(tool.id)}
          >
            <CardHeader>
              <CardTitle>{tool.title}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {CurrentToolComponent && (
        <div className="mt-6 rounded-lg bg-white p-6 shadow">
          <CurrentToolComponent />
        </div>
      )}
    </div>
  );
};

export {
  CauseEffect,
  ParetoChart,
  ControlChart,
  Histogram,
  ScatterPlot,
  CheckSheet,
  FlowChart,
  ToolsContainer,
};