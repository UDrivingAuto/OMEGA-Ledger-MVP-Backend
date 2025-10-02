const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const { identificarBanco } = require('../utils/identificarBanco');
const { extrairCreditosBancoDoBrasil } = require('../parsers/bancoDoBrasil');
const { extrairCreditosPagBank } = require('../parsers/pagBank');
const { extrairCreditosNubank } = require('../parsers/nubank');
const { extrairCreditosInter } = require('../parsers/inter');
const { extrairCreditosMercadoPago } = require('../parsers/mercadoPago');
const { extrairCreditosSantander } = require('../parsers/santander');

const handleUpload = async (req, res) => {

    if (!req.file) {
        return res.status(400).json({ error: 'Arquivo inválido ou ausente' });
    }

    const filePath = path.resolve(__dirname, '..', '..', 'uploads', req.file.filename);

    try {

        let message = 'Upload e leitura bem-sucedidos';

        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);

        let banco = identificarBanco(data.text);
        
        const extrair = {
            text: data.text,
            nome: req.body.nome,
            documento: req.body.documento,
            descartes: req.body.descartes
        };

        let dados = [];

        if (banco === 'banco-do-brasil') {
            dados = extrairCreditosBancoDoBrasil(extrair);
        } else
        if (banco === 'pag-bank') {
            dados = extrairCreditosPagBank(extrair);
        } else
        if (banco === 'nubank') {
            dados = extrairCreditosNubank(extrair);
        } else
        if (banco === 'inter') {
            dados = extrairCreditosInter(extrair);
        } else
        if (banco === 'mercado-pago') {
            dados = extrairCreditosMercadoPago(extrair);
        } else
        if (banco === 'santander') {
            dados = extrairCreditosSantander(extrair);
        } else {
            banco = 'Desconhecido'
            message = 'Ainda não estamos processando dados do banco informado. Tente outro banco, ou execute o processo manual.';
            dados = {
                cliente: extrair.nome,
                registros: [],
                total: 0.00
            };
        }

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        return res.status(200).json({
            message,
            banco,
            dados,
        });

    } catch (error) {
        console.error('Erro ao processar o PDF:', error);
        return res.status(500).json({ error: 'Erro ao processar o PDF' });
    }
    
};

module.exports = { handleUpload };