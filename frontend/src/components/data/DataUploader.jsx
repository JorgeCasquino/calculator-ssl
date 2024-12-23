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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DataUploader = () => {
  const { uploadFile, loading, progress } = useUpload();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedType, setSelectedType] = useState('');

  const fileTypes = [
    { 
      id: 'variedades', 
      label: 'Variedades', 
      files: ['VariedadMejoradas.csv', 'VariedadNativas.csv'],
      description: 'Datos de variedades mejoradas y nativas'
    },
    { 
      id: 'produccion', 
      label: 'Producción', 
      files: ['EstimacionesCosecha.csv', 'ProduccionDePapa.csv'],
      description: 'Datos de producción y estimaciones'
    },
    { 
      id: 'quimicos', 
      label: 'Control Químico', 
      files: ['ControlQuimico.csv'],
      description: 'Información de control químico'
    },
    { 
      id: 'limitantes', 
      label: 'Limitantes', 
      files: ['LimitantesCultivoPapa.csv'],
      description: 'Datos de factores limitantes'
    }
  ];

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!selectedType) {
      setError('Por favor seleccione un tipo de datos primero');
      return;
    }

    const fileType = file.name.split('.').pop().toLowerCase();
    if (fileType !== 'csv') {
      setError('Solo se permiten archivos CSV para esta importación');
      return;
    }

    // Verificar si el archivo corresponde al tipo seleccionado
    const validFiles = fileTypes.find(type => type.id === selectedType)?.files || [];
    if (!validFiles.includes(file.name)) {
      setError(`Archivo no válido para el tipo ${selectedType}. Archivos permitidos: ${validFiles.join(', ')}`);
      return;
    }

    try {
      setError(null);
      setSuccess(false);
      await uploadFile(file, selectedType);
      setSuccess(true);
      event.target.value = null;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Importar Datos de Producción</h1>

      <Card>
        <CardHeader>
          <CardTitle>Subir Archivo CSV</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="w-full">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione el tipo de datos" />
                </SelectTrigger>
                <SelectContent>
                  {fileTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedType && (
                <p className="mt-2 text-sm text-gray-500">
                  {fileTypes.find(t => t.id === selectedType)?.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Clic para subir</span> o
                    arrastrar y soltar
                  </p>
                  {selectedType && (
                    <p className="text-xs text-gray-500">
                      Archivos permitidos: {fileTypes.find(t => t.id === selectedType)?.files.join(', ')}
                    </p>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={loading || !selectedType}
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