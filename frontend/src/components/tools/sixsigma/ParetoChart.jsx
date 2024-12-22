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
  return (
    <div className="h-96 w-full">
      <ComposedChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="type" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Bar
          yAxisId="left"
          dataKey="count"
          fill="#8884d8"
          name="Cantidad de Defectos"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="accumulative_percentage"
          stroke="#ff7300"
          name="Porcentaje Acumulado"
        />
      </ComposedChart>
    </div>
  );
};
export default ParetoChart;