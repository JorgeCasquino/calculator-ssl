const pool = require('../config/database');

const kpiController = {
    getDashboardData: async (req, res) => {
        try {
            // Obtener estadísticas generales
            const [defectStats] = await pool.execute(`
                SELECT 
                    COUNT(*) as total_defects,
                    COUNT(DISTINCT process) as affected_processes,
                    COUNT(DISTINCT type) as defect_types
                FROM defects
                WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            `);

            // Obtener tendencias mensuales
            const [monthlyTrends] = await pool.execute(`
                SELECT 
                    DATE_FORMAT(date, '%Y-%m') as month,
                    COUNT(*) as count
                FROM defects
                GROUP BY DATE_FORMAT(date, '%Y-%m')
                ORDER BY month DESC
                LIMIT 12
            `);

            // Obtener impacto por proceso
            const [processImpact] = await pool.execute(`
                SELECT 
                    process,
                    COUNT(*) as defect_count,
                    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM defects), 2) as percentage
                FROM defects
                GROUP BY process
                ORDER BY defect_count DESC
            `);

            res.json({
                summary: {
                    ...defectStats[0],
                    defect_rate: calculateDefectRate(defectStats[0].total_defects)
                },
                monthlyTrends,
                processImpact
            });
        } catch (error) {
            console.error('Error in getDashboardData:', error);
            res.status(500).json({ error: 'Error al obtener datos del dashboard' });
        }
    },

    getParetoData: async (req, res) => {
        try {
            const [results] = await pool.execute(`
                SELECT 
                    type,
                    COUNT(*) as count
                FROM defects
                GROUP BY type
                ORDER BY count DESC
            `);

            const total = results.reduce((sum, item) => sum + item.count, 0);
            let accumulative = 0;

            const paretoData = results.map(item => {
                accumulative += item.count;
                return {
                    type: item.type,
                    count: item.count,
                    percentage: (item.count * 100 / total).toFixed(2),
                    accumulative_percentage: (accumulative * 100 / total).toFixed(2)
                };
            });

            res.json(paretoData);
        } catch (error) {
            console.error('Error in getParetoData:', error);
            res.status(500).json({ error: 'Error al obtener datos de Pareto' });
        }
    },

    getControlChartData: async (req, res) => {
        try {
            const [results] = await pool.execute(`
                SELECT 
                    DATE(date) as date,
                    COUNT(*) as value
                FROM defects
                GROUP BY DATE(date)
                ORDER BY date
            `);

            const values = results.map(r => r.value);
            const mean = calculateMean(values);
            const stdDev = calculateStandardDeviation(values);

            const controlData = {
                values: results,
                limits: {
                    ucl: mean + (3 * stdDev),
                    lcl: Math.max(0, mean - (3 * stdDev)),
                    mean
                }
            };

            res.json(controlData);
        } catch (error) {
            console.error('Error in getControlChartData:', error);
            res.status(500).json({ error: 'Error al obtener datos del gráfico de control' });
        }
    },

    getHistogramData: async (req, res) => {
        try {
            const [results] = await pool.execute(`
                SELECT COUNT(*) as count
                FROM defects
                GROUP BY DATE(date)
            `);

            const values = results.map(r => r.count);
            const histogramData = generateHistogramData(values);

            res.json(histogramData);
        } catch (error) {
            console.error('Error in getHistogramData:', error);
            res.status(500).json({ error: 'Error al obtener datos del histograma' });
        }
    },

    getScatterPlotData: async (req, res) => {
        try {
            const [results] = await pool.execute(`
                SELECT 
                    d1.date as x_date,
                    COUNT(d1.id) as x_value,
                    d2.date as y_date,
                    COUNT(d2.id) as y_value
                FROM defects d1
                JOIN defects d2 ON DATE(d1.date) = DATE(d2.date)
                GROUP BY DATE(d1.date)
                ORDER BY d1.date
            `);

            const scatterData = results.map(row => ({
                x: row.x_value,
                y: row.y_value,
                date: row.x_date
            }));

            res.json(scatterData);
        } catch (error) {
            console.error('Error in getScatterPlotData:', error);
            res.status(500).json({ error: 'Error al obtener datos del diagrama de dispersión' });
        }
    }
};

// Funciones auxiliares
function calculateDefectRate(totalDefects) {
    // Asumiendo una base de producción de 1000 unidades
    return (totalDefects * 100 / 1000).toFixed(2);
}

function calculateMean(values) {
    return values.reduce((a, b) => a + b, 0) / values.length;
}

function calculateStandardDeviation(values) {
    const mean = calculateMean(values);
    const squareDiffs = values.map(value => Math.pow(value - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(avgSquareDiff);
}

function generateHistogramData(values) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binCount = Math.ceil(Math.sqrt(values.length));
    const binWidth = (max - min) / binCount;
    
    const bins = Array(binCount).fill(0);
    values.forEach(value => {
        const binIndex = Math.min(
            Math.floor((value - min) / binWidth),
            binCount - 1
        );
        bins[binIndex]++;
    });

    return bins.map((frequency, index) => ({
        range: `${(min + index * binWidth).toFixed(1)}-${(min + (index + 1) * binWidth).toFixed(1)}`,
        frequency
    }));
}

module.exports = kpiController;