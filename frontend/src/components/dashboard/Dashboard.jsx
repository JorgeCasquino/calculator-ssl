import React from 'react';
import { useKPI } from '../../hooks/useKPI';
import KPICard from './KPICard';
import  ParetoChart from '../tools/sixsigma/ParetoChart';
import ControlChart from '../tools/sixsigma/ControlChart';
import { Alert } from '../../components/ui/alert';

const Dashboard = () => {
  const { kpiData, loading, error } = useKPI();

  if (loading) return <div>Cargando...</div>;
  if (error) return <Alert variant="destructive">{error}</Alert>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <KPICard
          title="Total Defectos"
          value={kpiData?.summary?.total_defects || 0}
          icon={<AlertCircle className="h-6 w-6 text-red-500" />}
          change={kpiData?.summary?.defects_change || 0}
        />
        <KPICard
          title="Procesos Afectados"
          value={kpiData?.summary?.affected_processes || 0}
          icon={<Settings className="h-6 w-6 text-blue-500" />}
          change={kpiData?.summary?.processes_change || 0}
        />
        <KPICard
          title="Tasa de Defectos"
          value={`${kpiData?.summary?.defect_rate?.toFixed(2)}%` || '0%'}
          icon={<Percent className="h-6 w-6 text-green-500" />}
          change={kpiData?.summary?.rate_change || 0}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Análisis de Pareto</h2>
          <ParetoChart data={kpiData?.paretoData || []} />
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Gráfico de Control</h2>
          <ControlChart data={kpiData?.controlData || []} />
        </div>
      </div>

      {/* Process Impact Table */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Impacto por Proceso</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Proceso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Defectos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Porcentaje
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {kpiData?.processImpact?.map((process, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-6 py-4">{process.name}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {process.defects}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {process.percentage.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;