import { useState, useEffect } from 'react';
import api from '../components/services/Api';

export const useDefects = () => {
    const [defects, setDefects] = useState([]);
    const [defectStats, setDefectStats] = useState({
        totalDefects: 0,
        affectedProcesses: 0,
        defectTypes: 0,
        defectsByType: [],
        defectsByProcess: [],
        defectTrend: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        type: '',
        process: '',
        startDate: '',
        endDate: ''
    });
    const [processTypes, setProcessTypes] = useState([]);
    const [defectTypes, setDefectTypes] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Realizar todas las peticiones en paralelo
            const [defectsRes, statsRes, processTypesRes, defectTypesRes] = await Promise.all([
                api.get('/defects'),
                api.get('/defects/stats'),
                api.get('/defects/process-types'),
                api.get('/defects/defect-types')
            ]);

            // Logs de depuración
            console.log('Defects Response:', defectsRes.data);
            console.log('Stats Response:', statsRes.data);
            console.log('Process Types Response:', processTypesRes.data);
            console.log('Defect Types Response:', defectTypesRes.data);

            // Asegurar que los datos sean arrays
            setDefects(Array.isArray(defectsRes.data) ? defectsRes.data : []);
            setDefectStats(statsRes.data || {
                totalDefects: 0,
                affectedProcesses: 0,
                defectTypes: 0,
                defectsByType: [],
                defectsByProcess: [],
                defectTrend: []
            });
            setProcessTypes(Array.isArray(processTypesRes.data) ? processTypesRes.data : []);
            setDefectTypes(Array.isArray(defectTypesRes.data) ? defectTypesRes.data : []);

        } catch (err) {
            console.error('Error fetching defects data:', err);
            setError('Error al cargar los datos. Por favor, intenta de nuevo.');
            // Establecer valores por defecto en caso de error
            setDefects([]);
            setDefectStats({
                totalDefects: 0,
                affectedProcesses: 0,
                defectTypes: 0,
                defectsByType: [],
                defectsByProcess: [],
                defectTrend: []
            });
            setProcessTypes([]);
            setDefectTypes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const createDefect = async (defectData) => {
        try {
            const response = await api.post('/defects', defectData);
            await fetchData();
            return response.data;
        } catch (err) {
            console.error('Error creating defect:', err);
            throw err;
        }
    };

    const updateDefect = async (id, defectData) => {
        try {
            const response = await api.put(`/defects/${id}`, defectData);
            await fetchData();
            return response.data;
        } catch (err) {
            console.error('Error updating defect:', err);
            throw err;
        }
    };

    const deleteDefect = async (id) => {
        try {
            await api.delete(`/defects/${id}`);
            await fetchData();
        } catch (err) {
            console.error('Error deleting defect:', err);
            throw err;
        }
    };

    return {
        defects,
        defectStats,
        loading,
        error,
        filters,
        setFilters,
        processTypes,
        defectTypes,
        createDefect,
        updateDefect,
        deleteDefect,
        refetch: fetchData
    };
};