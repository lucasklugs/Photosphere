const request = require('supertest');
const app = require('../app');
const db = require('../db');

describe('RF-006/CT-005 – Curtir uma foto', () => {
  const email = 'like@teste.com';
  const senha = 'senha123';
  let agent, userId, fotoId;

  beforeAll(async () => {
    await db.pool.query('DELETE FROM usuarios WHERE email = ?', [email]);
    const bcrypt = require('bcrypt');
    const senhaHash = await bcrypt.hash(senha, 10);
    const [userRes] = await db.pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)',
      ['Like User', email, senhaHash]
    );
    userId = userRes.insertId;
    const [fotoRes] = await db.pool.query(
      'INSERT INTO fotos (usuario_id, titulo, descricao, url, origem) VALUES (?, ?, ?, ?, ?)',
      [userId, 'Foto Like', 'Desc', '/uploads/like.jpg', 'upload']
    );
    fotoId = fotoRes.insertId;
    agent = request.agent(app);
    await agent.post('/login').send({ email, senha });
    // Garante que não há curtidas antes de começar
    await db.pool.query('DELETE FROM curtidas WHERE usuario_id = ? AND foto_id = ?', [userId, fotoId]);
  });

  afterAll(async () => {
    await db.pool.query('DELETE FROM curtidas WHERE usuario_id = ?', [userId]);
    await db.pool.query('DELETE FROM fotos WHERE id = ?', [fotoId]);
    await db.pool.query('DELETE FROM usuarios WHERE id = ?', [userId]);
  });

  it('deve curtir uma foto', async () => {
    // Garante que não está curtida
    await db.pool.query('DELETE FROM curtidas WHERE usuario_id = ? AND foto_id = ?', [userId, fotoId]);
    const res = await agent
      .post('/favoritar')
      .send({ fotoId });
    expect([200, 302]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.favoritado).toBe(true);
    }
  });

  it('deve descurtir uma foto já curtida', async () => {
    // Garante curtida antes
    await db.pool.query('INSERT IGNORE INTO curtidas (usuario_id, foto_id) VALUES (?, ?)', [userId, fotoId]);
    const res = await agent.post('/favoritar').send({ fotoId });
    expect([200, 302]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.favoritado).toBe(false);
    }
  });

  it('deve falhar se não estiver logado', async () => {
    const res = await request(app).post('/favoritar').send({ fotoId });
    expect(res.statusCode).toBe(302);
  });
});