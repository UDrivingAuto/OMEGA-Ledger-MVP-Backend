const creditosValidos = require('../test/creditosValidos');
const tdd = require('../utils/tratamentoDeDados');

function extrairCreditosMercadoPago(extrair) {

    const registros = [];
    let total = 0;
    let cliente = extrair.nome;
    let descAux = JSON.parse(extrair.descartes);

    const linhas = extrair.text.split('\n').map(l => l.trim()).filter(Boolean);

    for (let i = 0; i < linhas.length; i++) {

        const linha = linhas[i];

        if (linha.includes('Saldo inicial') || linha.includes('Entradas') || linha.includes('Saidas')) continue;

        const matchData = linha.match(/^(\d{2}-\d{2}-\d{4})/);

        if (matchData) {

            let dataAux;
            let descrAux;
            let valorAux;

            if (linha.includes('R$') && !linha.includes('-R$') && !linha.includes('R$ -')) {

                const regex = /^(\d{2}-\d{2}-\d{4})([^\d]+)(\d+)R\$ ([\d.,]+)R\$ ([\d.,]+)$/;

                const match = linha.match(regex);

                if (match) {

                    dataAux = match[1].trim().replace('-', '/').replace('-', '/');

                    descrAux = match[2].trim();

                    let clientName = descrAux.toLowerCase().includes(cliente.toLowerCase());
                    if (clientName) continue;

                    if (descAux.length > 0) {
                        let descartar = descAux.some(desc => {return descrAux.toLowerCase().includes(desc.toLowerCase());});
                        if (descartar) continue;
                    }

                    let creditos = creditosValidos.mercadoPago().some(credito => descrAux.toLowerCase().includes(credito.toLowerCase()));
                    if (!creditos) continue;

                    const valorNumerico = tdd.parseValorMonetario(match[4].trim());
                    valorAux = valorNumerico;

                    total += valorNumerico;

                    registros.push({
                        data: dataAux,
                        descricao: descrAux,
                        valor: valorAux
                    });

                }

            } else {

                if (linhas[i+3].includes('R$') && !linhas[i+3].includes('-R$') && !linhas[i+3].includes('R$ -')) {

                    dataAux = matchData[0].trim().replace('-', '/').replace('-', '/');

                    descrAux = linhas[i+1] + ' ' + linhas[i+2];

                    let clientName = descrAux.toLowerCase().includes(cliente.toLowerCase());
                    if (clientName) continue;

                    if (descAux.length > 0) {
                        let descartar = descAux.some(desc => {return descrAux.toLowerCase().includes(desc.toLowerCase());});
                        if (descartar) continue;
                    }

                    let creditos = creditosValidos.mercadoPago().some(credito => descrAux.toLowerCase().includes(credito.toLowerCase()));
                    if (creditos) continue;

                    const matchValor = linhas[i+3].match(/R\$ (\d{1,3}(?:\.\d{3})*,\d{2})/);
                    const valorNumerico = tdd.parseValorMonetario(matchValor[1].trim());
                    valorAux = valorNumerico;

                    total += valorNumerico;

                    registros.push({
                        data: dataAux,
                        descricao: descrAux,
                        valor: valorAux
                    });

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

/*function extrairCreditosMercadoPago(extrair) {

    const linhas = extrair.text.split('\n').map(l => l.trim()).filter(Boolean);

    let cliente = extrair.nome;
    let descAux = JSON.parse(extrair.descartes);

    const registros = [];
    let total = 0;

    for (let i = 0; i < linhas.length; i++) {

        const linha = linhas[i];

        if (linha.includes("R$") && !linha.includes("-R$")) {

            const matchValor = linha.match(/R\$ (\d{1,3}(?:\.\d{3})*,\d{2})/);
            const matchData = linha.match(/^(\d{2}-\d{2}-\d{4})/);

            if (matchValor && matchData) {

                const valor = matchValor[1];
                const data = matchData[1];

                if (valor === "0,00") continue;

                let textoAdjunto = linha.split("Transferência Pix recebida")[1] || "";
                textoAdjunto = textoAdjunto.split("R$")[0].trim();

                const descartar = descAux.some(desc =>
                    textoAdjunto.toLowerCase().includes(desc.toLowerCase())
                );

                const isDoProprioCliente = textoAdjunto.toLowerCase().includes(cliente.toLowerCase());

                const isValido = creditosValidos.mercadoPago().some(chave =>
                    textoAdjunto.toLowerCase().includes(chave.toLowerCase())
                );

                if (!descartar && !isDoProprioCliente && isValido) {

                    const valorNumerico = tdd.parseValorMonetario(valor);

                    total += valorNumerico;

                    registros.push({
                        data,
                        descricao: textoAdjunto,
                        valor: valorNumerico
                    });

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

}*/

module.exports = { extrairCreditosMercadoPago }