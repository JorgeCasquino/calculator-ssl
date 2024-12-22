import React from 'react';
import { useDefects } from '../../hooks/useDefects';
import { Select } from '../ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const DefectFilters = () => {
  const { filters, setFilters, processTypes = [], defectTypes = [] } = useDefects();

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setFilters({
      type: '',
      process: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Tipo de Defecto</label>
          <Select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="">Todos</option>
            {Array.isArray(defectTypes) && defectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Proceso</label>
          <Select
            value={filters.process}
            onChange={(e) => handleFilterChange('process', e.target.value)}
          >
            <option value="">Todos</option>
            {Array.isArray(processTypes) && processTypes.map((process) => (
              <option key={process} value={process}>
                {process}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Fecha Inicio</label>
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Fecha Fin</label>
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={handleReset}
        >
          Limpiar Filtros
        </Button>
        <Button onClick={() => console.log('Aplicando filtros:', filters)}>
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
};

export default DefectFilters;