import React, { useEffect } from 'react';
import { useReports } from '../../hooks/useReports';
import { Download, FileText, File, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '../ui/table';
import { Card, CardContent } from '../ui/card';

const ReportList = () => {
  const { reports, fetchReports, downloadReport, loading } = useReports();

  useEffect(() => {
    fetchReports();
  }, []);

  const getFormatIcon = (format) => {
    switch (format?.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'excel':
        return <File className="h-4 w-4 text-green-500" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Reportes Generados</h2>
        <Button
          variant="outline"
          onClick={fetchReports}
          disabled={loading}
        >
          Actualizar
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Formato</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getFormatIcon(report.format)}
                        <span className="capitalize">{report.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="uppercase">{report.format}</TableCell>
                    <TableCell>
                      {new Date(report.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          report.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {report.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadReport(report.id)}
                        disabled={report.status !== 'completed'}
                        className="hover:text-blue-600"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportList;