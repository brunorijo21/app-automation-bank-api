const request = require('supertest');
const baseURL = process.env.API_BASE_URL
const { criarCadastro } = require('../utils/criaUsuario');

let token;

beforeAll(async () => {
    const resultado = await criarCadastro();
    token = resultado.token;

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    console.log('Token recebido:', token);
});

describe('Caixinha - Depósito', () => {

    test('Depósito com sucesso', async () => {
        const res = await request(baseURL)
            .post('/caixinha/deposit')
            .set('Authorization', `Bearer ${token}`)
            .send({ amount: 100 });

        console.log('Depósito:', res.statusCode, res.body);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Depósito na caixinha realizado.');
    });

    test('Depósito com saldo insuficiente', async () => {
        const res = await request(baseURL)
            .post('/caixinha/deposit')
            .set('Authorization', `Bearer ${token}`)
            .send({ amount: 9999 });

        console.log('Depósito insuficiente:', res.statusCode, res.body);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Saldo insuficiente');
    });

    test('Depósito sem token', async () => {
        const res = await request(baseURL)
            .post('/caixinha/deposit')
            .send({ amount: 10 });

        console.log('Depósito sem token:', res.statusCode, res.body);

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Não autorizado');
    });

    test('Resgate pontos da caixinha', async () => {
        const res = await request(baseURL)
            .post('/caixinha/withdraw')
            .set('Authorization', `Bearer ${token}`)
            .send({ amount: 10 });

        console.log('Resgate:', res.statusCode, res.body);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Resgate da caixinha realizado.');
    });

    test('Resgate sem token', async () => {
        const res = await request(baseURL)
            .post('/caixinha/withdraw')
            .send({ amount: 10 });

        console.log('Resgate sem token:', res.statusCode, res.body);

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Não autorizado');
    });
    test('Resgate com saldo insuficiente na caixinha', async () => {
        const res = await request(baseURL)
            .post('/caixinha/withdraw')
            .set('Authorization', `Bearer ${token}`)
            .send({ amount: 9999 });

        console.log('Resgate insuficiente:', res.statusCode, res.body);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Saldo na caixinha insuficiente');
    });
});
