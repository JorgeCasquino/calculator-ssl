import { useState, useEffect } from 'react';
import api from '../components/services/Api';

export const useReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/reports');
            console.log('Reports Response:', response.data);
            setReports(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Error fetching reports:', err);
            setError('Error al cargar los reportes. Por favor, intenta de nuevo.');
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    const generateReport = async (config) => {
        try {
            setLoading(true);
            const response = await api.post('/reports/generate', config);
            console.log('Generate Report Response:', response.data);
            await fetchReports(); // Recargar la lista después de generar
            return response.data;
        } catch (err) {
            console.error('Error generating report:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = async (id) => {
        try {
            const response = await api.get(`/reports/${id}/download`, {
                responseType: 'blob'
            });
            
            // Crear URL del blob y descargar
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report-${id}.${response.headers['content-type'].includes('pdf') ? 'pdf' : 'xlsx'}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error downloading report:', err);
            throw err;
        }
    };

    const getReport = async (id) => {
        try {
            const response = await api.get(`/reports/${id}`);
            return response.data;
        } catch (err) {
            console.error('Error getting report:', err);
            throw err;
        }
    };

    return {
        reports,
        loading,
        error,
        fetchReports,
        generateReport,
        downloadReport,
        getReport
    };
};