const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const uploadMiddleware = require('../middleware/upload');

// Ruta para subir CSV
router.post('/csv', 
  uploadMiddleware,  // Usar el middleware modificado
  uploadController.processFile
);

router.get('/history', uploadController.getUploadHistory);

module.exports = router;