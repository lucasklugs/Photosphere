var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var { pool } = require('../db');
var multer = require('multer');
var path = require('path');

// Função de verificação de login
function verificarLogin(req, res, next) {
  if (req.session && req.session.usuario) {
    next();
  } else {
    res.redirect('/');
  }
}

// Configuração de upload com multer
const storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: (req, file, cb) => {
    const nomeArquivo = Date.now() + path.extname(file.originalname);
    cb(null, nomeArquivo);
  }
});
const upload = multer({ storage });

// ROTAS GET

// Página login
router.get('/', (req, res) => {
  res.render('login', { title: 'Página de login' });
});

// Página explorar
router.get('/explorar', verificarLogin, (req, res) => {
  res.render('explorar', { title: 'Página - Explorar' });
});

// Página perfil
router.get('/perfil', verificarLogin, (req, res) => {
  const sessUser = req.session.usuario;

  const user = {
    username: sessUser.nome,
    cover: '/images/placeholder-cover.jpg',
    avatar: sessUser.foto_perfil || '/images/placeholder-avatar.png',
    followers: 1200,
    saves: 350
  };

  const pins = [
    { imageUrl: '/images/placeholder-1-1.png', title: 'Pin 1' },
    { imageUrl: '/images/placeholder-4-5.png', title: 'Pin 2' },
    { imageUrl: '/images/placeholder-1-1.png', title: 'Pin 3' },
    { imageUrl: '/images/placeholder-1-1.png', title: 'Pin 12' },
    { imageUrl: '/images/placeholder-4-5.png', title: 'Pin 22' }
  ];

  const favoritos = [
    { imageUrl: '/images/placeholder-4-5.png', title: 'Pin Favorito 1' },
    { imageUrl: '/images/placeholder-1-1.png', title: 'Pin Favorito 2' }
  ];

  res.render('perfil', { title: 'Página - Perfil', user, pins, favoritos });
});

// Página criar
router.get('/criar', verificarLogin, (req, res) => {
  const user = {
    username: 'teste',
    avatar: '/images/placeholder-avatar.png'
  };

  res.render('criar', { title: 'Página - Criar', user });
});

// Upload de imagem
router.post('/upload', verificarLogin, upload.single('imagem'), (req, res) => {
  console.log(req.file);
  console.log(req.body);

  res.send('✅ Upload concluído com sucesso!');
});

// Página de um pin específico
router.get('/pin/:id', verificarLogin, async (req, res) => {
  const pinId = req.params.id;

  const pin = {
    id: pinId,
    titulo: 'Cachorro com Pizza',
    imagemUrl: '/uploads/cachorro-pizza.png'
  };

  const comentarios = [
    { nome: 'João da Silva', texto: 'Muito fofo!' },
    { nome: 'Maria', texto: 'Amei essa imagem 🐶🍕' }
  ];

  res.render('pin', { pin, comentarios });
});

// Página seguindo/seguidores
router.get('/seguindo_seguidores', verificarLogin, (req, res) => {
  const tab = req.query.tab || 'seguidores';

  const user = {
    username: 'joaodasilva',
    avatar: '/images/placeholder-avatar.png'
  };

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

// ROTAS POST

// Cadastro de usuário
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, foto_perfil } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).send('Todos os campos são obrigatórios!');
    }

    const [rows] = await pool.execute("SELECT email FROM usuarios WHERE email = ?", [email]);
    if (rows.length > 0) {
      return res.status(409).send('E-mail já cadastrado!');
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const [result] = await pool.execute(
      'INSERT INTO usuarios (nome, email, senha_hash, foto_perfil) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, foto_perfil || null]
    );

    // Já loga o usuário após o cadastro
    req.session.usuario = {
      id: result.insertId,
      nome: nome,
      email: email,
      foto_perfil: foto_perfil || null
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

    req.session.usuario = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      foto_perfil: user.foto_perfil
    };

    res.redirect('/explorar');
  } catch (err) {
    console.error('❌ Erro no login:', err);
    res.status(500).send('Erro no login');
  }
});

// Logout
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
