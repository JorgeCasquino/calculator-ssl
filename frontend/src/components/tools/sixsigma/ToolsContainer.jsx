import React from 'react';
import { useApp } from '../../../hooks/useApp';
import { useDataAnalysis } from '../../../hooks/useDataAnalysis'; // Nuevo import
import { Card, CardHeader, CardTitle } from '../../../components/ui/card';

import CauseEffect from './CauseEffect';
import ParetoChart from './ParetoChart';
import ControlChart from './ControlChart';
import Histogram from './Histogram';
import ScatterPlot from './ScatterPlot';
import CheckSheet from './CheckSheet';
import FlowChart from './FlowChart';

const ToolsContainer = () => {
  const { currentTool, setCurrentTool, sidebarOpen } = useApp();
  const { analysisData, loading, error } = useDataAnalysis(); // Nuevo hook

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
      data: analysisData?.paretoData
    },
    {
      id: 'control-chart',
      title: 'Gráfico de Control',
      component: ControlChart,
      data: analysisData?.controlData
    },
    {
      id: 'histogram',
      title: 'Histograma',
      component: Histogram,
      data: analysisData?.histogramData
    },
    {
      id: 'scatter-plot',
      title: 'Diagrama de Dispersión',
      component: ScatterPlot,
      data: analysisData?.scatterData,
      xLabel: 'PM10',
      yLabel: 'PM2.5'
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

  const selectedTool = tools.find((tool) => tool.id === currentTool);
  const CurrentToolComponent = selectedTool?.component;

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={`min-h-screen bg-gray-100 p-6 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Herramientas Six Sigma</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Card
              key={tool.id}
              className={`cursor-pointer ${currentTool === tool.id ? 'ring-2 ring-blue-500' : ''}`}
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
            <CurrentToolComponent data={selectedTool?.data} />
          </div>
        )}
      </div>
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