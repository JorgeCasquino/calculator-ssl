import React, { useState } from 'react';
import { useReports } from '../../hooks/useReports';
import { FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Select } from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '../../components/ui/card';

const ReportGenerator = () => {
  const { generateReport, loading } = useReports();
  const [reportConfig, setReportConfig] = useState({
    type: 'defects',
    format: 'pdf',
    startDate: '',
    endDate: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await generateReport(reportConfig);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Generador de Reportes</h1>

      <Card>
        <CardHeader>
          <CardTitle>Configuración del Reporte</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Reporte
                </label>
                <Select
                  value={reportConfig.type}
                  onChange={(e) =>
                    setReportConfig({ ...reportConfig, type: e.target.value })
                  }
                >
                  <option value="Causa Efecto">Causa Efecto</option>
                  <option value="Diagrama de Pareto">Diagrama de Pareto</option>
                  <option value="Grafico de control">Grafico de control</option>
                  <option value="Histograma">Histograma</option>
                  <option value="Diagrama de Dispersión">Diagrama de Dispersión</option>
                  <option value="Hoja de Verificación">Hoja de Verificación</option>
                  <option value="Diagrama de Flujo">Diagrama de Flujo</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Formato
                </label>
                <Select
                  value={reportConfig.format}
                  onChange={(e) =>
                    setReportConfig({ ...reportConfig, format: e.target.value })
                  }
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha Inicio
                </label>
                <Input
                  type="date"
                  value={reportConfig.startDate}
                  onChange={(e) =>
                    setReportConfig({ ...reportConfig, startDate: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha Fin
                </label>
                <Input
                  type="date"
                  value={reportConfig.endDate}
                  onChange={(e) =>
                    setReportConfig({ ...reportConfig, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Generar Reporte</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerator;