const db = require('../config/database');
const Papa = require('papaparse');

const uploadService = {
  async processData(fileContent) {
    try {
      // Parsear el CSV
      const parsedData = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
      });

      const data = parsedData.data;
      let processedRows = 0;
      let errorRows = 0;

      // Iniciar transacción
      await db.query('START TRANSACTION');

      try {
        // Procesar los datos del CSV en partes
        const chunkSize = 1000; // Ajusta el tamaño del chunk según sea necesario
        for (let i = 0; i < data.length; i += chunkSize) {
          const chunk = data.slice(i, i + chunkSize);
          await uploadService.processAirQualityData(chunk); // Asegúrate de usar uploadService aquí
          processedRows += chunk.length;
        }

        await db.query('COMMIT');
      } catch (error) {
        await db.query('ROLLBACK');
        throw error;
      }

      return { processedRows, errorRows };
    } catch (error) {
      throw new Error(`Error processing data: ${error.message}`);
    }
  },

  async processAirQualityData(data) {
    const query = `
      INSERT INTO air_quality_data 
      (id, estacion, fecha, hora, longitud, latitud, altitud, pm10, pm2_5, no2, departamento, provincia, distrito, ubigeo, fecha_corte)
      VALUES ?
    `;

    const airQualityData = data.map(row => [
      row.ID,
      row.ESTACION,
      row.FECHA,
      row.HORA,
      row.LONGITUD,
      row.LATITUD,
      row.ALTITUD,
      row.PM10,
      row.PM2_5,
      row.NO2,
      row.DEPARTAMENTO,
      row.PROVINCIA,
      row.DISTRITO,
      row.UBIGEO,
      row.FECHA_CORTE
    ]);

    if (airQualityData.length > 0) {
      await db.query(query, [airQualityData]);
    }
  },

  async recordUpload(uploadData) {
    const query = 'INSERT INTO uploads (filename, processed_rows, error_rows) VALUES (?, ?, ?)';
    const [result] = await db.query(query, [
      uploadData.filename,
      uploadData.processedRows,
      uploadData.errorRows
    ]);
    return result.insertId;
  },

  async getUploadHistory() {
    const [history] = await db.query('SELECT * FROM uploads ORDER BY created_at DESC');
    return history;
  }
};

module.exports = uploadService;