function identificarBanco(texto) {

    const lower = texto.toLowerCase();
  
    if (lower.includes('290 - pagseguro internet s/a')) {
      return 'pag-bank';
    }else
    if (lower.includes('@nubank.com.br')) {
      return 'nubank';
    }else
    if (lower.includes('banco inter')) {
      return 'inter';
    }else
    if (lower.includes('www.mercadopago.com.br')) {
      return 'mercado-pago';
    }else
    if (lower.includes('extrato de conta corrente')) {
      return 'banco-do-brasil';
    }else
    if (lower.includes('santander')) {
      return 'santander';
    }
  
    // outros bancos no futuro...
    return 'desconhecido';
    
  }
  
  module.exports = { identificarBanco };
  