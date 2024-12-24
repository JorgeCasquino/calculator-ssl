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
        const { pollutant = 'pm10' } = req.query;
    
        try {
            const [rows] = await pool.execute(`
                SELECT 
                    DATE_FORMAT(fecha, '%Y-%m') as date,
                    AVG(${pollutant}) as value
                FROM air_quality_data
                WHERE ${pollutant} IS NOT NULL
                GROUP BY date
                ORDER BY date
            `);
    
            // Convertir valores a números
            const values = rows.map(row => Number(row.value));
    
            // Calcular media
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
    
            // Calcular desviación estándar
            const variance = values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length;
            const stdDev = Math.sqrt(variance);
    
            // Calcular límites de control (3-sigma)
            const ucl = mean + 3 * stdDev;
            const lcl = mean - 3 * stdDev;
    
            // Calcular límites de advertencia (2-sigma)
            const upperWarning = mean + 2 * stdDev;
            const lowerWarning = mean - 2 * stdDev;
    
            // Marcar puntos fuera de los límites
            const processedValues = rows.map(row => {
                const value = Number(row.value);
                let status = 'normal';
    
                if (value > ucl || value < lcl) {
                    status = 'out_of_control';
                } else if (
                    (value > upperWarning && value <= ucl) || 
                    (value < lowerWarning && value >= lcl)
                ) {
                    status = 'warning';
                }
    
                return {
                    date: row.date,
                    value: Number(value.toFixed(2)),
                    status
                };
            });
    
            res.json({
                values: processedValues,
                limits: {
                    mean: Number(mean.toFixed(2)),
                    ucl: Number(ucl.toFixed(2)),
                    lcl: Number(lcl.toFixed(2)),
                    upperWarning: Number(upperWarning.toFixed(2)),
                    lowerWarning: Number(lowerWarning.toFixed(2))
                }
            });
        } catch (error) {
            console.error('Error in getControlChartData:', error);
            res.status(500).json({
                error: 'Error al obtener datos del gráfico de control',
                details: error.message
            });
        }
    },
    saveMeasurement: async (req, res) => {
        try {
            const { station, pollutant, value, date, threshold } = req.body;
            
            const [result] = await pool.execute(
                `INSERT INTO measurements_check (station, pollutant, value, date, exceeds_threshold) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    station, 
                    pollutant, 
                    parseFloat(value), 
                    date, 
                    parseFloat(value) > threshold
                ]
            );
    
            res.json({ 
                success: true, 
                id: result.insertId 
            });
        } catch (error) {
            console.error('Error al guardar medición:', error);
            res.status(500).json({ 
                error: 'Error al guardar la medición',
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
    const { yPollutant = 'pm10' } = req.query;

    try {
        const [rows] = await pool.execute(`
            SELECT 
                MONTH(fecha) as month,
                AVG(${yPollutant}) as pollutant_avg,
                MIN(${yPollutant}) as min_value,
                MAX(${yPollutant}) as max_value,
                COUNT(*) as data_points
            FROM air_quality_data
            WHERE 
                ${yPollutant} IS NOT NULL 
                AND ${yPollutant} > 0
            GROUP BY MONTH(fecha)
            ORDER BY month
        `);

        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        const formattedRows = rows.map(row => ({
            x: row.month,
            y: Number(row.pollutant_avg).toFixed(2),
            monthName: monthNames[row.month - 1],
            minValue: Number(row.min_value).toFixed(2),
            maxValue: Number(row.max_value).toFixed(2),
            dataPoints: row.data_points
        }));

        // Asegurar que todos los meses estén representados
        const completeData = Array.from({length: 12}, (_, i) => {
            const monthData = formattedRows.find(row => row.x === i + 1);
            return monthData || {
                x: i + 1,
                y: null,
                monthName: monthNames[i],
                minValue: null,
                maxValue: null,
                dataPoints: 0
            };
        });

        res.json(completeData);
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