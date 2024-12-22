import React from 'react';
import { useApp } from '../../hooks/useApp';
import DefectStats from './DefectStats';
import DefectFilters from './DefectFilters';
import DefectList from './DefectList';
import { useDefects } from '../../hooks/useDefects';

const DefectsContainer = () => {
  const { sidebarOpen } = useApp();
  const { loading, error } = useDefects();

  if (loading) {
    return (
      <div className={`min-h-screen bg-gray-100 p-6 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <div className="flex items-center justify-center">
          <div className="text-lg">Cargando...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-gray-100 p-6 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-100 p-6 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Defectos</h1>
        
        {/* Estadísticas */}
        <DefectStats />

        {/* Filtros */}
        <DefectFilters />

        {/* Lista de Defectos */}
        <DefectList />
      </div>
    </div>
  );
};

export default DefectsContainer;