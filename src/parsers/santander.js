const tdd = require('../utils/tratamentoDeDados');
const creditosValidos = require('../test/creditosValidos');

function extrairCreditosSantander(extrair) {

    const registros = [];
    let total = 0;

    let cliente = extrair.nome;
    let descAux = [];
    descAux = JSON.parse(extrair.descartes);

    const linhas = extrair.text.split('\n').map(l => l.trim()).filter(Boolean);

    let status = 'none';

    for (let i = 0; i < linhas.length; i++) {

        const linha = linhas[i];

        if (status === 'none' && linha === 'Movimentação') {
            status = 'movimentacao';
        } else 
        if (status === 'movimentacao' && linha === 'Saldos por Período') {
            status = 'none';
        } else 
        if (status === 'movimentacao' && linha !== 'Saldos por Período') {

            let data = linha.match(/^(\d{2}\/\d{2})(.*)$/);

            if (data) {

                let descricao = data[2] + ' ' + linhas[i+1];

                let clientName = data[2].toLowerCase().includes(cliente.toLowerCase());
                if (clientName) continue;

                if (descAux.length > 0) {
                    let descartar = descAux.some(desc => {return data[2].toLowerCase().includes(desc.toLowerCase());});
                    if (descartar) continue;
                }

                let creditos = creditosValidos.santander().some(credito => data[2].toLowerCase().includes(credito.toLowerCase()));
                if (!creditos) continue;

                
                let valorFinal = tdd.tratarValor(linhas[i+2]);
                total += tdd.parseValorMonetario(valorFinal[0]);

                registros.push({
                    data: data[1],
                    descricao: descricao,
                    valor: tdd.parseValorMonetario(valorFinal[0])
                });

                let j = 3;
                let forward = true;

                while (forward) {

                    if (linhas[i+j].match(/^(\d{2}\/\d{2})(.*)$/) || linhas[i+j].includes('SALDOEM')) {
                        forward = false;
                    } else {

                        let descricaoForward = linhas[i+j] + ' ' + linhas[i+j+1];

                        let clientNameForward = linhas[i+j].toLowerCase().includes(cliente.toLowerCase());
                        if (clientNameForward) { j++; continue; }

                        if (descAux.length > 0) {
                            let descartarForward = descAux.some(desc => {return linhas[i+j].toLowerCase().includes(desc.toLowerCase());});
                            if (descartarForward) { j++; continue; }
                        }

                        let creditosForward = creditosValidos.santander().some(credito => linhas[i+j].toLowerCase().includes(credito.toLowerCase()));
                        if (!creditosForward) { j++; continue; }
                        
                        let valorFinalForward = tdd.tratarValor(linhas[i+j+2]);
                        total += tdd.parseValorMonetario(valorFinalForward[0]);

                        registros.push({
                            data: data[1],
                            descricao: descricaoForward,
                            valor: tdd.parseValorMonetario(valorFinalForward[0])
                        });

                        j++;

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

module.exports = { extrairCreditosSantander };