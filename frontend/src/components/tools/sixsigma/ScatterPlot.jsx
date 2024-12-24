import React, { useState } from 'react';
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

const ScatterPlot = ({ data, onPollutantChange = () => {} }) => {
  const [yPollutant, setYPollutant] = useState('pm10');

  const pollutantOptions = [
    { value: 'pm10', label: 'PM10 (µg/m³)' },
    { value: 'pm2_5', label: 'PM2.5 (µg/m³)' },
    { value: 'no2', label: 'NO2 (µg/m³)' }
  ];

  const handleYChange = (e) => {
    const newYPollutant = e.target.value;
    setYPollutant(newYPollutant);
    // Verificación adicional para evitar errores
    if (typeof onPollutantChange === 'function') {
      onPollutantChange(newYPollutant);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-bold">Diagrama de Dispersión Mensual de Contaminantes</h2>
      
      <div className="flex space-x-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Eje X: Meses</label>
          <p className="mt-1 text-sm text-gray-500">Fijo</p>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Eje Y: Contaminante</label>
          <select 
            value={yPollutant}
            onChange={handleYChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
          >
            {pollutantOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="x" 
              domain={[1, 12]}
              tickFormatter={(value) => {
                const monthNames = [
                  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
                ];
                return monthNames[value - 1];
              }}
              label={{ value: 'Mes', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              label={{ 
                value: pollutantOptions.find(opt => opt.value === yPollutant).label, 
                angle: -90, 
                position: 'insideLeft' 
              }} 
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }} 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-4 border rounded shadow">
                      <p><strong>Mes:</strong> {data.monthName}</p>
                      <p><strong>Promedio:</strong> {data.y}</p>
                      <p><strong>Mínimo:</strong> {data.minValue}</p>
                      <p><strong>Máximo:</strong> {data.maxValue}</p>
                      <p><strong>Puntos de datos:</strong> {data.dataPoints}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Scatter 
              name="Promedio Mensual" 
              data={data} 
              fill="#8884d8"
              line
              lineType="joint"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScatterPlot;