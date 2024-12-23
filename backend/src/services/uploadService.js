// uploadService.js
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
        // Procesar todos los tipos de datos
        await Promise.all([
          this.processVarieties(data),
          this.processProduction(data),
          this.processChemicals(data),
          this.processLimitations(data)
        ]);

        processedRows = data.length;
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

  async processVarieties(data) {
    const query = `
      INSERT INTO varieties 
      (name, type, yield_rating, frost_tolerance, disease_resistance, 
       dry_matter, market_demand, price_rating, flavor_rating, growth_period)
      VALUES ?
    `;

    const varietiesData = data.map(row => {
      // Procesamos tanto variedades mejoradas como nativas
      const varieties = [];
      
      // Variedades mejoradas
      if (row.P4BMejNombre) {
        varieties.push([
          row.P4BMejNombre,
          'improved',
          parseInt(row.P4BMejRend) || 0,
          parseInt(row.P4BMejTolHelada) || 0,
          parseInt(row.P4BMejResRancha) || 0,
          parseInt(row.P4BMejMatSeca) || 0,
          parseInt(row.P4BMejDemanda) || 0,
          parseInt(row.P4BMejPrecio) || 0,
          parseInt(row.P4BMejSabor) || 0,
          parseInt(row.P4BMejTiempo) || 0
        ]);
      }

      // Variedades nativas
      if (row.P4BNatNombre) {
        varieties.push([
          row.P4BNatNombre,
          'native',
          parseInt(row.P4BNatRend) || 0,
          parseInt(row.P4BNatTolHelada) || 0,
          parseInt(row.P4BNatResRancha) || 0,
          parseInt(row.P4BNatMatSeca) || 0,
          parseInt(row.P4BNatDemanda) || 0,
          parseInt(row.P4BNatPrecio) || 0,
          parseInt(row.P4BNatSabor) || 0,
          parseInt(row.P4BNatTiempo) || 0
        ]);
      }

      return varieties;
    }).flat();

    if (varietiesData.length > 0) {
      await db.query(query, [varietiesData]);
    }
  },

  async processProduction(data) {
    const query = `
      INSERT INTO production 
      (parcel_id, parcel_name, harvest_amount, harvest_unit, 
       harvest_month, percentage)
      VALUES ?
    `;

    const productionData = data
      .filter(row => row.P3BParcela && row.P3BCoseCant)
      .map(row => [
        row.P3BParcela,
        row.P3BNombre,
        parseFloat(row.P3BCoseCant) || 0,
        row.P3BCoseUnidad,
        row.P3BCoseMes,
        parseInt(row.P3BPorcentaje) || 0
      ]);

    if (productionData.length > 0) {
      await db.query(query, [productionData]);
    }
  },

  async processChemicals(data) {
    const query = `
      INSERT INTO chemical_controls 
      (parcel_id, product_name, application_type, applications_count,
       backpack_size, dosage, cost, volume, volume_unit)
      VALUES ?
    `;

    const chemicalsData = data
      .filter(row => row.P4CParcela && row.P4CContQuim === 1)
      .map(row => [
        row.P4CParcela,
        row.P4CProd01,
        row.P4CTipo01,
        parseInt(row.P4CVeces01) || 0,
        parseFloat(row.P4CTamMochila) || 0,
        parseFloat(row.P4CDos1Nr01) || 0,
        parseFloat(row.P4CCost01) || 0,
        parseFloat(row.P4CVol01) || 0,
        row.P4CVol01Un
      ]);

    if (chemicalsData.length > 0) {
      await db.query(query, [chemicalsData]);
    }
  },

  async processLimitations(data) {
    const query = `
      INSERT INTO crop_limitations 
      (parcel_id, frost_affected, seed_shortage, water_scarcity,
       pest_problems, disease_problems, drought_problems, hail_damage,
       other_limitation, occurrence_date)
      VALUES ?
    `;

    const limitationsData = data.map(row => [
      row.CodigoEnc,
      row.P4EHelada === 1,
      row.P4ESemFalt === 1,
      false, // No hay datos de escasez de agua en el CSV consolidado
      false, // No hay datos de plagas en el CSV consolidado
      false, // No hay datos de enfermedades en el CSV consolidado
      false, // No hay datos de sequía en el CSV consolidado
      false, // No hay datos de granizo en el CSV consolidado
      null,  // No hay datos de otras limitaciones
      row.P4EMesAñoHel || null
    ]);

    if (limitationsData.length > 0) {
      await db.query(query, [limitationsData]);
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