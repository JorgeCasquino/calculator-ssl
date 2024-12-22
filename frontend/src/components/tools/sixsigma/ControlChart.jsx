import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';

const ControlChart = ({ data }) => {
  const { values, limits } = data;

  return (
    <div className="h-96 w-full">
      <LineChart width={800} height={400} data={values}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <ReferenceLine y={limits.ucl} stroke="red" label="UCL" />
        <ReferenceLine y={limits.mean} stroke="green" label="Mean" />
        <ReferenceLine y={limits.lcl} stroke="red" label="LCL" />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          name="Valor"
          dot={false}
        />
      </LineChart>
    </div>
  );
};

export { Dashboard, KPICard, ParetoChart, ControlChart };