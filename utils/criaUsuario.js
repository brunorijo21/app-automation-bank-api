const request = require('supertest');
const baseURL = process.env.API_BASE_URL;

function gerarCPF() {
    return Math.floor(10000000000 + Math.random() * 90000000000).toString();
}

function gerarNome() {
    return `Usuário Teste ${Math.floor(Math.random() * 1000)}`;
}

function gerarEmail() {
    return `teste_${Date.now()}_${Math.floor(Math.random() * 1000)}@exemplo.com`;
}

async function criarCadastro() {
    const cpf = gerarCPF(); // Armazena CPF separadamente

    const usuario = {
        cpf,
        full_name: gerarNome(),
        email: gerarEmail(),
        password: 'Senha@123',
        confirmPassword: 'Senha@123'
    };

    const response = await request(baseURL)
        .post('/cadastro') // Ajuste conforme seu backend
        .send(usuario);

    if (response.statusCode !== 201) {
        throw new Error(` Cadastro falhou: ${response.statusCode} - ${JSON.stringify(response.body)}`);
    }

    const token = response.body?.confirmToken;

    if (!token) {
        console.warn('Token de confirmação não encontrado na resposta.');
    }

    return {
        token,
        usuario
    };
}


module.exports = { criarCadastro }
