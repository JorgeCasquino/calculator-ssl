// src/hooks/useKPI.js
import { useState, useEffect } from 'react';
import api from '../components/services/Api';

export const useKPI = () => {
    const [kpiData, setKpiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Realizar todas las peticiones en paralelo
            const [dashboardRes, paretoRes, controlChartRes, histogramRes] = await Promise.all([
                api.get('/api/kpi/dashboard'),
                api.get('/api/kpi/pareto'),
                api.get('/api/kpi/control-chart'),
                api.get('/api/kpi/histogram')
            ]);

            setKpiData({
                summary: dashboardRes.data.summary,
                monthlyTrends: dashboardRes.data.monthlyTrends,
                processImpact: dashboardRes.data.processImpact,
                paretoData: paretoRes.data,
                controlData: controlChartRes.data,
                histogramData: histogramRes.data
            });
        } catch (err) {
            console.error('Error fetching KPI data:', err);
            setError('Error al cargar los datos. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Cargar datos al montar el componente
    useEffect(() => {
        fetchData();
    }, []);

    // Actualizar datos cada 5 minutos
    useEffect(() => {
        const interval = setInterval(fetchData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return {
        kpiData,
        loading,
        error,
        refreshData: fetchData
    };
};