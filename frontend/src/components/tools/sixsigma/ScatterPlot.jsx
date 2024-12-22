import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ScatterPlot = ({ data, xLabel, yLabel }) => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-bold">Diagrama de Dispersión</h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="x" name={xLabel} />
            <YAxis type="number" dataKey="y" name={yLabel} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name="Datos" data={data} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default ScatterPlot;