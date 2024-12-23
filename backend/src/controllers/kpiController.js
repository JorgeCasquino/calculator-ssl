// kpiController.js
const pool = require('../config/database');

const kpiController = {
    getDashboardData: async (req, res) => {
        try {
            // Obtener estadísticas de producción y variedades
            const [stats] = await pool.execute(`
                SELECT 
                    COUNT(DISTINCT id) as total_records,
                    AVG(pm10) as avg_pm10,
                    AVG(pm2_5) as avg_pm2_5,
                    AVG(no2) as avg_no2
                FROM air_quality_data
            `);

            // Tendencias por mes
            const [monthlyTrends] = await pool.execute(`
                SELECT 
                    DATE_FORMAT(fecha, '%Y-%m') as month,
                    AVG(pm10) as avg_pm10,
                    AVG(pm2_5) as avg_pm2_5,
                    AVG(no2) as avg_no2,
                    COUNT(*) as count
                FROM air_quality_data
                GROUP BY month
                ORDER BY month
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
        const { pollutant = 'pm10', location = 'distrito' } = req.query; // Obtener parámetros del frontend

        try {
            const [rows] = await pool.execute(`
            SELECT 
              ${location} as location,
              AVG(${pollutant}) as average
            FROM air_quality_data
            GROUP BY ${location}
            ORDER BY average DESC
          `);

            // Calcular porcentajes acumulados
            let total = 0;
            let accumulated = 0;
            total = rows.reduce((sum, row) => sum + row.average, 0);

            const paretoData = rows.map(row => {
                accumulated += row.average;
                return {
                    location: row.location,
                    average: row.average,
                    percentage: (row.average * 100 / total).toFixed(2),
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
            const [rows] = await pool.execute(`
            SELECT 
              DATE_FORMAT(fecha, '%Y-%m') as date,
              AVG(pm10) as avg_pm10,
              AVG(pm2_5) as avg_pm2_5,
              AVG(no2) as avg_no2
            FROM air_quality_data
            WHERE pm10 IS NOT NULL AND pm2_5 IS NOT NULL AND no2 IS NOT NULL
            GROUP BY date
            ORDER BY date
          `);

            const formattedRows = rows.map(row => ({
                date: row.date,
                avg_pm10: row.avg_pm10 !== null && !isNaN(row.avg_pm10) ? Number(row.avg_pm10).toFixed(2) : null,
                avg_pm2_5: row.avg_pm2_5 !== null && !isNaN(row.avg_pm2_5) ? Number(row.avg_pm2_5).toFixed(2) : null,
                avg_no2: row.avg_no2 !== null && !isNaN(row.avg_no2) ? Number(row.avg_no2).toFixed(2) : null
            }));

            res.json(formattedRows);
        } catch (error) {
            console.error('Error in getControlChartData:', error);
            res.status(500).json({
                error: 'Error al obtener datos del gráfico de control',
                details: error.message
            });
        }
    },

    getHistogramData: async (req, res) => {
        try {
            // Obtener el año del query parameter, si no se proporciona, usar el año actual
            const selectedYear = req.query.year || new Date().getFullYear();

            const [rows] = await pool.execute(`
            SELECT 
              MONTH(fecha) as month,
              COUNT(*) as frequency
            FROM air_quality_data
            WHERE 
              YEAR(fecha) = ?
              AND pm10 IS NOT NULL
            GROUP BY MONTH(fecha)
            ORDER BY month
          `, [selectedYear]);

            // Asegurar que tenemos datos para todos los meses (1-12)
            const completeData = Array.from({ length: 12 }, (_, i) => {
                const monthData = rows.find(row => row.month === i + 1);
                return {
                    month: i + 1,
                    frequency: monthData ? monthData.frequency : 0,
                    // Agregar el nombre del mes para facilitar la visualización
                    monthName: new Date(2024, i).toLocaleString('es-ES', { month: 'long' })
                };
            });

            res.json({
                year: selectedYear,
                data: completeData
            });

        } catch (error) {
            console.error('Error in getHistogramData:', error);
            res.status(500).json({
                error: 'Error al obtener datos del histograma',
                details: error.message
            });
        }
    },

    // Endpoint adicional para obtener los años disponibles
    getAvailableYears: async (req, res) => {
        try {
            const [rows] = await pool.execute(`
            SELECT DISTINCT YEAR(fecha) as year
            FROM air_quality_data
            WHERE fecha IS NOT NULL
            ORDER BY year DESC
          `);

            const years = rows.map(row => row.year);
            res.json(years);

        } catch (error) {
            console.error('Error in getAvailableYears:', error);
            res.status(500).json({
                error: 'Error al obtener los años disponibles',
                details: error.message
            });
        }
    },

    getScatterPlotData: async (req, res) => {
        try {
            const [rows] = await pool.execute(`
            SELECT 
              pm10 as x,
              pm2_5 as y
            FROM air_quality_data
            WHERE pm10 IS NOT NULL 
            AND pm2_5 IS NOT NULL
          `);

            const formattedRows = rows.map(row => ({
                x: row.x !== null && !isNaN(row.x) ? Number(row.x).toFixed(2) : null,
                y: row.y !== null && !isNaN(row.y) ? Number(row.y).toFixed(2) : null
            }));

            res.json(formattedRows);
        } catch (error) {
            console.error('Error in getScatterPlotData:', error);
            res.status(500).json({
                error: 'Error al obtener datos del diagrama de dispersión',
                details: error.message
            });
        }
    }
};

module.exports = kpiController;