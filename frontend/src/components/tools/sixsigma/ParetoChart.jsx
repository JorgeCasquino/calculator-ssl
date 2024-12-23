import React, { useState } from 'react';
import api from '../../services/Api';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { Button } from '../../ui/button';
import { Select, SelectItem } from "../../ui/select";

const ParetoChart = () => {
  const [selectedPollutant, setSelectedPollutant] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const pollutants = [
    { value: 'pm10', label: 'PM10' },
    { value: 'pm2_5', label: 'PM2.5' },
    { value: 'no2', label: 'NO2' }
  ];

  const locations = [
    { value: 'distrito', label: 'Distrito' },
    { value: 'estacion', label: 'Estación' }
  ];

  const processData = (data) => {
    // Verificar que los datos son válidos
    if (!Array.isArray(data) || data.length === 0) {
      console.error('Datos inválidos:', data);
      return [];
    }

    // Asegurarse de que tenemos las propiedades necesarias
    if (!data[0].hasOwnProperty('average') || !data[0].hasOwnProperty('location')) {
      console.error('Datos no tienen la estructura esperada:', data[0]);
      return [];
    }

    // Ordenar los datos de mayor a menor por el promedio
    const sortedData = [...data].sort((a, b) => b.average - a.average);
    
    // Calcular la suma total
    const total = sortedData.reduce((sum, item) => sum + (Number(item.average) || 0), 0);
    
    console.log('Total calculado:', total);
    
    if (total === 0) {
      console.error('La suma total es 0, no se puede calcular porcentajes');
      return [];
    }

    // Calcular el porcentaje acumulado
    let runningSum = 0;
    
    const processedData = sortedData.map(item => {
      // Asegurarse de que average es un número
      const average = Number(item.average) || 0;
      runningSum += average;
      
      const percentage = (average / total) * 100;
      const accumulatedPercentage = (runningSum / total) * 100;
      
      console.log(`Procesando item:
        Location: ${item.location}
        Average: ${average}
        Running Sum: ${runningSum}
        Percentage: ${percentage}
        Accumulated: ${accumulatedPercentage}
      `);

      return {
        location: item.location,
        average: average,
        percentage: percentage,
        accumulatedPercentage: accumulatedPercentage
      };
    });

    console.log('Datos procesados:', processedData);
    return processedData;
  };

  const handleQuery = async () => {
    try {
      setLoading(true);
      const response = await api.get('/kpi/pareto', {
        params: {
          pollutant: selectedPollutant,
          location: selectedLocation
        }
      });
      
      console.log('Datos recibidos de la API:', response.data);
      
      const processedData = processData(response.data);
      if (processedData.length > 0) {
        setChartData(processedData);
      } else {
        console.error('No se pudieron procesar los datos');
      }
    } catch (error) {
      console.error('Error fetching Pareto data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex gap-4">
        <Select 
          className="w-64"
          value={selectedPollutant}
          onChange={(e) => setSelectedPollutant(e.target.value)}
        >
          <SelectItem value="" disabled>
            Seleccionar contaminante
          </SelectItem>
          {pollutants.map((pollutant) => (
            <SelectItem key={pollutant.value} value={pollutant.value}>
              {pollutant.label}
            </SelectItem>
          ))}
        </Select>
        
        <Select 
          className="w-64"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <SelectItem value="" disabled>
            Seleccionar ubicación
          </SelectItem>
          {locations.map((location) => (
            <SelectItem key={location.value} value={location.value}>
              {location.label}
            </SelectItem>
          ))}
        </Select>

        <Button 
          onClick={handleQuery} 
          disabled={!selectedPollutant || !selectedLocation || loading}
        >
          {loading ? 'Cargando...' : 'Consultar'}
        </Button>
      </div>

      {chartData && chartData.length > 0 && (
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart 
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="location" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis 
                yAxisId="left" 
                label={{ 
                  value: 'Promedio', 
                  angle: -90, 
                  position: 'insideLeft' 
                }} 
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                label={{ 
                  value: '% Acumulado', 
                  angle: 90, 
                  position: 'insideRight' 
                }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  const numValue = parseFloat(value);
                  if (name === '% Acumulado' || name === 'Porcentaje') {
                    return [isNaN(numValue) ? 0 : `${numValue.toFixed(2)}%`, name];
                  }
                  return [isNaN(numValue) ? 0 : numValue.toFixed(2), name];
                }}
              />
              <Legend />
              <Bar 
                yAxisId="left" 
                dataKey="average" 
                fill="#8884d8" 
                name="Promedio"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="accumulatedPercentage"
                stroke="#ff7300"
                name="% Acumulado"
                dot={{ stroke: '#ff7300', strokeWidth: 2, fill: '#fff' }}
              />
              <ReferenceLine
                yAxisId="right"
                y={80}
                label={{
                  value: "80%",
                  position: 'right',
                  fill: 'red'
                }}
                stroke="red"
                strokeDasharray="3 3"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ParetoChart;