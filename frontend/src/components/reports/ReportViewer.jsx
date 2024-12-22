import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useReports } from '../../hooks/useReports';
import { Document, Page } from 'react-pdf';

const ReportViewer = () => {
  const { id } = useParams();
  const { getReport } = useReports();
  const [report, setReport] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    const loadReport = async () => {
      const data = await getReport(id);
      setReport(data);
    };
    loadReport();
  }, [id]);

  if (!report) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Visualizador de Reporte</h2>
        <Button
          variant="outline"
          onClick={() => window.print()}
          className="flex items-center space-x-2"
        >
          <Printer className="h-4 w-4" />
          <span>Imprimir</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {report.format === 'pdf' ? (
            <div className="flex flex-col items-center">
              <Document
                file={report.url}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              >
                <Page pageNumber={pageNumber} />
              </Document>
              <div className="mt-4 flex items-center space-x-4">
                <Button
                  onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                  disabled={pageNumber <= 1}
                >
                  Anterior
                </Button>
                <span>
                  Página {pageNumber} de {numPages}
                </span>
                <Button
                  onClick={() =>
                    setPageNumber(Math.min(numPages, pageNumber + 1))
                  }
                  disabled={pageNumber >= numPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Button onClick={() => downloadReport(report.id)}>
                <Download className="mr-2 h-4 w-4" />
                Descargar Excel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};