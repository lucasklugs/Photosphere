var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var path = require('path');
var multer = require('multer');
const fs = require('fs');

var db = require('../db');
var pool = db.pool;

// Middleware para verificar se o usuário está logado
function verificarLogin(req, res, next) {
  if (req.session && req.session.usuario) {
    next();
  } else {
    res.redirect('/');
  }
}

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: (req, file, cb) => {
    const nomeArquivo = Date.now() + path.extname(file.originalname);
    cb(null, nomeArquivo);
  }
});
const upload = multer({ storage });

// --- Rotas ---

// Página de login
router.get('/', (req, res) => {
  res.render('login', { title: 'Página de login' });
});

// Página explorar - exige login
router.get('/explorar', verificarLogin, async (req, res) => {
  const sessUser = req.session.usuario;
  const fotos = await db.buscarFotosComFavoritos(sessUser.id);
  res.render('explorar', { title: 'Página - Explorar', fotos });
});

// Página perfil - exige login
router.get('/perfil', verificarLogin, async (req, res) => {
  const sessUser = req.session.usuario;

const user = {
  username: sessUser.nome,
  cover: sessUser.foto_cover || '/images/placeholder-cover.jpg',
  avatar: sessUser.foto_perfil || '/images/placeholder-avatar.png',
  followers: 1200,
  saves: 350
};

  // Pins estáticos para exemplo
  const pins = [
    { imageUrl: '/images/placeholder-1-1.png', title: 'Pin 1' },
    { imageUrl: '/images/placeholder-4-5.png', title: 'Pin 2' },
    { imageUrl: '/images/placeholder-1-1.png', title: 'Pin 3' },
    { imageUrl: '/images/placeholder-1-1.png', title: 'Pin 12' },
    { imageUrl: '/images/placeholder-4-5.png', title: 'Pin 22' }
  ];

  // Buscar favoritos reais do usuário
  const favoritos = await db.buscarFavoritosPorUsuario(sessUser.id);

  res.render('perfil', { title: 'Página - Perfil', user, pins, favoritos });
});

// Página criar pin - exige login
router.get('/criar', verificarLogin, (req, res) => {
  const sessUser = req.session.usuario;

  const user = {
    username: sessUser.nome,
    avatar: '/images/placeholder-avatar.png'
  };

  res.render('criar', { title: 'Página - Criar', user });
});

// Upload de imagem - exige login
router.post('/upload', verificarLogin, upload.single('imagem'), (req, res) => {
  console.log(req.file);
  console.log(req.body);
  res.send('✅ Upload concluído com sucesso!');
});

// Página de um pin específico - exige login
router.get('/pin/:id', verificarLogin, async (req, res) => {
  const pinId = req.params.id;
  const pin = await db.buscarPinPorId(pinId);

  if (!pin) return res.status(404).send('Pin não encontrado.');

  const comentarios = await db.buscarComentariosPorFoto(pinId);
  res.render('pin', { pin, comentarios });
});

// Enviar comentário para pin - exige login
router.post('/pin/:id/comentar', verificarLogin, async (req, res) => {
  const fotoId = req.params.id;
  const { comentario } = req.body;
  const usuarioId = req.session.usuario.id;

  if (!comentario.trim()) return res.redirect(`/pin/${fotoId}`);

  await db.adicionarComentario(usuarioId, fotoId, comentario);
  res.redirect(`/pin/${fotoId}`);
});

// Página de configurações (GET) - exige login
router.get('/config', verificarLogin, (req, res) => {
  const sessUser = req.session.usuario;

  // Informações do usuário
  const user = {
    nome: sessUser.nome,
    email: sessUser.email,
    avatar: sessUser.foto_perfil || '/images/placeholder-avatar.png',
    cover: sessUser.foto_cover || '/images/placeholder_cover.jpg'
  };

  res.render('config', { title: 'Configurações', user });
});

// Atualizar perfil do usuário - exige login
router.post('/config', verificarLogin, upload.fields([
  { name: 'foto_perfil', maxCount: 1 },
  { name: 'foto_cover', maxCount: 1 }
]), async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    const { nome, senha } = req.body;

    if (!nome) {
      return res.status(400).send('Nome é obrigatório.');
    }

    const fotoPerfil = req.files['foto_perfil'] ? `/uploads/${req.files['foto_perfil'][0].filename}` : req.session.usuario.foto_perfil;
    const fotoCover = req.files['foto_cover'] ? `/uploads/${req.files['foto_cover'][0].filename}` : req.session.usuario.foto_cover;

    // Remover foto_perfil antiga se existir
    if (req.files['foto_perfil'] && req.session.usuario.foto_perfil && req.session.usuario.foto_perfil.startsWith('/uploads/')) {
      const caminhoAntigo = path.join(__dirname, '../public', req.session.usuario.foto_perfil);
      fs.unlink(caminhoAntigo, err => err && console.error('Erro ao excluir foto_perfil antiga:', err));
    }

    // Remover foto_cover antiga se existir
    if (req.files['foto_cover'] && req.session.usuario.foto_cover && req.session.usuario.foto_cover.startsWith('/uploads/')) {
      const caminhoAntigo = path.join(__dirname, '../public', req.session.usuario.foto_cover);
      fs.unlink(caminhoAntigo, err => err && console.error('Erro ao excluir foto_cover antiga:', err));
    }

    // query
    let query = 'UPDATE usuarios SET nome = ?, foto_perfil = ?, foto_cover = ?';
    const params = [nome, fotoPerfil, fotoCover];

    if (senha && senha.trim().length > 0) {
      const senhaHash = await bcrypt.hash(senha, 10);
      query += ', senha_hash = ?';
      params.push(senhaHash);
    }

    query += ' WHERE id = ?';
    params.push(usuarioId);

    await pool.execute(query, params);

    // Atualiza a sessão com os novos dados
    req.session.usuario.nome = nome;
    req.session.usuario.foto_perfil = fotoPerfil;
    req.session.usuario.foto_cover = fotoCover;

    res.redirect('/perfil');
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    res.status(500).send('Erro ao atualizar perfil.');
  }
});

// Deletar conta do usuário - exige login
router.delete('/config/deletar-conta', verificarLogin, async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;

    // Excluir fotos físicas (perfil e cover) da conta antes de deletar
    if (req.session.usuario.foto_perfil && req.session.usuario.foto_perfil.startsWith('/uploads/')) {
      const caminhoPerfil = path.join(__dirname, '../public', req.session.usuario.foto_perfil);
      fs.unlink(caminhoPerfil, err => err && console.error('Erro ao excluir foto_perfil:', err));
    }
    if (req.session.usuario.foto_cover && req.session.usuario.foto_cover.startsWith('/uploads/')) {
      const caminhoCover = path.join(__dirname, '../public', req.session.usuario.foto_cover);
      fs.unlink(caminhoCover, err => err && console.error('Erro ao excluir foto_cover:', err));
    }

    // Deletar o usuário do banco
    const [resultado] = await pool.query('DELETE FROM usuarios WHERE id = ?', [usuarioId]);

    if (resultado.affectedRows === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    // Destruir a sessão após deletar a conta
    req.session.destroy(err => {
      if (err) {
        console.error('Erro ao destruir sessão:', err);
        return res.status(500).send('Erro ao finalizar sessão');
      }
      res.status(200).send('Conta deletada com sucesso');
    });
  } catch (err) {
    console.error('Erro ao deletar conta:', err);
    res.status(500).send('Erro ao deletar conta');
  }
});

// Página seguidores/seguindo - exige login
router.get('/seguindo_seguidores', verificarLogin, (req, res) => {
  const tab = req.query.tab || 'seguidores';

  const user = {
    username: 'joaodasilva',
    avatar: '/images/placeholder-avatar.png'
  };

  // Lista simulada para seguidores ou seguindo
  const listaUsuarios = tab === 'seguidores'
    ? [
        { nome: 'Usuário 3', avatar: '/images/placeholder-avatar.png', seguindo: true },
        { nome: 'Usuário Num 5', avatar: '/images/placeholder-avatar.png', seguirDeVolta: true },
        { nome: 'Usuário 32', avatar: '', seguindo: true }
      ]
    : [
        { nome: 'Usuário 32', avatar: '/images/placeholder-avatar.png', seguindo: true },
        { nome: 'Usuário 3', avatar: '/images/placeholder-avatar.png', seguindo: true }
      ];

  res.render('seguindo_seguidores', {
    title: 'Seguidores',
    tab,
    listaUsuarios,
    user
  });
});

// Cadastro de usuário
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, foto_perfil, foto_cover } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).send('Nome, email e senha são obrigatórios!');
    }

    // Verifica se o email já existe
    const [rows] = await pool.execute("SELECT email FROM usuarios WHERE email = ?", [email]);
    if (rows.length > 0) {
      return res.status(409).send('E-mail já cadastrado!');
    }

    // Criptografa senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Insere usuário no banco
    const [result] = await pool.execute(
      'INSERT INTO usuarios (nome, email, senha_hash, foto_perfil, foto_cover) VALUES (?, ?, ?, ?, ?)',
      [nome, email, senhaHash, foto_perfil || null, foto_cover || null]
    );

    // Cria sessão do usuário
    req.session.usuario = {
      id: result.insertId,
      nome,
      email,
      foto_perfil: foto_perfil || null,
      foto_cover: foto_cover || null
    };

    res.redirect('/explorar');
  } catch (err) {
    console.error('❌ Erro ao registrar:', err);
    res.status(500).send('Erro ao registrar');
  }
});

// Login de usuário
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const [results] = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(401).send('Usuário não encontrado');
    }

    const user = results[0];
    const senhaCorreta = await bcrypt.compare(senha, user.senha_hash);

    if (!senhaCorreta) {
      return res.status(401).send('Senha incorreta');
    }

    // Cria sessão do usuário
    req.session.usuario = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      foto_perfil: user.foto_perfil,
      foto_cover: user.foto_cover
    };

    res.redirect('/explorar');
  } catch (err) {
    console.error('❌ Erro no login:', err);
    res.status(500).send('Erro no login');
  }
});

// Favoritar ou desfavoritar uma foto - exige login
router.post('/favoritar', verificarLogin, async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    const { fotoId } = req.body;

    // Verifica se já favoritou
    const [rows] = await pool.query(
      'SELECT id FROM curtidas WHERE usuario_id = ? AND foto_id = ?',
      [usuarioId, fotoId]
    );

    if (rows.length > 0) {
      // Remove favorito
      await pool.query('DELETE FROM curtidas WHERE usuario_id = ? AND foto_id = ?', [usuarioId, fotoId]);
      return res.json({ favoritado: false });
    } else {
      // Adiciona favorito
      await pool.query('INSERT INTO curtidas (usuario_id, foto_id) VALUES (?, ?)', [usuarioId, fotoId]);
      return res.json({ favoritado: true });
    }
  } catch (err) {
    console.error('Erro ao alternar curtida:', err);
    res.status(500).json({ erro: 'Erro interno' });
  }
});

// Logout - destrói a sessão
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Erro ao sair:', err);
      return res.status(500).send('Erro ao sair');
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

module.exports = router;
