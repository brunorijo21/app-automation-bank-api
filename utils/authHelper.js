const request = require('supertest');
const baseURL = process.env.API_BASE_URL;

// Valores padrão caso variáveis de ambiente não estejam definidas
const emailPadrao = process.env.USER_EMAIL || 'usuario@email.com';
const senhaPadrao = process.env.USER_SENHA || 'senha123';

/**
 * Autentica um usuário e retorna o token JWT e dados do usuário
 * @param {string} email - Email do usuário
 * @param {string} senha - Senha do usuário
 * @returns {Promise<{ token: string, usuario?: object }>}
 */
async function autenticarUsuario(email, password) {
    const res = await request(baseURL)
        .post('/login')
        .send({ email, password });

    if (res.statusCode !== 200 || !res.body.token) {
        const erro = res.body?.message || res.body?.error || 'Resposta inesperada';
        throw new Error(`Falha na autenticação: ${res.statusCode} - ${erro}`);
    }

    return {
        token: res.body.token,
        usuario: res.body.usuario
    };
}

module.exports = { autenticarUsuario }