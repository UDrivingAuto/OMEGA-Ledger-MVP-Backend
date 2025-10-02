const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

module.exports.connectDatabase = async () => {

    try {

        console.log(`\n(database.js): ${new Date()}: 🔌 Iniciando conexão com o MongoDB...`);
        await mongoose.connect(process.env.MONGODB_URI);

        console.log(`\n(database.js): ${new Date()}: ✅ Conexão com o MongoDB estabelecida com sucesso.`);

    } catch (error) {

        console.error(`\n(database.js): ${new Date()}: ❌ Erro ao conectar com o MongoDB:`, error.message);

        // Encerra a aplicação em caso de falha na conexão
        process.exit(1);

    }

};