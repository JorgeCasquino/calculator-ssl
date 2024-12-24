import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '../../../components/ui/card';

const IshikawaDiagram = () => {
  // Predefined categories based on air quality data structure
  const [causes] = useState({
    'Recolección de Datos': [
      'Registro de ID Estación',
      'Registros de Fecha y Hora',
      'Precisión de Coordenadas',
      'Gestión de Fecha de Corte'
    ],
    'Mediciones': [
      'Monitoreo de PM10',
      'Monitoreo de PM2.5',
      'Monitoreo de NO2',
      'Mediciones de Altitud'
    ],
    'Ubicación': [
      'Coordenadas Geográficas',
      'Clasificación por Departamento',
      'Gestión de Provincia',
      'Asignación de Distrito'
    ],
    'Equipamiento': [
      'Calibración de Sensores',
      'Mantenimiento de Estaciones',
      'Fiabilidad del Equipo',
      'Frecuencia de Medición'
    ],
    'Ambiental': [
      'Condiciones Climáticas',
      'Variaciones Estacionales',
      'Fuentes de Contaminación Local',
      'Factores Topográficos'
    ],
    'Proceso': [
      'Validación de Datos',
      'Codificación UBIGEO',
      'Metodología de Muestreo',
      'Control de Calidad'
    ]
  });

  const [effect] = useState('Precisión en Datos de Calidad del Aire');

  // Calculate angles for the fishbone branches
  const calculateBranchAngle = (index, total) => {
    const baseAngle = 30; // angle from horizontal
    const isTop = index < total / 2;
    return `rotate(${isTop ? -baseAngle : baseAngle}deg)`;
  };

  return (
    <Card className="p- w-full max-w-6xl mx-auto h-96 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Main effect box */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-48 h-24 border-2 border-gray-800 flex items-center justify-center text-center bg-blue-100 rounded-lg">
          <span className="font-semibold">{effect}</span>
        </div>

        {/* Main spine */}
        <div className="h-2 bg-gray-800 w-full relative">
          {/* Cause categories */}
          {Object.entries(causes).map(([category, categoryCauses], index, array) => {
            const topSection = index < array.length / 2;
            const verticalPosition = topSection ? 'bottom-4' : 'top-4';
            const textAlignment = topSection ? 'bottom-full mb-2' : 'top-full mt-2';
            
            return (
              <div
                key={category}
                className={`absolute ${verticalPosition} w-48`}
                style={{
                  left: `${(index * 16) + 5}%`,
                }}
              >
                {/* Category branch */}
                <div 
                  className="w-1 h-32 bg-gray-600 origin-bottom"
                  style={{ transform: calculateBranchAngle(index, array.length) }}
                >
                  {/* Category name */}
                  <div className={`absolute ${textAlignment} left-1/2 -translate-x-1/2 text-sm font-medium text-center w-full`}>
                    {category}
                  </div>
                  
                  {/* Category causes */}
                  <div className="absolute left-full ml-2 space-y-1 text-xs w-40">
                    {categoryCauses.map((cause, i) => (
                      <div
                        key={i}
                        className="bg-gray-100 p-1 rounded border border-gray-300"
                      >
                        {cause}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default IshikawaDiagram;