import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const ParetoChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No hay datos disponibles para el gráfico de Pareto</div>;
  }

  return (
    <div className="h-96 w-full">
      <ComposedChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="type" />
        <YAxis yAxisId="left" label={{ value: 'Cantidad', angle: -90, position: 'insideLeft' }} />
        <YAxis yAxisId="right" orientation="right" label={{ value: '% Acumulado', angle: 90, position: 'insideRight' }} />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Cantidad" />
        <Line yAxisId="right" type="monotone" dataKey="accumulative_percentage" stroke="#ff7300" name="% Acumulado" />
      </ComposedChart>
    </div>
  );
};
export default ParetoChart;