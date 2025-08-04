function gerarEmail(prefixo = 'usuario') {
    const timestamp = Date.now();
    const aleatorio = Math.floor(Math.random() * 10000);
    return `${prefixo}_${timestamp}_${aleatorio}@email.com`;
}

function gerarEmailIncorreto(prefixo = 'usuario') {
    const timestamp = Date.now();
    const aleatorio = Math.floor(Math.random() * 10000);
    return `${prefixo}_${timestamp}_${aleatorio}@email....com`;
}

module.exports = { gerarEmail, gerarEmailIncorreto };
