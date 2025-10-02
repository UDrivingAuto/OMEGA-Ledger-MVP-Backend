const mongoose = require('mongoose');

const InformalSchema = new mongoose.Schema({

    nome: {
        type: String,
        required: true
    },

    documento: {
        type: String,
        required: true
    },

    ultimaAnalise: {
        type: String,
        required: true
    },

    banco: {
        type: String,
        required: true
    },

    renda: {
        type: String,
        required: true
    },

    status: {
        type: String,
        required: true
    },

    observacao: {
        type: String,
    },

    descartes: [String],

    extrato: [
        {
            data: {
                type: String,
                required: true
            },
            descricao: {
                type: String,
                required: true
            },
            valor: {
                type: String,
                required: true
            }
        }
    ],

    historico: [
        {
            data: {
                type: String,
                required: true
            },
            renda: {
                type: String,
                required: true
            },
            status: {
                type: String,
                required: true
            },
            observacoes: {
                type: String,
                required: true

            }
        }
    ],

    operador: {
        type: String,
        required: true
    }

});

const Informal = mongoose.model('Informal', InformalSchema);

// Log (opcional) para confirmar carregamento do schema
console.log(`\n(informalModel.js): ${new Date()}: 📦 Modelo Informal carregado.`);

// Exportação do modelo
module.exports.Informal = Informal;