const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const usersRoutes = require('./routes/usersRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const informalRoutes = require('./routes/informalRoutes');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

console.log(`\n(app.js): ${new Date()}: Middleware de JSON e CORS configurados.`);
console.log(`\n(app.js): ${new Date()}: Rotas sendo configuradas...`);

app.use('/api/users', usersRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/informal', informalRoutes);

console.log(`\n(app.js): ${new Date()}: Rota /api/users aplicada com sucesso.`);
console.log(`\n(app.js): ${new Date()}: Rota /api/upload aplicada com sucesso.`);
console.log(`\n(app.js): ${new Date()}: Rota /api/informal aplicada com sucesso.`);

module.exports = app;