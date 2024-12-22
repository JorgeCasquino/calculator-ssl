import React, { useState } from 'react';
import { useUpload } from '../../hooks/useUpload';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const DataUploader = () => {
  const { uploadFile, loading, progress } = useUpload();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['xlsx', 'xls', 'csv'];
    const fileType = file.name.split('.').pop().toLowerCase();

    if (!allowedTypes.includes(fileType)) {
      setError('Tipo de archivo no permitido. Use Excel o CSV.');
      return;
    }

    try {
      setError(null);
      setSuccess(false);
      await uploadFile(file);
      setSuccess(true);
      event.target.value = null;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Cargar Datos</h1>

      <Card>
        <CardHeader>
          <CardTitle>Subir Archivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Clic para subir</span> o
                    arrastrar y soltar
                  </p>
                  <p className="text-xs text-gray-500">
                    XLSX, XLS, CSV (MAX. 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  disabled={loading}
                />
              </label>
            </div>

            {loading && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-500 text-center">
                  {progress}% Completado
                </p>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 text-green-700">
                <FileText className="h-4 w-4" />
                <span>Archivo cargado exitosamente</span>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};