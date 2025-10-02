const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    country: {
        type: String,
        required: true
    },

    state: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    createDate: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        default: 'active'
    },

    permissions: [String],

    tenant: {
        type: String,
        required: true
    }

});

const Users = mongoose.model('Users', UsersSchema);

// Log (opcional) para confirmar carregamento do schema
console.log(`\n(usersModel.js): ${new Date()}: 📦 Modelo Users carregado.`);

// Exportação do modelo
module.exports.Users = Users;