const { listarInformal, criarInformal, atualizarInformal, deletarInformal } = require('../services/informalService');

// Listar Informal
module.exports.listarInformal = async (req, res) => {
    try {
        console.log(`\n(informalController.js): ${new Date()}: 📥 Buscando lista de Informal...`);
        const informal = await listarInformal(req);
        res.json(informal);
    } catch (error) {
        console.error(`\n(informalController.js): ${new Date()}: ❌ Erro ao listar Informal:`, error.message);
        res.status(500).json({
            message: 'Erro interno ao buscar Informal.'
        });
    }
};

// Criar Informal
module.exports.criarInformal = async (req, res) => {
    try {
        const payload = req.body;

        if (!payload || Object.keys(payload).length === 0) {
            console.warn(`\n(informalController.js): ${new Date()}: ❗ Requisição inválida: corpo vazio.`);

            return res.status(400).json({
                success: false,
                message: 'O corpo da requisição está vazio ou mal formatado.'
            });
        }

        console.log(`\n(informalController.js): ${new Date()}: 📝 Criando novo Informal...`);

        const resultado = await criarInformal(payload);

        console.log(`\n(informalController.js): ${new Date()}: ✅ Informal salvo com ID: ${resultado._id}`);

        return res.status(201).json({
            success: true,
            id: resultado._id,
            resultado: resultado
        });
    } catch (error) {
        console.error(`\n(informalController.js): ${new Date()}: ❌ Erro ao criar Informal:`, error.message);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao salvar Informal.'
        });
    }
};

// Atualizar Informal
module.exports.atualizarInformal = async (req, res) => {
    try {
        const id = req.params.id;
        const payload = req.body;

        if (!id || !payload || Object.keys(payload).length === 0) {
            console.warn(`\n(informalController.js): ${new Date()}: ❗ Requisição inválida: ID ou corpo vazio.`);

            return res.status(400).json({
                success: false,
                message: 'ID do Informal ou o corpo da requisição estão vazios ou mal formatados.'
            });
        }

        console.log(`\n(informalController.js): ${new Date()}: 📝 Atualizando Informal com ID: ${id}...`);

        const resultado = await atualizarInformal(id, payload);

        console.log(`\n(informalController.js): ${new Date()}: ✅ Informal atualizado com sucesso.`);

        return res.status(200).json({
            success: true,
            resultado: resultado
        });
    } catch (error) {
        console.error(`\n(informalController.js): ${new Date()}: ❌ Erro ao atualizar Informal:`, error.message);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao atualizar Informal.'
        });
    }
};

// Deletar Informal
module.exports.deletarInformal = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            console.warn(`\n(informalController.js): ${new Date()}: ❗ ID do Informal ausente na requisição.`);

            return res.status(400).json({
                success: false,
                message: 'ID do Informal ausente na requisição.'
            });
        }
        console.log(`\n(informalController.js): ${new Date()}: 📤 Deletando Informal com ID: ${id}...`);

        const resultado = await deletarInformal(id);

        console.log(`\n(informalController.js): ${new Date()}: ✅ Informal deletado com sucesso.`);

        return res.status(200).json({
            success: true,
            message: 'Informal deletado com sucesso.'
        });

    } catch (error) {
        console.error(`\n(informalController.js): ${new Date()}: ❌ Erro ao deletar Informal:`, error.message);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao deletar Informal.'
        });
    }

}