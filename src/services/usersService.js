const bcrypt = require('bcrypt');
const { Users } = require('../models/usersModel');

/**
 * Cria e salva um novo Usuário.
 * @param {Object} usuario - Dados do Parâmetro recebido no corpo da requisição.
 */
async function cadastrarUsuario(usuario) {

    try {

        const novoUsuario = new Users(usuario);
        return await novoUsuario.save();

    } catch (error) {
        console.error(`\n(usersService.js): ${new Date()}: [cadastrarUsuario] Erro ao criar usuário:`, error.message);
        throw error;
    }

}

async function listarUsuarios(filtros) {

    try {

        // Remove campos vazios/nulos dos filtros
        const query = {};

        Object.keys(filtros).forEach((key) => {
            if (filtros[key] !== undefined && filtros[key] !== null && filtros[key] !== '') {
                query[key] = filtros[key];
            }
        });

        // Busca no MongoDB com os filtros montados
        const usuarios = await Users.find(query);

        return usuarios;

    } catch (error) {
        console.error(`\n(usersService.js): ${new Date()}: [listarUsuarios] Erro ao buscar usuários:`, error.message);
        throw error;
    }

}

async function autenticarUsuario(userId, password) {

    let status = {}

    try {

        const usuario = await Users.findOne({ userId: userId });

        if (!usuario) {
            status.status = 'Usuário não encontrado';
            status.code = -1;
        }

        const senhaValida = await bcrypt.compare(password, usuario.password);

        if (!senhaValida) {
            status.status = 'Usuário não encontrado';
            status.code = -2;
        } else {
            status.status = 'Usuário Autenticado';
            status.code = 0;
            status.userId = usuario.userId,
            status.permissions = usuario.permissions
        }

        return status;

    } catch (err) {

        status.status = err;
        status.code = -3;

        return status;

    }

}

module.exports = {
    cadastrarUsuario,
    listarUsuarios,
    autenticarUsuario
};