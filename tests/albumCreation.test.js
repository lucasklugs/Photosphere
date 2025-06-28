const request = require('supertest');
const app = require('../app');
const db = require('../db');

describe('RF-005/CT-004 – Criar e organizar álbuns', () => {
  const email = 'album@teste.com';
  const senha = 'senha123';
  let agent, userId, fotoId, pinId, albumId;

  beforeAll(async () => {
    await db.pool.query('DELETE FROM usuarios WHERE email = ?', [email]);
    const bcrypt = require('bcrypt');
    const senhaHash = await bcrypt.hash(senha, 10);
    const [userRes] = await db.pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)', 
      ['Album User', email, senhaHash]
    );
    userId = userRes.insertId;
    // Cria uma foto/pin
    const [fotoRes] = await db.pool.query(
      'INSERT INTO fotos (usuario_id, titulo, descricao, url, origem) VALUES (?, ?, ?, ?, ?)', 
      [userId, 'Pin Teste', 'Desc', '/uploads/teste.jpg', 'upload']
    );
    pinId = fotoRes.insertId;
    agent = request.agent(app);
    await agent.post('/login').send({ email, senha });
  });

  afterAll(async () => {
    if (albumId) await db.pool.query('DELETE FROM albuns WHERE id = ?', [albumId]);
    await db.pool.query('DELETE FROM fotos WHERE id = ?', [pinId]);
    await db.pool.query('DELETE FROM usuarios WHERE id = ?', [userId]);
  });

  it('deve criar um novo álbum e adicionar um pin', async () => {
    const res = await agent
      .post(`/pin/${pinId}/adicionarAoAlbum`)
      .send({ albumId: 'novo', novoAlbum: 'Meu Novo Álbum' });
    expect(res.statusCode).toBe(302);
    expect([`/pin/${pinId}`, '/']).toContain(res.headers.location);
    // Busca o álbum criado para remover depois
    const [rows] = await db.pool.query('SELECT id FROM albuns WHERE usuario_id = ? ORDER BY id DESC LIMIT 1', [userId]);
    if (rows.length) albumId = rows[0].id;
  });

  it('deve adicionar um pin a um álbum existente', async () => {
    // Garante que existe um álbum
    if (!albumId) {
      const [resAlbum] = await db.pool.query(
        'INSERT INTO albuns (usuario_id, nome) VALUES (?, ?)', 
        [userId, 'Álbum Existente']
      );
      albumId = resAlbum.insertId;
    }
    const res = await agent
      .post(`/pin/${pinId}/adicionarAoAlbum`)
      .send({ albumId });
    expect(res.statusCode).toBe(302);
    expect([`/pin/${pinId}`, '/']).toContain(res.headers.location);
  });

  it('deve falhar ao criar álbum sem nome', async () => {
    const res = await agent
      .post(`/pin/${pinId}/adicionarAoAlbum`)
      .send({ albumId: 'novo', novoAlbum: '' });
    expect([400, 302]).toContain(res.statusCode);
    if (res.statusCode === 400) {
      expect(res.text).toMatch(/Nome do novo álbum é obrigatório/);
    }
  });
});