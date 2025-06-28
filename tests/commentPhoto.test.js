const request = require('supertest');
const app = require('../app');
const db = require('../db');

describe('RF-008/CT-006 – Adicionar comentário a uma foto', () => {
  const email = 'comment@teste.com';
  const senha = 'senha123';
  let agent, userId, pinId, categoriaId;

  beforeAll(async () => {
    await db.pool.query('DELETE FROM usuarios WHERE email = ?', [email]);
    const bcrypt = require('bcrypt');
    const senhaHash = await bcrypt.hash(senha, 10);
    const [userRes] = await db.pool.query('INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)', ['Comment User', email, senhaHash]);
    userId = userRes.insertId;
    // Cria categoria de teste
    const [catRes] = await db.pool.query('INSERT INTO categorias (nome) VALUES (?)', ['Categoria Comentário']);
    categoriaId = catRes.insertId;
    // Cria uma foto/pin associada à categoria
    const [fotoRes] = await db.pool.query('INSERT INTO fotos (usuario_id, titulo, descricao, url, origem) VALUES (?, ?, ?, ?, ?)', [userId, 'Pin Comentário', 'Desc', '/uploads/comment.jpg', 'upload']);
    pinId = fotoRes.insertId;
    await db.pool.query('INSERT INTO fotos_categorias (foto_id, categoria_id) VALUES (?, ?)', [pinId, categoriaId]);
    agent = request.agent(app);
    await agent.post('/login').send({ email, senha });
  });

  afterAll(async () => {
    await db.pool.query('DELETE FROM comentarios WHERE usuario_id = ?', [userId]);
    await db.pool.query('DELETE FROM fotos_categorias WHERE foto_id = ?', [pinId]);
    await db.pool.query('DELETE FROM fotos WHERE id = ?', [pinId]);
    await db.pool.query('DELETE FROM categorias WHERE id = ?', [categoriaId]);
    await db.pool.query('DELETE FROM usuarios WHERE id = ?', [userId]);
  });

  it('deve adicionar comentário com sucesso', async () => {
    const res = await agent
      .post(`/pin/${pinId}/comentar`)
      .send({ comentario: 'Comentário de teste' });
    expect(res.statusCode).toBe(302);
    expect([`/pin/${pinId}`, '/']).toContain(res.headers.location);
  });

  it('deve ignorar comentário vazio', async () => {
    const res = await agent
      .post(`/pin/${pinId}/comentar`)
      .send({ comentario: '   ' });
    expect(res.statusCode).toBe(302);
    expect([`/pin/${pinId}`, '/']).toContain(res.headers.location);
  });
});