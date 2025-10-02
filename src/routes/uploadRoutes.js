const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const uploadController = require('../controllers/uploadController');

// Rota para upload de arquivo PDF
router.post('/', upload.single('file'), uploadController.handleUpload);

module.exports = router;
