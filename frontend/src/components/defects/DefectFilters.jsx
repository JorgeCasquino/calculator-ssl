import React from 'react';
import { useDefects } from '../../hooks/useDefects';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const DefectFilters = () => {
  const { filters, setFilters, processTypes, defectTypes } = useDefects();

  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Tipo de Defecto</label>
          <Select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">Todos</option>
            {defectTypes.map((type) => (
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
            onChange={(e) => setFilters({ ...filters, process: e.target.value })}
          >
            <option value="">Todos</option>
            {processTypes.map((process) => (
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
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Fecha Fin</label>
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() =>
            setFilters({
              type: '',
              process: '',
              startDate: '',
              endDate: ''
            })
          }
        >
          Limpiar Filtros
        </Button>
        <Button
          onClick={() => {
            // Aplicar filtros y actualizar la lista
          }}
        >
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
};

export { DefectList, DefectForm, DefectStats, DefectFilters };