const multer = require('multer');
const config = require('../config/config');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = config.upload.allowedTypes;
  const fileType = file.originalname.split('.').pop().toLowerCase();
  
  if (allowedTypes.includes(fileType)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only Excel and CSV files are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: config.upload.maxSize
  }
});

module.exports = upload;