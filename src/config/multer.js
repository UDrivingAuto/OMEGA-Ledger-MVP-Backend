const multer = require('multer');
const path = require('path');

// Configuração de armazenamento
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
    },

    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }

});

// Filtro para aceitar apenas PDF
const fileFilter = (req, file, cb) => {
    const isPDF = file.mimetype === 'application/pdf';
    cb(null, isPDF);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;