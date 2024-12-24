import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';

const CheckSheet = () => {
  const [stations, setStations] = useState([]);
  const [pollutantTypes, setPollutantTypes] = useState([
    { 
      code: 'pm10', 
      name: 'Partículas PM10', 
      description: 'Partículas respirables menores a 10 micrómetros',
      unit: 'µg/m³',
      threshold: 100 // Límite según estándares de calidad de aire
    },
    { 
      code: 'pm2_5', 
      name: 'Partículas PM2.5', 
      description: 'Partículas respirables menores a 2.5 micrómetros',
      unit: 'µg/m³',
      threshold: 50 // Límite según estándares de calidad de aire
    },
    { 
      code: 'no2', 
      name: 'Dióxido de Nitrógeno', 
      description: 'Contaminante producido por combustión',
      unit: 'µg/m³',
      threshold: 200 // Límite según estándares de calidad de aire
    }
  ]);

  const [currentMeasurement, setCurrentMeasurement] = useState({
    station: '',
    pollutant: '',
    value: '',
    date: new Date().toLocaleDateString()
  });

  const [measurements, setMeasurements] = useState([]);

  // Opciones de estaciones (basadas en datos típicos de Lima)
  const stationOptions = [
    'Ate',
    'Cercado de Lima',
    'San Juan de Lurigancho',
    'Callao',
    'San Miguel',
    'Breña',
    'La Molina',
    'Surco'
  ];

  const addMeasurement = async () => {
    try {
      const pollutantInfo = pollutantTypes.find(p => p.code === currentMeasurement.pollutant);
      const token = localStorage.getItem('token'); // Obtener token almacenado
  
      const response = await fetch('http://localhost:3001/api/kpi/saveMeasurement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Añadir token de autorización
        },
        body: JSON.stringify({
          ...currentMeasurement,
          threshold: pollutantInfo?.threshold
        })
      });
  
      if (response.ok) {
        const newMeasurement = {...currentMeasurement};
        setMeasurements([...measurements, newMeasurement]);
        setCurrentMeasurement({
          station: '',
          pollutant: '',
          value: '',
          date: new Date().toLocaleDateString()
        });
      } else {
        console.error('Error en la respuesta:', response.status);
      }
    } catch (error) {
      console.error('Error al guardar la medición:', error);
    }
  };

  const checkThreshold = (pollutantCode, value) => {
    const pollutant = pollutantTypes.find(p => p.code === pollutantCode);
    return value > pollutant.threshold;
  };

  const calculateSummary = () => {
    // Resumen por contaminante
    const pollutantSummary = pollutantTypes.map(pollutant => {
      const relevantMeasurements = measurements.filter(m => m.pollutant === pollutant.code);
      return {
        ...pollutant,
        measurements: relevantMeasurements.length,
        exceedances: relevantMeasurements.filter(m => m.exceedsThreshold).length
      };
    });

    // Resumen por estación
    const stationSummary = stationOptions.map(station => {
      const stationMeasurements = measurements.filter(m => m.station === station);
      return {
        station,
        totalMeasurements: stationMeasurements.length,
        exceedances: stationMeasurements.filter(m => m.exceedsThreshold).length
      };
    });

    return { pollutantSummary, stationSummary };
  };

  const summary = calculateSummary();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hoja de Control de Calidad del Aire - Lima Metropolitana</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estación
              </label>
              <select
                value={currentMeasurement.station}
                onChange={(e) => setCurrentMeasurement({ 
                  ...currentMeasurement, 
                  station: e.target.value 
                })}
                className="w-full rounded-md border px-3 py-2"
              >
                <option value="">Seleccione Estación</option>
                {stationOptions.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contaminante
              </label>
              <select
                value={currentMeasurement.pollutant}
                onChange={(e) => setCurrentMeasurement({ 
                  ...currentMeasurement, 
                  pollutant: e.target.value 
                })}
                className="w-full rounded-md border px-3 py-2"
              >
                <option value="">Seleccione Contaminante</option>
                {pollutantTypes.map((pollutant) => (
                  <option key={pollutant.code} value={pollutant.code}>
                    {pollutant.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor de Medición
              </label>
              <input
                type="number"
                value={currentMeasurement.value}
                onChange={(e) => setCurrentMeasurement({ 
                  ...currentMeasurement, 
                  value: e.target.value 
                })}
                className="w-full rounded-md border px-3 py-2"
                placeholder="Ingrese valor de medición"
              />
            </div>
          </div>

          <div className="flex space-x-4 mb-4">
            <Button onClick={addMeasurement}>Agregar Medición</Button>
          </div>

          {/* Tabla de Mediciones */}
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contaminante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {measurements.map((measurement) => {
                  const pollutant = pollutantTypes.find(p => p.code === measurement.pollutant);
                  return (
                    <tr key={measurement.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{measurement.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{measurement.station}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{pollutant.name}</td>
                      <td className={`px-6 py-4 whitespace-nowrap ${measurement.exceedsThreshold ? 'text-red-600 font-bold' : ''}`}>
                        {measurement.value} {pollutant.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {measurement.exceedsThreshold ? (
                          <span className="text-red-600 font-bold">Sobre Límite</span>
                        ) : (
                          <span className="text-green-600">Normal</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Resumen */}
          {measurements.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen por Contaminante</CardTitle>
                </CardHeader>
                <CardContent>
                  {summary.pollutantSummary.map((pollutant) => (
                    <div key={pollutant.code} className="mb-2">
                      <p className="font-semibold">{pollutant.name}</p>
                      <p>Total Mediciones: {pollutant.measurements}</p>
                      <p className="text-red-600">
                        Excedencias: {pollutant.exceedances}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumen por Estación</CardTitle>
                </CardHeader>
                <CardContent>
                  {summary.stationSummary.map((station) => (
                    <div key={station.station} className="mb-2">
                      <p className="font-semibold">{station.station}</p>
                      <p>Total Mediciones: {station.totalMeasurements}</p>
                      <p className="text-red-600">
                        Excedencias: {station.exceedances}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckSheet;