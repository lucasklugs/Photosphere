const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../app');
const db = require('../db');

describe('RF-004/CT-003 – Upload de fotos', () => {
  const email = 'upload@teste.com';
  const senha = 'senha123';
  let agent, userId, fotoId, categoriaId, fotoUrl;

  beforeAll(async () => {
    await db.pool.query('DELETE FROM usuarios WHERE email = ?', [email]);
    const bcrypt = require('bcrypt');
    const senhaHash = await bcrypt.hash(senha, 10);
    const [userRes] = await db.pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)',
      ['Upload User', email, senhaHash]
    );
    userId = userRes.insertId;

    // Cria categoria de teste
    const [catRes] = await db.pool.query(
      'INSERT INTO categorias (nome) VALUES (?)',
      ['Categoria Teste']
    );
    categoriaId = catRes.insertId;

    agent = request.agent(app);
    await agent.post('/login').send({ email, senha });
  });

  afterAll(async () => {
    // Remove arquivo físico se existir
    if (fotoUrl) {
      const filePath = path.join(__dirname, '../public', fotoUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    if (fotoId) await db.pool.query('DELETE FROM fotos WHERE id = ?', [fotoId]);
    await db.pool.query('DELETE FROM usuarios WHERE id = ?', [userId]);
    await db.pool.query('DELETE FROM categorias WHERE id = ?', [categoriaId]);
  });

  it('deve fazer upload de uma foto com sucesso', async () => {
    const res = await agent
      .post('/upload')
      .field('titulo', 'Foto Teste')
      .field('descricao', 'Descrição da foto')
      .field('categoria', categoriaId)
      .attach('imagem', path.join(__dirname, 'fixtures', 'foto.jpg'));
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/perfil');
    // Busca a foto criada para remover depois
    const [rows] = await db.pool.query('SELECT id, url FROM fotos WHERE usuario_id = ? ORDER BY id DESC LIMIT 1', [userId]);
    if (rows.length) {
      fotoId = rows[0].id;
      fotoUrl = rows[0].url;
    }
  });

  it('deve falhar ao enviar sem arquivo', async () => {
    const res = await agent
      .post('/upload')
      .field('titulo', 'Sem Foto');
    expect([302, 400]).toContain(res.statusCode);
    if (res.statusCode === 400) {
      expect(res.text).toMatch(/Nenhum arquivo foi enviado/);
    }
  });
});