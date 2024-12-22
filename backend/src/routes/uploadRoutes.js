const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(auth);

router.post('/excel', 
  upload.single('file'),
  uploadController.processExcelFile
);

router.get('/history', uploadController.getUploadHistory);

module.exports = router;