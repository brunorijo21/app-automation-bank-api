


require('dotenv').config();

const request = require('supertest');
const baseURL = process.env.API_BASE_URL;
const emailPadrao = process.env.USER_EMAIL;
const senhaPadrão = process.env.USER_SENHA;
const { criarCadastro } = require('../utils/criaUsuario');


let tokenRemetente;
let cpfDestinatario;

beforeAll(async () => {

    const cadastroDestinatario = await criarCadastro();
    cpfDestinatario = cadastroDestinatario.usuario.cpf;

    const cadastroRemetente = await criarCadastro();
    tokenRemetente = cadastroRemetente.token;
});

describe('Envio de pontos com sucesso', () => {

    test('Envia pontos com sucesso', async () => {
        const res = await request(baseURL)
            .post('/points/send')
            .set('Authorization', `Bearer ${tokenRemetente}`)
            .send({
                recipientCpf: cpfDestinatario,
                amount: 50
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Pontos enviados com sucesso.');
    });


    test('Falha ao enviar para CPF inexistente', async () => {
        const res = await request(baseURL)
            .post('/points/send')
            .set('Authorization', `Bearer ${tokenRemetente}`)
            .send({
                recipientCpf: '00000000000',
                amount: 50
            });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'Usuário destino não encontrado');
    });

    test('Falha ao enviar sem token', async () => {
        const res = await request(baseURL)
            .post('/points/send')
            .send({
                recipientCpf: cpfDestinatario,
                amount: 50
            });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Não autorizado');
    });
});
