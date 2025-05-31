var express = require('express');
var router = express.Router();
const { pool, buscarAdmin, buscarUsuarios, excluirUsuario, buscarCategorias, excluirCategoria, adicionarCategoria } = require('../db');

//Rotas GET
router.get('/', function(req, res, next) {
  res.render('admin/login');  
});

router.get('/dashboard', async function(req, res) {
  try {
    if (!req.session.admemail) {
      return res.redirect('/admin');
    }

    const usuarios = await buscarUsuarios();
    res.render('admin/dashboard', {
      admNome: req.session.admnome,
      usuarios
    });
  } catch (err) {
    console.error('Erro ao carregar dashboard:', err);
    res.status(500).send('Erro interno no servidor.');
  }
});

router.get('/categorias', async function(req, res) {
  try {
    if (!req.session.admemail) {
      return res.redirect('/admin');
    }

    const usuarios = await buscarUsuarios();
    const categorias = await buscarCategorias();
    res.render('admin/categorias', {
      admNome: req.session.admnome,
      usuarios, categorias
    });
  } catch (err) {
    console.error('Erro ao carregar dashboard:', err);
    res.status(500).send('Erro interno no servidor.');
  } 
});

router.get('/fotos', async function(req, res) {
  try {
    if (!req.session.admemail) {
      return res.redirect('/admin');
    }

    const usuarios = await buscarUsuarios();
    res.render('admin/fotos', {
      admNome: req.session.admnome,
      usuarios
    });
  } catch (err) {
    console.error('Erro ao carregar dashboard:', err);
    res.status(500).send('Erro interno no servidor.');
  }  
});


//Rotas POST
router.post('/login', async function(req, res) {
  try {
    const email = req.body.email;
    const senha = req.body.senha;

    const admin = await buscarAdmin({ email, senha });

    if (admin.admcodigo) {
      req.session.admcodigo = admin.admcodigo;
      req.session.admemail = admin.admemail;
      req.session.admnome = admin.admnome;
      res.redirect('/admin/dashboard');
    } else {
      res.redirect('/admin');
    }
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).send('Erro interno no login.');
  }
});

router.post('/usuarios/excluir/:id', async function(req, res) {
  try {
    const id = req.params.id;
    await excluirUsuario(id);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Erro ao excluir usuário:', err);
    res.status(500).send('Erro ao excluir usuário.');
  }
});

router.post('/categorias/adicionar', async (req, res) => {
  const { nome } = req.body;

  try {
    await pool.query('INSERT INTO categorias (nome) VALUES (?);', [nome]);
    res.redirect('/admin/categorias');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao adicionar categoria');
  }
});

router.post('/categorias/excluir', async (req, res) => {
  const { id } = req.body;

  try {
    await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
    res.redirect('/admin/categorias');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao excluir categoria');
  }
});

router.post('/categorias/adicionar', async (req, res) => {
  const { nome } = req.body;

  try {
    await adicionarCategoria(nome);
    res.redirect('/admin/categorias');
  } catch (error) {
    console.error('Erro ao adicionar categoria:', error);
    res.status(500).send('Erro ao adicionar categoria');
  }
});

// Logout
router.get('/logout_admin', function(req, res) {
  req.session.destroy(() => {
    res.redirect('/admin');
  });
});

module.exports = router;