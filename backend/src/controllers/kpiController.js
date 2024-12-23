// kpiController.js
const pool = require('../config/database');

const kpiController = {
    getDashboardData: async (req, res) => {
        try {
            // Obtener estadísticas de producción y variedades
            const [stats] = await pool.execute(`
                SELECT 
                    COUNT(DISTINCT p.parcel_id) as total_parcels,
                    AVG(p.harvest_amount) as avg_production,
                    COUNT(DISTINCT v.id) as total_varieties
                FROM production p
                LEFT JOIN varieties v ON p.variety_id = v.id
            `);

            // Tendencias por mes
            const [monthlyTrends] = await pool.execute(`
                SELECT 
                    harvest_month,
                    AVG(harvest_amount) as average_production,
                    COUNT(*) as count
                FROM production
                GROUP BY harvest_month
                ORDER BY FIELD(harvest_month, 
                    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 
                    'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 
                    'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE')
            `);

            res.json({
                summary: stats[0],
                monthlyTrends
            });
        } catch (error) {
            console.error('Error in getDashboardData:', error);
            res.status(500).json({ error: 'Error al obtener datos del dashboard' });
        }
    },

    getParetoData: async (req, res) => {
        try {
            const [rows] = await pool.execute(`
                SELECT 
                    CASE 
                        WHEN frost_affected = 1 THEN 'Heladas'
                        WHEN seed_shortage = 1 THEN 'Falta de Semilla'
                        WHEN water_scarcity = 1 THEN 'Escasez de Agua'
                        WHEN pest_problems = 1 THEN 'Plagas'
                        WHEN disease_problems = 1 THEN 'Enfermedades'
                        WHEN drought_problems = 1 THEN 'Sequía'
                        WHEN hail_damage = 1 THEN 'Granizada'
                        ELSE 'Otros'
                    END as type,
                    COUNT(*) as count
                FROM crop_limitations
                GROUP BY type
                HAVING type != 'Otros'
                ORDER BY count DESC
            `);

            // Calcular porcentajes acumulados
            let total = 0;
            let accumulated = 0;
            total = rows.reduce((sum, row) => sum + row.count, 0);

            const paretoData = rows.map(row => {
                accumulated += row.count;
                return {
                    type: row.type,
                    count: row.count,
                    percentage: (row.count * 100 / total).toFixed(2),
                    accumulative_percentage: (accumulated * 100 / total).toFixed(2)
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
                    harvest_month as date,
                    AVG(harvest_amount) as value
                FROM production
                GROUP BY harvest_month
                ORDER BY FIELD(harvest_month, 
                    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 
                    'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 
                    'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE')
            `);

            const values = results.map(r => parseFloat(r.value));
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const stdDev = Math.sqrt(
                values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
            );

            res.json({
                values: results,
                limits: {
                    ucl: mean + (3 * stdDev),
                    lcl: Math.max(0, mean - (3 * stdDev)),
                    mean
                }
            });
        } catch (error) {
            console.error('Error in getControlChartData:', error);
            res.status(500).json({ error: 'Error al obtener datos del gráfico de control' });
        }
    },

    getHistogramData: async (req, res) => {
        try {
            const [results] = await pool.execute(`
                SELECT harvest_amount as value
                FROM production
                WHERE harvest_amount IS NOT NULL
            `);

            const values = results.map(r => parseFloat(r.value));
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

            const histogramData = bins.map((frequency, index) => ({
                range: `${(min + index * binWidth).toFixed(1)}-${(min + (index + 1) * binWidth).toFixed(1)}`,
                frequency
            }));

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
                    p.harvest_amount as x,
                    v.yield_rating as y
                FROM production p
                JOIN varieties v ON p.variety_id = v.id
                WHERE p.harvest_amount IS NOT NULL 
                AND v.yield_rating IS NOT NULL
            `);

            res.json(results);
        } catch (error) {
            console.error('Error in getScatterPlotData:', error);
            res.status(500).json({ error: 'Error al obtener datos del diagrama de dispersión' });
        }
    }
};

module.exports = kpiController;