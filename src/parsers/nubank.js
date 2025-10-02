const creditosValidos = require('../test/creditosValidos');
const tdd = require('../utils/tratamentoDeDados');

function extrairCreditosNubank(extrair) {

    const linhas = extrair.text.split('\n').map(l => l.trim()).filter(Boolean);

    let cliente = extrair.nome;
    let descAux = [];
    descAux = JSON.parse(extrair.descartes);

    const registros = [];
    let capturando = false;
    let dataAtual = '';
    let descricaoAtual = '';

    let total = 0;

    for (let i = 0; i < linhas.length; i++) {

        let linha = linhas[i];

        if (linha.includes('Total de entradas')) {

            capturando = true;            

            if (linhas[i - 1] === 'Rendimento líquido') {
                capturando = false;
            } else
            if (linhas[i - 1] !== 'Rendimento líquido') {

                dataAtual = linhas[i - 1];

                let dataAtualFormat = tdd.parseDataText(dataAtual);

                let count = i + 1;

                while (capturando) {

                    if (linhas[count].includes('Total de saídas')) {
                        capturando = false;
                    } else {

                        let descricaoValid = false;

                        let descartar = descAux.some(desc => {
                            linhas[count].toLowerCase().includes(desc.toLowerCase());
                        }); 

                        if (linhas[count].toLowerCase().includes(cliente.toLowerCase())) {
                            descricaoValid = false;
                        }else
                        if (descartar) {
                            descricaoValid = false;
                        } else {
                            descricaoValid = creditosValidos.nubank().some(credito =>
                                linhas[count].toLowerCase().includes(credito.toLowerCase())
                            );
                        }

                        if (descricaoValid) {
                            descricaoAtual = 'Transferência Recebida';
                        }

                        let valorValid = tdd.ehValorMonetario(linhas[count]);
                        let valor = '';

                        if (valorValid) {

                            valor = tdd.parseValorMonetario(linhas[count]);
                            total += valor;

                            registros.push({
                                data: dataAtualFormat,
                                descricao: descricaoAtual,
                                valor: valor
                            });

                        }

                        count++;

                    }
                }

            }

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