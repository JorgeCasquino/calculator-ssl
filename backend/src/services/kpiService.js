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

  getHistogramData: async () => {
    const [defects] = await pool.execute(`
      SELECT date, type, process
      FROM defects
      ORDER BY date
    `);

    return defects;
  }
};