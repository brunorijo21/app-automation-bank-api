# Projeto de Testes Automatizados API com framework Jest
---

## ⚙️ Configuração


Instale o Node.js (versão 18 ou superior recomendada) 

Verifique com:

node -v

npm -v

npm install --save-dev jest

npm install "dotenv" : Biblioteca que carrega variáveis de ambiente de um arquivo

npm install supertest : Simula requisições HTTP para testar endpoints da API.

npm install jest-html-reporter : Relatório dos testes



📁 Estrutura
project/
├── tests/
│   └── auth.test.js
│   └── caxinha.test.js
│   └── pointSend.test.js
├── utils/
│   └──authHelper.js
│   └── CriarUsuario.test.js
|   └── geraCpf.test.js
|   └── geraEmail.test.js
├──.env
├──jest.config.js
├── package.json
├── README.md



🛠️ Funções Desenvolvidas

🔐 AuthHelper.js – Realiza login dinâmico

👤 CriarUsuario.js – Cadastra usuário de forma dinâmica

🧾 geraCpf.js – Gera CPF válido automaticamente

📧 gerarEmail.js – Gera e-mail dinâmico para testes

## 📁 Arquivos Importantes

jest.config.js

## Configuração do ambiente de testes:

- testEnvironment: Define o ambiente de execução (node para backend)

- setupFiles: Arquivos carregados antes dos testes (ex: variáveis de ambiente)

- testMatch: Padrão para localizar arquivos de teste

- reporters: Define como os resultados dos testes serão exibidos e salvos:

- default: Mostra o relatório padrão no terminal

- jest-html-reporter: Gera relatório HTML com:

- outputPath: Caminho do relatório (./reports/test-report.html)

- pageTitle: Título da página (Relatório de Testes)



## 🚀 Execução dos Testes

 - npm test = Executa todos arquivo da pasta test 

 - Gerar relatório = npm jest-html-reporter, será criada uma pasta na raiz do projeto com nome de reports

 npm test -- --coverage  Isso cria uma pasta /coverage com relatórios em HTML
 Verificar a cobertura dos testes

## 🐞 Análise de Bugs e aptidão para deploy em Produção

 a) Há bugs? SIM.


Resposta: 

❌ Campo e-mail no auth/cadastro está aceitando e-mail com formatação incorreta.

❌ Ao resgatar pontos da caixinha, mesmo com saldo, retornou  erro 400.

❌ Bug ao enviar pontos com cpf incorreto (00000000000) o mesmo retornou sucesso 200.

❌ Nome está aceitando cadastro com números retornando 201.



📊 b) Classificação dos bugs por criticidade

- Campo e-mail com formatação incorreta 

 Impacto baixo para cliente criticidade 🟡 Baixa


- Resgatar pontos da caixinha:

 Impacto diretamente para cliente  criticidade 🔴 Alta

- CPF inválido 

Aceito	pode comprometer integridade dos dados	🔴 Alta

- Nome inválido

- Nome está aceitando números 🟠 Média



## c) O sistema está pronto para produção?

Resposta: Não, de acordo com o que foi testado e pela criticidade dos bugs encontados, o sistema não está apto para ser implementado em produção.



    Linha 53 caxinha.test.js (BUG) 
  
     test('Resgate pontos da caixinha', async () => {
     const res = await request(baseURL)
    .post('/caixinha/withdraw')
    .set('Authorization', `Bearer ${token}`)
     .send({ amount: 10 });
    console.log('Resgate:', res.statusCode, res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Resgate da caixinha realizado.');
   });

        Linha 40 pointsSends.test.js (BUG)

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

    Linha 27 auth.test.js (BUG)

     Auth - Cadastro e confirmação de e-mail › Validação de cadastro com nome inválido

    Expected: 400
    Received: 201

      53 |
      54 |         console.log('Nome inválido:', res.statusCode, res.body);
    > 55 |         expect(res.statusCode).toBe(400);
         |                                ^
      56 |         expect(res.body).toHaveProperty('error');
      57 |     });
      58 |

      at Object.toBe (tests/auth.test.js:55:32)
      });

    Linha 43 auth.test.js (BUG)

      test('Validação de cadastro com nome inválido', async () => {
        const res = await request(baseURL)
            .post('/cadastro')
            .send({
                full_name: '12345645 6786546456',
                email: gerarEmail('nomeInvalido'),
                password: 'Senha@123',
                confirmPassword: 'Senha@123',
                cpf: gerarCpfValido()
            });

        console.log('Nome inválido:', res.statusCode, res.body);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

