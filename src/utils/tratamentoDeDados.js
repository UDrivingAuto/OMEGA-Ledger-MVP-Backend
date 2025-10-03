const cvNubank = require('../test/creditosValidos');

function ehValorMonetario(str) {
    const regex = /^\d{1,3}(?:\.\d{3})*,\d{2}$/;
    return regex.test(str.trim());
}

function parseValorMonetario(valorStr) {
    return parseFloat(valorStr.replace(/\./g, '').replace(',', '.'));
}

function extrairDataCompleta(str) {

    const regex = /(\d{1,2}) de ([A-Za-zçÇ]+) de (\d{4})/i;
    const match = str.match(regex);

    if (match) {
        return `${match[1]} de ${match[2]} de ${match[3]}`;
    }

    return null;

}

function parseDataText(dataStr) {

    const partes = dataStr.split(' ');

    const meses = {
        'jan': '01',
        'fev': '02',
        'mar': '03',
        'abr': '04',
        'mai': '05',
        'jun': '06',
        'jul': '07',
        'ago': '08',
        'set': '09',
        'out': '10',
        'nov': '11',
        'dez': '12'
    };

    return `${partes[0]}/${meses[partes[1].toLowerCase()]}/${partes[2]}`;

}

function parseDataExtense(dataStr) {

    const partes = dataStr.split(' de ');

    const meses = {
        'janeiro': '01',
        'fevereiro': '02',
        'março': '03',
        'abril': '04',
        'maio': '05',
        'junho': '06',
        'julho': '07',
        'agosto': '08',
        'setembro': '09',
        'outubro': '10',
        'novembro': '11',
        'dezembro': '12'
    };

    const dia = partes[0].padStart(2, '0');
    const mes = meses[partes[1].toLowerCase()];
    const ano = partes[2];

    return `${dia}/${mes}/${ano}`;

}

function extrairTipoENome(str) {

    const tipoMatch = str.match(/^([A-Za-zçÇ ]+):/);

    const nomeMatch = str.match(/Cp\s*:[^A-Za-z]*([A-Za-z\s]+)(?=["R$])/i);

    const tipo = tipoMatch ? tipoMatch[1].trim() : 'Transferência';
    const nome = nomeMatch ? nomeMatch[1].trim() : 'Recebida';

    if (tipo && nome) {
        return `${tipo}: ${nome}`;
    }

    return null;

}

function tratarValor(valor) {

    valor = valor.trim();

    // Caso especial: não há "-" e é um número longo
    if (!valor.includes('-') && valor.length > 6 && valor.includes(',')) {
        const parte2 = valor.slice(6);
        return [parte2];
    }

    // Divide pelo separador ","
    const partes = valor.split(',');

    if (partes.length > 2) {
        // Corrige valores colados: "1,150,00" → "1,15"
        const decimal = partes[1].slice(0, 2);
        const valor1 = partes[0] + ',' + decimal;
        return [valor1.replace('-', '')];
    }

    // Caso comum
    return [valor.replace('-', '')];
}

function extrairCreditos(texto) {

    const creditosValidos = cvNubank.nubank();
    
    const linhas = texto.split('\n').map(l => l.trim()).filter(Boolean);

    const resultado = [];

    linhas.forEach(linha => {

        const creditoEncontrado = creditosValidos.find(credito => linha.startsWith(credito));

        if (creditoEncontrado) {

            // separa o crédito válido do resto da linha
            const resto = linha.slice(creditoEncontrado.length).trim();

            resultado.push({
                credito: creditoEncontrado,
                detalhes: resto
            });

        }

    });

    return resultado;

}

module.exports = {
    ehValorMonetario,
    parseValorMonetario,
    extrairDataCompleta,
    parseDataText,
    parseDataExtense,
    extrairTipoENome,
    tratarValor,
    extrairCreditos
}