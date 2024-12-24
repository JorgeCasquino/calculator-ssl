const pool = require('../config/database');

const kpiService = {
  getDashboardData: async () => {
    const [defectStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_defects,
        COUNT(DISTINCT process) as affected_processes,
        COUNT(DISTINCT type) as defect_types
      FROM defects
    `);

    const [monthlyTrends] = await pool.execute(`
      SELECT 
        DATE_FORMAT(date, '%Y-%m') as month,
        COUNT(*) as count
      FROM defects
      GROUP BY DATE_FORMAT(date, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `);

    const [processImpact] = await pool.execute(`
      SELECT 
        process,
        COUNT(*) as defect_count,
        COUNT(*) * 100.0 / (SELECT COUNT(*) FROM defects) as percentage
      FROM defects
      GROUP BY process
      ORDER BY defect_count DESC
    `);

    return {
      summary: defectStats[0],
      monthlyTrends,
      processImpact
    };
  },

  getParetoAnalysis: async () => {
    const [results] = await pool.execute(`
      SELECT 
        type,
        COUNT(*) as count,
        COUNT(*) * 100.0 / (SELECT COUNT(*) FROM defects) as percentage
      FROM defects
      GROUP BY type
      ORDER BY count DESC
    `);

    let accumulative = 0;
    const paretoData = results.map(row => {
      accumulative += row.percentage;
      return {
        ...row,
        accumulative_percentage: accumulative
      };
    });

    return paretoData;
  },

  getControlChartData: async () => {
    const [dailyDefects] = await pool.execute(`
      SELECT 
        DATE(date) as date,
        COUNT(*) as count
      FROM defects
      GROUP BY DATE(date)
      ORDER BY date
    `);

    // Calcular límites de control
    const counts = dailyDefects.map(d => d.count);
    const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
    const stdDev = Math.sqrt(
      counts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / counts.length
    );

    return {
      data: dailyDefects,
      limits: {
        ucl: mean + 3 * stdDev,
        lcl: Math.max(0, mean - 3 * stdDev),
        mean
      }
    };
  },

  getHistogramData: async (req, res) => {
    try {
        const { pollutant, startDate, endDate, groupBy } = req.query;

        // Validar que todos los parámetros estén presentes
        if (!pollutant || !startDate || !endDate || !groupBy) {
            return res.status(400).json({ error: 'Parámetros incompletos' });
        }

        // Validar que el contaminante sea válido
        const validPollutants = ['pm10', 'pm2_5', 'no2'];
        if (!validPollutants.includes(pollutant)) {
            return res.status(400).json({ error: 'Contaminante no válido' });
        }

        let query, params;

        if (groupBy === 'year') {
            // Consulta para agrupar por año
            query = `
            SELECT 
              YEAR(fecha) as year,
              COUNT(*) as frequency
            FROM air_quality_data
            WHERE 
              fecha BETWEEN ? AND ?
              AND ${pollutant} IS NOT NULL
            GROUP BY YEAR(fecha)
            ORDER BY year
            `;
            params = [startDate, endDate];
        } else {
            // Consulta para agrupar por mes
            query = `
            SELECT 
              YEAR(fecha) as year,
              MONTH(fecha) as month,
              COUNT(*) as frequency
            FROM air_quality_data
            WHERE 
              fecha BETWEEN ? AND ?
              AND ${pollutant} IS NOT NULL
            GROUP BY YEAR(fecha), MONTH(fecha)
            ORDER BY year, month
            `;
            params = [startDate, endDate];
        }

        const [rows] = await pool.execute(query, params);

        if (groupBy === 'year') {
            // Para agrupación por año
            const completeData = rows.map(row => ({
                year: row.year,
                frequency: row.frequency
            }));

            res.json({
                groupBy: 'year',
                data: completeData
            });
        } else {
            // Para agrupación por mes
            // Obtener el año de startDate para mantener la consistencia
            const selectedYear = new Date(startDate).getFullYear();

            // Generar datos completos para todos los meses
            const completeData = Array.from({ length: 12 }, (_, i) => {
                const monthData = rows.find(row => row.month === i + 1);
                return {
                    month: i + 1,
                    frequency: monthData ? monthData.frequency : 0,
                    monthName: new Date(selectedYear, i).toLocaleString('es-ES', { month: 'long' })
                };
            });

            res.json({
                year: selectedYear,
                groupBy: 'month',
                data: completeData
            });
        }

    } catch (error) {
        console.error('Error in getHistogramData:', error);
        res.status(500).json({
            error: 'Error al obtener datos del histograma',
            details: error.message
        });
    }
},
};