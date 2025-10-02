const tdd = require('../utils/tratamentoDeDados');
const creditosValidos = require('../test/creditosValidos');

function extrairCreditosPagBank(extrair) {

    const linhas = extrair.text.split('\n').map(l => l.trim()).filter(Boolean);

    let cliente = extrair.nome;
    let descAux = [];
    descAux = JSON.parse(extrair.descartes);

    const registros = [];
    let total = 0;

    for (let i = 0; i < linhas.length; i++) {

        const linha = linhas[i];
        let validLine = false;

        if (linha.includes('R$') && !linha.includes('-R$')) {

            const matchValor = linha.match(/R\$ (\d{1,3}(?:\.\d{3})*,\d{2})/);

            if (matchValor) {

                let data = null;
                let textoAdjunto = '';
                const valor = matchValor[1];

                if (valor === '0,00') continue;

                const resultado = linha.match(/^(\d{2}\/\d{2}\/\d{4})(.*)$/);

                if (resultado && resultado[1] && resultado[1] !== null) {

                    data = resultado[1];

                    if (resultado[2]) {
                        textoAdjunto = resultado[2].trim();
                    }

                    let descartar = descAux.some(desc => {
                        return textoAdjunto.toLowerCase().includes(desc.toLowerCase());
                    });

                    if (textoAdjunto.toLowerCase().includes(cliente.toLowerCase())) {
                        validLine = false;
                    }else
                    if (descartar) {
                        validLine = false;
                    }else {
                        validLine = creditosValidos.pagBank().some(credito =>
                            textoAdjunto.toLowerCase().includes(credito.toLowerCase())
                        );
                    }

                    if (validLine) {
    
                        total += tdd.parseValorMonetario(valor);

                        registros.push({
                            data: data,
                            descricao: textoAdjunto.split('R$')[0].trim(),
                            valor: tdd.parseValorMonetario(valor)
                        });

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

module.exports = { extrairCreditosPagBank };