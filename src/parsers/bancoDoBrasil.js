const tdd = require('../utils/tratamentoDeDados');
const creditosValidos = require('../test/creditosValidos');

function extrairCreditosBancoDoBrasil(extrair) {

    const registros = [];
    let total = 0;

    let cliente = extrair.nome;
    let descAux = [];
    descAux = JSON.parse(extrair.descartes);

    const linhas = extrair.text.split('\n').map(l => l.trim()).filter(Boolean);

    for (let i = 0; i < linhas.length; i++) {

        const linha = linhas[i];

        // Detecta valor com (+), ou seja, crédito
        const matchValor = linha.match(/^([\d.]+,\d{2})\s+\(\+\)$/);

        if (matchValor) {

            const valor = matchValor[1];

            // Ignora saldos ou créditos irrelevantes de 0,00
            if (valor === '0,00') continue;
            if (linhas[i+2] === 'Saldo Anterior' || linhas[i+2] === 'S A L D O') continue;

            let resultado = linhas[i+1].match(/^(\d{2}\/\d{2}\/\d{4})(.*)$/);

            let data = resultado[1];
            let descricao = resultado[2].trim() + ' ' + linhas[i+2];

            let clientName = descricao.toLowerCase().includes(cliente.toLowerCase());
            if (clientName) continue;

            if (descAux.length > 0) {
                let descartar = descAux.some(desc => {return descricao.toLowerCase().includes(desc.toLowerCase());});
                if (descartar) continue;
            }

            let creditos = creditosValidos.bancoDoBrasil().some(credito => linhas[i+1].toLowerCase().includes(credito.toLowerCase()));
            if (!creditos) continue;

            total += tdd.parseValorMonetario(valor);

            registros.push({
                data: data,
                descricao: descricao.split('R$')[0].trim(),
                valor: tdd.parseValorMonetario(valor)
            });

        }

    }

    const dadosCliente = {
        cliente,
        registros,
        total
    };

    return dadosCliente;

}

module.exports = { extrairCreditosBancoDoBrasil };