function bancoDoBrasil() {

    const creditosValidos = [
        'Pix - Recebido',
        'Recebimento de Proventos'
    ];

    return creditosValidos;

}

function pagBank() {

    const creditosValidos = [
        'Pix recebido',
        'Transferência Recebida'
    ];

    return creditosValidos;

}

function nubank() {

    const creditosValidos = [
        'Transferência recebida pelo Pix',
        'Transferência Recebida'
    ];

    return creditosValidos;

}

function inter() {

    const creditosValidos = [
        'Pix recebido'
    ];

    return creditosValidos;

}

function mercadoPago() {

    const creditosValidos = [
        'Transferência Pix recebida',
        'Liberação de dinheiro'
    ];

    return creditosValidos;

}

function santander() {

    const creditosValidos = [
        'PIX RECEBIDO',
        'LIQUIDO DE VENCIMENTO'
    ];

    return creditosValidos;

}

module.exports = {
    pagBank,
    nubank,
    inter,
    bancoDoBrasil,
    mercadoPago,
    santander
};