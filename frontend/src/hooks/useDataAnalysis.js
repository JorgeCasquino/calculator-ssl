import { useState, useEffect } from 'react';
import api from '../components/services/Api';

export const useDataAnalysis = () => {
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const [paretoRes, controlRes, histogramRes, scatterRes] = await Promise.all([
                api.get('/kpi/pareto'),
                api.get('/kpi/control-chart'),
                api.get('/kpi/histogram'),
                api.get('/kpi/scatter-plot')
            ]);

            setAnalysisData({
                paretoData: paretoRes.data,
                controlData: {
                    values: controlRes.data.values,
                    limits: controlRes.data.limits
                },
                histogramData: histogramRes.data,
                scatterData: scatterRes.data
            });
        } catch (err) {
            console.error('Error fetching analysis data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { analysisData, loading, error, refetch: fetchData };
};