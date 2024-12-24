import React, { useState } from 'react';
import api from '../../services/Api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Button } from '../../ui/button';
import { Select, SelectItem } from "../../ui/select";

const Histogram = () => {
  const [selectedPollutant, setSelectedPollutant] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [groupBy, setGroupBy] = useState('');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pollutants = [
    { value: 'pm10', label: 'PM10' },
    { value: 'pm2_5', label: 'PM2.5' },
    { value: 'no2', label: 'NO2' }
  ];

  const groupOptions = [
    { value: 'year', label: 'Año' },
    { value: 'month', label: 'Mes' }
  ];

  const handleQuery = async () => {
    if (!selectedPollutant || !startDate || !endDate || !groupBy) {
      setError('Por favor complete todos los campos');
      return;
    }

    // Validar que la fecha de inicio sea menor que la fecha final
    if (new Date(startDate) > new Date(endDate)) {
      setError('La fecha de inicio debe ser anterior a la fecha final');
      return;
    }

    setError(null);
    setLoading(true);
    setChartData([]);

    try {
      // Formatear las fechas explícitamente
      const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(endDate).toISOString().split('T')[0];

      // Log de parámetros originales y formateados
      console.log('Parámetros originales:', {
        pollutant: selectedPollutant,
        startDate,
        endDate,
        groupBy
      });

      console.log('Parámetros formateados:', {
        pollutant: selectedPollutant,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        groupBy
      });

      // Crear y loguear la URL completa
      const params = new URLSearchParams({
        pollutant: selectedPollutant,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        groupBy
      });
      
      console.log('URL de la consulta:', `/kpi/histogram?${params.toString()}`);

      const response = await api.get('/kpi/histogram', {
        params: {
          pollutant: selectedPollutant,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          groupBy
        }
      });

      console.log('Respuesta completa del servidor:', response);
      console.log('Datos recibidos:', response.data);

      if (response.data && response.data.data) {
        const processedData = response.data.data
          .map(item => {
            // Formatear el mes con dos dígitos
            const monthFormatted = item.month.toString().padStart(2, '0');
            
            return {
              date: `${response.data.year}-${monthFormatted}`,
              value: item.frequency.toFixed(2), // o el valor que corresponda
              readings: item.frequency
            };
          })
          .filter(item => item.value > 0); // Filtrar valores en 0

        console.log('Datos procesados:', processedData);

        if (processedData.length === 0) {
          setError('No se encontraron datos para el período seleccionado');
        } else {
          setChartData(processedData);
        }
      } else {
        console.error('Formato de datos inválido:', response.data);
        setError('Formato de datos inválido - Estructura inesperada en la respuesta');
      }
    } catch (error) {
      console.error('Error en la consulta:', error);
      console.error('Detalles del error:', {
        message: error.message,
        response: error.response,
        request: error.request
      });
      setError(error.response?.data?.error || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const formatXAxisTick = (value) => {
    if (groupBy === 'year') {
      return value;
    }
    const [year, month] = value.split('-');
    return `${month}/${year}`;
  };

  const formatTooltipValue = (value, name, props) => {
    if (name === 'value') {
      return [`${value} µg/m³`, 'Concentración'];
    }
    return [value, name];
  };

  const formatTooltipLabel = (label) => {
    if (groupBy === 'year') {
      return `Año ${label}`;
    }
    const [year, month] = label.split('-');
    return `${month}/${year}`;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex gap-4 flex-wrap">
        <Select 
          className="w-64"
          value={selectedPollutant}
          onChange={(e) => {
            console.log('Contaminante seleccionado:', e.target.value);
            setSelectedPollutant(e.target.value);
          }}
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
          value={groupBy}
          onChange={(e) => {
            console.log('Agrupación seleccionada:', e.target.value);
            setGroupBy(e.target.value);
          }}
        >
          <SelectItem value="" disabled>
            Agrupar por
          </SelectItem>
          {groupOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            console.log('Fecha de inicio seleccionada:', e.target.value);
            setStartDate(e.target.value);
          }}
          className="w-64 rounded-md border border-input px-3 py-2"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            console.log('Fecha de fin seleccionada:', e.target.value);
            setEndDate(e.target.value);
          }}
          className="w-64 rounded-md border border-input px-3 py-2"
        />

        <Button 
          onClick={handleQuery} 
          disabled={!selectedPollutant || !startDate || !endDate || !groupBy || loading}
        >
          {loading ? 'Cargando...' : 'Consultar'}
        </Button>
      </div>

      {error && (
        <div className="text-red-500 p-4 rounded-md bg-red-50">
          {error}
        </div>
      )}

      {chartData && chartData.length > 0 && (
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData}
              margin={{ top: 20, right: 30, left: 50, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tickFormatter={formatXAxisTick}
              />
              <YAxis 
                label={{ 
                  value: `${selectedPollutant.toUpperCase()} (µg/m³)`, 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: -5
                }} 
              />
              <Tooltip 
                formatter={formatTooltipValue}
                labelFormatter={formatTooltipLabel}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                fill="#8884d8" 
                name={`Concentración de ${selectedPollutant.toUpperCase()}`}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Histogram;