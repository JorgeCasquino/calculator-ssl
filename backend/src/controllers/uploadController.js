const XLSX = require('xlsx');
const uploadService = require('../services/uploadService');

const uploadController = {
  processExcelFile: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const workbook = XLSX.read(req.file.buffer);
      const processedData = await uploadService.processExcelData(workbook);
      
      res.json({
        message: 'File processed successfully',
        data: processedData
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getUploadHistory: async (req, res) => {
    try {
      const history = await uploadService.getUploadHistory();
      res.json(history);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};


module.exports = uploadController;
