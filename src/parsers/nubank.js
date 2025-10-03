const creditosValidos = require('../test/creditosValidos');
const tdd = require('../utils/tratamentoDeDados');

function extrairCreditosNubank(extrair) {

    const regex = /(\d{1,2}) ([A-Za-zçÇ]+) (\d{4})/i;

    const registros = [];
    let total = 0;

    let cliente = extrair.nome;
    let descAux = [];
    descAux = JSON.parse(extrair.descartes);

    const linhas = extrair.text.split('\n').map(l => l.trim()).filter(Boolean);

    let status = 'none';
    let data = '';
    let valor = 0;
    let descricao = '';

    for (let i = 0; i < linhas.length; i++) {

        let linha = linhas[i];

        if (status === 'none' && linha.includes('Total de entradas+')) {

            status = 'movimentacao';

            let dataAtualFormat = tdd.parseDataText(linhas[i-1]);

            data = dataAtualFormat;

        } else 
        if ((status === 'movimentacao')) {

            let matchDataLinha = linha.match(regex);

            if (matchDataLinha) {
                status = 'none';
                continue;
            }

            let valorValid = tdd.ehValorMonetario(linha);

            if (valorValid && descricao !== '') {

                valor = tdd.parseValorMonetario(linha);
                total += valor;

                registros.push({
                    data: data,
                    valor: valor,
                    descricao: descricao
                });

                descricao = '';
                valor = 0;

                continue;

            }

            let clientName = linha.toLowerCase().includes(cliente.toLowerCase());
            if (clientName) continue;

            if (descAux.length > 0) {
                let descartar = descAux.some(desc => {return linha.toLowerCase().includes(desc.toLowerCase());});
                if (descartar) continue;
            }

            let creditos = creditosValidos.nubank().some(credito => {
                return linha.toLowerCase().includes(credito.toLowerCase())
            });
            if (!creditos) continue;

            let sepDesc = tdd.extrairCreditos(linha);
            descricao = sepDesc[0].credito + ' ' + sepDesc[0].detalhes;

        }

    }

    const dadosCliente = {
        cliente,
        registros,
        total
    };

    return dadosCliente;

}

module.exports = { extrairCreditosNubank };