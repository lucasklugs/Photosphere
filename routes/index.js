var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../db');

//ROTAS GET

// Página login
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Página de login' });
});

// Página explorar
router.get('/explorar', function(req, res, next) {
  res.render('explorar', { title: 'Página - Explorar' });
});

// Página perfil (exemplo placeholder)
router.get('/perfil', function(req, res, next) {
  const user = {
    username: 'teste',
    cover: '/images/placeholder-cover.jpg',
    avatar: '/images/placeholder-avatar.png',
    handle: 'teste123',
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

//ROTAS POST

// Cadastro de usuário
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, foto_perfil } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).send('Todos os campos são obrigatórios!');
    }

    const [rows] = await connection.execute("SELECT email FROM usuarios WHERE email = ?", [email]);
    if (rows.length > 0) {
      return res.status(409).send('E-mail já cadastrado!');
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    await connection.execute(
      'INSERT INTO usuarios (nome, email, senha_hash, foto_perfil) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, foto_perfil || null]
    );

    res.status(201).send('✅ Usuário cadastrado com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao registrar:', err);
    res.status(500).send('Erro ao registrar');
  }
});

// Login de usuário
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const [results] = await connection.execute('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(401).send('Usuário não encontrado');
    }

    const user = results[0];
    const senhaCorreta = await bcrypt.compare(senha, user.senha_hash);

    if (!senhaCorreta) {
      return res.status(401).send('Senha incorreta');
    }

    res.redirect('/explorar');

  } catch (err) {
    console.error('❌ Erro no login:', err);
    res.status(500).send('Erro no login');
  }
});

module.exports = router;
