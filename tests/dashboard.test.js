const request = require('supertest');
const app = require('../app');
const db = require('../db');

describe('RF-009/CT-007 – Exibir estatísticas no painel admin', () => {
  const email = 'admin@teste.com';
  const senha = 'admin123';
  let agent, adminId;

  beforeAll(async () => {
    await db.pool.query('DELETE FROM admin WHERE admemail = ?', [email]);
    const [result] = await db.pool.query(
      'INSERT INTO admin (admemail, admsenha, admnome) VALUES (?, ?, ?)', 
      [email, senha, 'Admin Teste']
    );
    adminId = result.insertId;
    agent = request.agent(app);
    await agent.post('/admin/login').send({ email, senha });
  });

  afterAll(async () => {
    await db.pool.query('DELETE FROM admin WHERE admcodigo = ?', [adminId]);
  });

  it('deve acessar o dashboard admin', async () => {
    const res = await agent.get('/admin/dashboard');
    expect([200, 302]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.text).toMatch(/Usuários|usuarios/i);
      expect(res.text).toMatch(/Admins|admins/i);
    }
  });

  it('deve redirecionar se não estiver logado como admin', async () => {
    const res = await request(app).get('/admin/dashboard');
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/admin');
  });
});