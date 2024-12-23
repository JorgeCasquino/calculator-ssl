// FileUpload.jsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Upload, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Alert } from '../ui/alert';
import api from '../services/Api';

const FileUpload = () => {
  const { sidebarOpen } = useApp();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]);

  useEffect(() => {
    fetchUploadHistory();
  }, []);

  const fetchUploadHistory = async () => {
    try {
      const response = await api.get('/upload/history');
      setUploadHistory(response.data);
    } catch (err) {
      console.error('Error fetching upload history:', err);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const fileType = selectedFile.name.split('.').pop().toLowerCase();
    if (fileType !== 'csv') {
      setError('Solo se permiten archivos CSV');
      return;
    }

    // Verificar si es el archivo correcto
    if (selectedFile.name !== 'DatosDepurados.csv') {
      setError('Por favor seleccione el archivo DatosDepurados.csv');
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor seleccione un archivo');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/upload/csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Archivo procesado correctamente');
      await fetchUploadHistory();
      
      // Limpiar el formulario
      setFile(null);
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.response?.data?.details || err.response?.data?.error || 'Error al procesar el archivo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 p-6 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Importar Datos de Producción</h1>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label 
                htmlFor="file-input"
                className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400"
              >
                <div className="space-y-2 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-blue-600 hover:underline">
                      Selecciona el archivo
                    </span>
                    {' '}o arrastra y suelta aquí
                  </div>
                  <p className="text-xs text-gray-500">
                    Solo se permite el archivo: DatosDepurados.csv
                  </p>
                </div>
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={loading}
                />
              </label>

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className={`rounded-md px-4 py-2 text-white ${
                  !file || loading
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Procesando...' : 'Subir'}
              </button>
            </div>

            {file && (
              <p className="text-sm text-gray-600">
                Archivo seleccionado: {file.name}
              </p>
            )}

            {error && (
              <Alert variant="destructive" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </Alert>
            )}

            {success && (
              <Alert className="flex items-center gap-2 bg-green-50 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span>{success}</span>
              </Alert>
            )}
          </div>
        </div>

        {/* Upload History */}
        {uploadHistory.length > 0 && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">Historial de Importaciones</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Archivo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Filas Procesadas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Errores
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Fecha de Carga
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {uploadHistory.map((upload, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        {upload.filename}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {upload.processed_rows}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {upload.error_rows}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          upload.error_rows > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {upload.error_rows > 0 ? 'Con Errores' : 'Completado'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(upload.created_at).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;