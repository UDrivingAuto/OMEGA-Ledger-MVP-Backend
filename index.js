const app = require('./src/app');

const { connectDatabase } = require('./src/config/database');

const PORT = process.env.PORT || 4000;

connectDatabase().then(() => {

    console.log(`\n(server.js): ${new Date()}: ✅ Conexão com o banco de dados estabelecida.`);

    app.listen(PORT, () => {

        console.log(`\n(server.js): ${new Date()}: 🚀 Servidor iniciado na porta ${PORT}`);
            
    });

}).catch((err) => {
    console.error(`\n(server.js): ${new Date()}: ❌ Erro ao conectar com o banco de dados:`, err.message);
    process.exit(1);
});