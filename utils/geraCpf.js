function gerarCpfValido() {
    const rand = () => Math.floor(Math.random() * 9);
    const cpf = Array.from({ length: 9 }, rand);

    const calcDV = (base, peso) => {
        const soma = base.reduce((acc, num, idx) => acc + num * (peso - idx), 0);
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    };

    cpf.push(calcDV(cpf, 10));
    cpf.push(calcDV(cpf, 11));

    return cpf.join('');
}
module.exports = { gerarCpfValido }