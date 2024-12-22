const XLSX = require('xlsx');
const pool = require('../config/database');

const uploadService = {
  processExcelData: async (workbook) => {
    const processedData = [];
    const errors = [];

    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validar y procesar cada fila
      for (const row of jsonData) {
        try {
          // Validar campos requeridos
          if (!row.date || !row.type || !row.process) {
            throw new Error('Missing required fields');
          }

          // Convertir fecha si es necesario
          const date = row.date instanceof Date ? 
            row.date : 
            new Date(row.date);

          if (isNaN(date.getTime())) {
            throw new Error('Invalid date format');
          }

          // Insertar en la base de datos
          const [result] = await pool.execute(`
            INSERT INTO defects (date, type, process, description)
            VALUES (?, ?, ?, ?)
          `, [date, row.type, row.process, row.description || null]);

          processedData.push({
            id: result.insertId,
            ...row
          });
        } catch (error) {
          errors.push({
            row: row,
            error: error.message
          });
        }
      }
    }

    // Registrar la carga
    await pool.execute(`
      INSERT INTO uploads (filename, processed_rows, error_rows, created_at)
      VALUES (?, ?, ?, NOW())
    `, [workbook.filename || 'unknown', processedData.length, errors.length]);

    return {
      processed: processedData,
      errors: errors,
      summary: {
        totalRows: processedData.length + errors.length,
        successfulRows: processedData.length,
        errorRows: errors.length
      }
    };
  },

  getUploadHistory: async () => {
    const [uploads] = await pool.execute(`
      SELECT * FROM uploads
      ORDER BY created_at DESC
    `);
    return uploads;
  }
};
module.exports = uploadService;