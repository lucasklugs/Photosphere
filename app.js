require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const connection = require('./db');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Página de login
app.get('/', (req, res) => {
  res.render('login');
});

// Cadastro de usuário
app.post('/register', async (req, res) => {
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
app.post('/login', async (req, res) => {
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

// rota para página explorar
app.get('/explorar', (req, res) => {
  res.render('explorar', { title: 'Página - Explorar' });
});

// Catch 404
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
