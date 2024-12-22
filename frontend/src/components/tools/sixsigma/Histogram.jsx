import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Histogram = ({ data }) => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-bold">Histograma</h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="frequency" fill="#8884d8" name="Frecuencia" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default Histogram;