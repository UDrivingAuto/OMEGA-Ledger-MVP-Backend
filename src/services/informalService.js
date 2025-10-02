const { Informal } = require('../models/informalModel');

/**
 * Lista todos os Informal cadastradas.
 */
async function listarInformal(req) {

    try {

        const filtros = { ...req.query }

        // Converte todos os filtros para regex case-insensitive
        for (const chave in req.query) {
            filtros[chave] = { $regex: new RegExp(`^${req.query[chave]}$`, 'i') };
        }

        return await Informal.find(filtros);

    } catch (error) {
        console.error(`\n(informalService.js): ${new Date()}: [listarInformal] Erro ao listar informal:`, error.message);
        throw error;
    }

}

/**
 * Cria e salva um novo Informal.
 * @param {Object} dados - Dados do Informal recebido no corpo da requisição.
 */
async function criarInformal(dados) {

    try {

        const novoInformal = new Informal(dados);

        return await novoInformal.save();

    } catch (error) {
        console.error(`\n(informalService.js): ${new Date()}: [criarInformal] Erro ao criar informal:`, error.message);
        throw error;
    }

}

/**
 * Atualiza um Informal existente.
 * @param {string} id - ID do Informal a ser atualizado.
 * @param {Object} dados - Novos dados do Informal.
 */
async function atualizarInformal(id, dados) {

    try {

        const informalAtualizado = await Informal.findByIdAndUpdate(id, dados, { new: true });

        if (!informalAtualizado) {
            throw new Error('Informal não encontrado');
        }

        return informalAtualizado;

    } catch (error) {
        console.error(`\n(informalService.js): ${new Date()}: [atualizarInformal] Erro ao atualizar informal:`, error.message);
        throw error;
    }

}

/**
 * Deleta um Informal existente.
 * @param {string} id - ID do Informal a ser deletado.
 */
async function deletarInformal(id) {

    try {

        const informalDeletado = await Informal.findByIdAndDelete(id);

        if (!informalDeletado) {
            throw new Error('Informal não encontrado');
        }

        return informalDeletado;

    } catch (error) {
        console.error(`\n(informalService.js): ${new Date()}: [deletarInformal] Erro ao deletar informal:`, error.message);
        throw error;
    }

}

module.exports = {
    listarInformal,
    criarInformal,
    atualizarInformal,
    deletarInformal
}
