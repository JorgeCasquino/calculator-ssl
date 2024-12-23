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
  if (!data || !data.values || !data.limits) {
    return <div>No hay datos disponibles</div>;
  }

  const { values, limits } = data;

  return (
    <div className="h-96 w-full">
      <LineChart width={800} height={400} data={values}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {limits.ucl !== undefined && (
          <ReferenceLine y={limits.ucl} stroke="red" label="UCL" />
        )}
        {limits.mean !== undefined && (
          <ReferenceLine y={limits.mean} stroke="green" label="Mean" />
        )}
        {limits.lcl !== undefined && (
          <ReferenceLine y={limits.lcl} stroke="red" label="LCL" />
        )}
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

export default ControlChart;