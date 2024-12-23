const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Log para debugging
  console.log('Archivo recibido:', {
    filename: file.originalname,
    mimetype: file.mimetype
  });

  // Validar el tipo MIME
  if (!file.mimetype.includes('csv') && 
      !file.mimetype.includes('text/plain')) {
    return cb(new Error('Solo se permiten archivos CSV'), false);
  }

  // Validar que sea el archivo correcto
  if (file.originalname !== 'data.csv') {
    return cb(new Error('Solo se permite el archivo data.csv'), false);
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
}).single('file');

// Wrapper para manejar errores de multer
const uploadMiddleware = (req, res, next) => {
  upload(req, res, function(err) {
    if (err) {
      console.error('Error en upload middleware:', err);
      return res.status(400).json({
        error: 'Error al subir el archivo',
        details: err.message
      });
    }
    next();
  });
};

module.exports = uploadMiddleware;