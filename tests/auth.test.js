const request = require('supertest');
const baseURL = process.env.API_BASE_URL;
const { gerarEmail } = require('../utils/gerarEmail');
const { gerarEmailIncorreto } = require('../utils/gerarEmail');
const { gerarCpfValido } = require('../utils/geraCpf');
const { criarCadastro } = require('../utils/criaUsuario');

let token;

beforeAll(async () => {
    const resultado = await criarCadastro();
    token = resultado.token;

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    console.log('Token recebido:', token);
});

describe('Auth - Cadastro e confirmação de e-mail', () => {
    test('Cadastro efetuado com sucesso', async () => {
        const resultado = await criarCadastro();
        expect(resultado.token).toBeDefined();
        console.log('Cadastro efetuado com sucesso:', resultado.usuario.cpf);
    });

    test('Validação de cadastro com CPF inválido', async () => {
        const res = await request(baseURL)
            .post('/cadastro')
            .send({
                full_name: 'Usuário Teste',
                email: gerarEmail(),
                password: 'Senha@123',
                confirmPassword: 'Senha@123',
                cpf: '00000000000'
            });

        console.log('CPF inválido:', res.statusCode, res.body);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test('Validação de cadastro com nome inválido', async () => {
        const res = await request(baseURL)
            .post('/cadastro')
            .send({
                full_name: '12345645 6786546456',
                email: gerarEmail(),
                password: 'Senha@123',
                confirmPassword: 'Senha@123',
                cpf: gerarCpfValido()
            });

        console.log('Nome inválido:', res.statusCode, res.body);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test('Validação de cadastro com e-mail mal formatado', async () => {
        const res = await request(baseURL)
            .post('/cadastro')
            .send({
                full_name: 'Usuário Teste',
                email: gerarEmailIncorreto(),
                password: 'Senha@123',
                confirmPassword: 'Senha@123',
                cpf: gerarCpfValido()
            });

        console.log('E-mail inválido:', res.statusCode, res.body);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test('Confirmação de e-mail com token válido', async () => {
        const res = await request(baseURL)
            .get(`/confirm-email?token=${token}`);

        console.log('Confirmação de e-mail:', res.statusCode, res.text);
        expect(res.statusCode).toBe(200);
        expect(res.text).toMatch(/E-mail confirmado com sucesso/i);
    });

    test('Confirmação com token inválido', async () => {
        const res = await request(baseURL)
            .get('/confirm-email?token=token_invalido');

        console.log('Confirmação com token inválido:', res.statusCode, res.text);
        expect([400, 401]).toContain(res.statusCode);
        expect(res.text).toMatch(/Token inválido/i);
    });
});

describe('Auth - Login', () => {
    test('Login com sucesso', async () => {
        const resultado = await criarCadastro();
        const email = resultado.usuario.email;
        const senha = resultado.usuario.password;

        await request(baseURL).get(`/confirm-email?token=${resultado.token}`);

        const res = await request(baseURL)
            .post('/login')
            .send({ email, password: senha });

        console.log('✅ Login com sucesso:', res.statusCode, res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    test('Login com senha errada após confirmação de e-mail', async () => {
        const resultado = await criarCadastro();
        const email = resultado.usuario.email;

        await request(baseURL).get(`/confirm-email?token=${resultado.token}`);

        const res = await request(baseURL)
            .post('/login')
            .send({ email, password: 'senhaErrada123' });

        console.log('Login com senha errada:', res.statusCode, res.body);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Credenciais inválidas');
    });

    test('Login com e-mail não cadastrado', async () => {
        const res = await request(baseURL)
            .post('/login')
            .send({ email: 'naoexiste@email.com', password: '123456' });

        console.log('Login com e-mail inexistente:', res.statusCode, res.body);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Credenciais inválidas');
    });
});

describe('Auth - Exclusão de conta', () => {
    test('Exclusão com token', async () => {
        const resultado = await criarCadastro();
        const token = resultado.token;

        await request(baseURL).get(`/confirm-email?token=${token}`);

        const res = await request(baseURL)
            .delete('/account')
            .set('Authorization', `Bearer ${token}`)
            .send({ password: resultado.usuario.password });

        console.log('🗑️ Exclusão de conta:', res.statusCode, res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Conta marcada como deletada.');
    });

    test('Exclusão sem token', async () => {
        const res = await request(baseURL)
            .delete('/account');

        console.log('Exclusão sem token:', res.statusCode, res.body);
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error');
    });
});
