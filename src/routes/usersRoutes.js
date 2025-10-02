const express = require('express');

const { autenticarUsuario, listarUsuarios, cadastrarUsuario } = require('../controllers/usersController');

const router = express.Router();

router.post('/', autenticarUsuario);
router.post('/cadastrar', cadastrarUsuario);
router.get('/', listarUsuarios);

module.exports = router;