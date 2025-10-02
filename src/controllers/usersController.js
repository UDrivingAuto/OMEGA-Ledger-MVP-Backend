const { autenticarUsuario, listarUsuarios, cadastrarUsuario } = require('../services/usersService');

module.exports.cadastrarUsuario = async (req, res) => {

    try {

        const payload = req.body;

        if (!payload || Object.keys(payload).length === 0) {

            console.warn(`\n(usersController.js): ${new Date()}: ❗ Requisição inválida: corpo vazio.`);

            return res.status(400).json({
                success: false,
                message: 'O corpo da requisição está vazio ou mal formatado.'
            });

        }

        console.log(`\n(userssController.js): ${new Date()}: 📝 Criando novo usuário...`);

        const resultado = await cadastrarUsuario(payload);

        console.log(`\n(parametrosController.js): ${new Date()}: ✅ Parâmetro salvo com ID: ${resultado._id}`);

        return res.status(201).json({
            success: true,
            id: resultado._id,
            resultado: resultado
        });

    } catch (error) {

        console.error(`\n(parametrosController.js): ${new Date()}: ❌ Erro ao criar parâmetro:`, error.message);

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao salvar usuário.'
        });

    }

};

module.exports.listarUsuarios = async (req, res) => {
    
    try {

        console.log(`\n(usersController.js): ${new Date()}: 📥 Listando usuários com filtros...`);

        // req.query pega os parâmetros da URL (?userId=abc&permissions=admin)
        const filtros = req.query;

        const usuarios = await listarUsuarios(filtros);

        return res.status(200).json({
            success: true,
            total: usuarios.length,
            usuarios
        });

    } catch (error) {

        console.error(`\n(usersController.js): ${new Date()}: ❌ Erro ao listar usuários:`, error.message);

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao buscar usuários.'
        });

    }

};

module.exports.autenticarUsuario = async (req, res) => {

    try {

        console.log(`\n(usersController.js): ${new Date()}: 📥 Buscando lista de Usuários...`);

        const body = req.body;
        const usuario = await autenticarUsuario(body.userId, body.password);

        res.json(usuario);

    } catch (error) {

        console.error(`\n(usersController.js): ${new Date()}: ❌ Erro ao autenticar usuário:`, error.message);

        res.status(500).json({
            message: 'Erro interno ao autenticar usuário.'
        });

    }

};