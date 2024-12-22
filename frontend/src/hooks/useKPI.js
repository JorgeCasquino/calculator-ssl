import { useState, useEffect } from 'react';
import api from '../components/services/Api'; // Asegúrate de que la ruta sea correcta

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
                api.get('/kpi/dashboard'),
                api.get('/kpi/pareto'),
                api.get('/kpi/control-chart'),
                api.get('/kpi/histogram')
            ]);

            // Logs de depuración
            console.log('Dashboard Response:', dashboardRes.data);
            console.log('Pareto Response:', paretoRes.data);
            console.log('Control Chart Response:', controlChartRes.data);
            console.log('Histogram Response:', histogramRes.data);

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

    useEffect(() => {
        fetchData();
    }, []);

    return { kpiData, loading, error, refetch: fetchData };
};