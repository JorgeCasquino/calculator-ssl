import React from 'react';
import { useDefects } from '../../hooks/useDefects';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

const DefectStats = () => {
  const { defectStats, loading } = useDefects();

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Estadísticas de Defectos</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total de Defectos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{defectStats.totalDefects}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Procesos Afectados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{defectStats.affectedProcesses}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tipos de Defectos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{defectStats.defectTypes}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Defectos por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={defectStats.defectsByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Cantidad" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Defectos por Proceso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={defectStats.defectsByProcess}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="process" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" name="Cantidad" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Defectos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={defectStats.defectTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  name="Defectos"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DefectStats;