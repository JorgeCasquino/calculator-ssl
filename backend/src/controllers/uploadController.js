const uploadService = require('../services/uploadService');

const uploadController = {
  processFile: async (req, res) => {
    try {
      console.log('Procesando archivo:', req.file?.originalname);

      if (!req.file) {
        return res.status(400).json({ 
          error: 'No se ha proporcionado ningún archivo' 
        });
      }

      const fileContent = req.file.buffer.toString('utf-8');
      console.log('Contenido del archivo (primeras 100 chars):', 
        fileContent.substring(0, 100));

      const result = await uploadService.processData(fileContent);
      
      // Registrar la carga exitosa
      await uploadService.recordUpload({
        filename: req.file.originalname,
        processedRows: result.processedRows,
        errorRows: result.errorRows
      });

      res.json({
        success: true,
        message: 'Archivo procesado correctamente',
        ...result
      });

    } catch (error) {
      console.error('Error detallado:', error);
      res.status(500).json({
        success: false,
        error: 'Error al procesar el archivo',
        details: error.message
      });
    }
  },

  getUploadHistory: async (req, res) => {
    try {
      const history = await uploadService.getUploadHistory();
      res.json(history);
    } catch (error) {
      console.error('Error al obtener historial:', error);
      res.status(500).json({
        error: 'Error al obtener historial',
        details: error.message
      });
    }
  }
};

module.exports = uploadController;