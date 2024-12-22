import React, { useState } from 'react';
import { useReports } from '../../hooks/useReports';
import { FileText, Download } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ReportGenerator = () => {
  const { generateReport, downloadReport, loading } = useReports();
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
                  onValueChange={(value) =>
                    setReportConfig({ ...reportConfig, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="defects">Defectos</SelectItem>
                    <SelectItem value="kpi">KPIs</SelectItem>
                    <SelectItem value="process">Procesos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Formato
                </label>
                <Select
                  value={reportConfig.format}
                  onValueChange={(value) =>
                    setReportConfig({ ...reportConfig, format: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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