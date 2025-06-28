const request = require('supertest');
const app = require('../app');
const db = require('../db');

describe('Login no sistema', () => {
  const email = 'usuario@teste.com';
  const senha = 'senha123';
  let userId;

  beforeAll(async () => {
    await db.pool.query('DELETE FROM usuarios WHERE email = ?', [email]);
    const bcrypt = require('bcrypt');
    const senhaHash = await bcrypt.hash(senha, 10);
    const [result] = await db.pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)',
      ['Usuário Teste', email, senhaHash]
    );
    userId = result.insertId;
  });

  afterAll(async () => {
    await db.pool.query('DELETE FROM usuarios WHERE id = ?', [userId]);
  });

  it('deve autenticar usuário com credenciais válidas', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email, senha });
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/explorar');
  });

  it('deve falhar com senha incorreta', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email, senha: 'errada' });
    expect(res.statusCode).toBe(401);
    expect(res.text).toMatch(/Senha incorreta|Usuário não encontrado/);
  });

  it('deve falhar com usuário inexistente', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'naoexiste@teste.com', senha: 'qualquer' });
    expect(res.statusCode).toBe(401);
    expect(res.text).toMatch(/Usuário não encontrado/);
  });
});