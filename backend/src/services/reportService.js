const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const reportService = {
  generateReport: async (config) => {
    const { type, startDate, endDate, format } = config;
    
    // Obtener datos según el tipo de reporte
    let data;
    switch (type) {
      case 'defects':
        const [defects] = await pool.execute(`
          SELECT * FROM defects 
          WHERE date BETWEEN ? AND ?
          ORDER BY date DESC
        `, [startDate, endDate]);
        data = defects;
        break;
      
      case 'kpi':
        data = await kpiService.getDashboardData();
        break;
      
      default:
        throw new Error('Invalid report type');
    }

    // Generar reporte en el formato solicitado
    let reportPath;
    if (format === 'pdf') {
      reportPath = await generatePDFReport(data, config);
    } else if (format === 'excel') {
      reportPath = await generateExcelReport(data, config);
    }

    // Guardar registro del reporte generado
    const [result] = await pool.execute(`
      INSERT INTO reports (type, format, file_path, created_at)
      VALUES (?, ?, ?, NOW())
    `, [type, format, reportPath]);

    return {
      id: result.insertId,
      path: reportPath
    };
  },

  getReportHistory: async () => {
    const [reports] = await pool.execute(`
      SELECT * FROM reports
      ORDER BY created_at DESC
    `);
    return reports;
  },

  getReportById: async (id) => {
    const [reports] = await pool.execute(`
      SELECT * FROM reports WHERE id = ?
    `, [id]);
    return reports[0];
  }
};