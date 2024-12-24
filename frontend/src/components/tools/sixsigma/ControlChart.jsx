import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts';

const ControlChart = ({ data, onPollutantChange }) => {
  const [pollutant, setPollutant] = useState('pm10');

  const pollutantOptions = [
    { value: 'pm10', label: 'PM10 (µg/m³)' },
    { value: 'pm2_5', label: 'PM2.5 (µg/m³)' },
    { value: 'no2', label: 'NO2 (µg/m³)' }
  ];

  const handlePollutantChange = (e) => {
    const newPollutant = e.target.value;
    setPollutant(newPollutant);
    onPollutantChange(newPollutant);
  };

  if (!data || !data.values || !data.limits) {
    return <div>No hay datos disponibles</div>;
  }

  const { values, limits } = data;

  return (
    <div className="space-y-6 p-6">
      <div className="flex space-x-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Contaminante</label>
          <select 
            value={pollutant}
            onChange={handlePollutantChange}
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

      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={values}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis 
              label={{ 
                value: pollutantOptions.find(opt => opt.value === pollutant).label, 
                angle: -90, 
                position: 'insideLeft' 
              }} 
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-4 border rounded shadow">
                      <p><strong>Mes:</strong> {data.date}</p>
                      <p><strong>Valor:</strong> {data.value}</p>
                      <p><strong>Estado:</strong> {
                        data.status === 'out_of_control' ? 'Fuera de Control' :
                        data.status === 'warning' ? 'Advertencia' : 'Normal'
                      }</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            
            {/* Límites de control */}
            <ReferenceLine y={limits.ucl} stroke="red" strokeDasharray="5 5" label="UCL" />
            <ReferenceLine y={limits.lcl} stroke="red" strokeDasharray="5 5" label="LCL" />
            
            {/* Límites de advertencia */}
            <ReferenceLine y={limits.upperWarning} stroke="orange" strokeDasharray="3 3" label="Advertencia Superior" />
            <ReferenceLine y={limits.lowerWarning} stroke="orange" strokeDasharray="3 3" label="Advertencia Inferior" />
            
            {/* Línea de media */}
            <ReferenceLine y={limits.mean} stroke="green" label="Media" />

            {/* Línea de datos */}
            <Line
  type="monotone"
  dataKey="value"
  stroke="#8884d8"
  name="Valor"
  dot={(props) => {
    const { payload, cx, cy } = props;
    let fill = '#8884d8';
    if (payload && payload.status === 'out_of_control') fill = 'red';
    else if (payload && payload.status === 'warning') fill = 'orange';
    
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={5} 
        fill={fill} 
        stroke="#fff" 
        strokeWidth={2} 
      />
    );
  }}
/>
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <h3 className="font-bold">Interpretación de Límites de Control:</h3>
        <ul className="list-disc pl-5">
          <li>Línea Verde: Media del proceso</li>
          <li>Líneas Rojas: Límites de Control (UCL/LCL) - 3σ</li>
          <li>Líneas Naranjas: Límites de Advertencia - 2σ</li>
          <li>Puntos Coloreados: 
            <span className="text-red-500"> Rojo (Fuera de Control)</span>, 
            <span className="text-orange-500"> Naranja (Advertencia)</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ControlChart;