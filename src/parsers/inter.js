const creditosValidos = require('../test/creditosValidos');
const tdd = require('../utils/tratamentoDeDados');

function extrairCreditosInter(extrair) {

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

        if (linha.includes('Saldo do dia')) {

            capturando = true;

            let dataCompleta = tdd.extrairDataCompleta(linha);
            dataAtual = tdd.parseDataExtense(dataCompleta);

            let count = i + 1;

            while (capturando) {

                if (linhas[count].includes('R$')) {

                    let textoInicial = '';
                    let valor = '';

                    const matchValor = linhas[count].match(/R\$ (\d{1,3}(?:\.\d{3})*,\d{2})/);

                    textoInicial = matchValor.input;
                    valor = tdd.parseValorMonetario(matchValor[1]);

                    if (!linhas[count].includes('Saldo do dia')) {

                        let descricaoValid = false;

                        let descartar = descAux.some(desc => {
                            return textoInicial.toLowerCase().includes(desc.toLowerCase());
                        });

                        if (textoInicial.toLowerCase().includes(cliente.toLowerCase())) {
                            descricaoValid = false;
                        }else
                        if (descartar) {
                            descricaoValid = false;
                        } else {
                            descricaoValid = creditosValidos.inter().some(credito =>
                                textoInicial.toLowerCase().includes(credito.toLowerCase())
                            );
                        }

                        if (descricaoValid) {

                            descricaoAtual = tdd.extrairTipoENome(textoInicial);
                            total += valor;

                            registros.push({
                                data: dataAtual,
                                descricao: descricaoAtual,
                                valor: valor
                            });

                        }

                    }else{

                        capturando = false;

                    }

                    count++;

                    if(count >= linhas.length) {
                        capturando = false;
                    }

                }else{

                    count++;
                    
                    if(count >= linhas.length) {
                        capturando = false;
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

module.exports = { extrairCreditosInter }
