const express = require('express');

const { listarInformal, criarInformal, atualizarInformal, deletarInformal } = require('../controllers/informalController');

const router = express.Router();

// Rotas para Informal
router.get('/', listarInformal);
router.post('/', criarInformal);
router.put('/:id', atualizarInformal);
router.delete('/:id', deletarInformal);

module.exports = router;
