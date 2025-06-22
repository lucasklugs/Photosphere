const express = require('express');
const router = express.Router();
const {
  pool,
  buscarAdmin,
  buscarUsuarios,
  buscarAdmins,
  excluirUsuario,
  excluirAdmin,
  promoverParaAdmin,
  buscarCategorias,
  excluirCategoria,
  adicionarCategoria,
  atualizarCategoria
} = require('../db');

// Middleware para validar sessão de admin
function verificarSessaoAdmin(req, res, next) {
  if (req.session && req.session.admemail) return next();
  res.redirect('/admin');
}

// Página de login
router.get('/', (req, res) => {
  res.render('admin/login');
});

// Login admin
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const admin = await buscarAdmin({ email, senha });

    if (admin && admin.admcodigo) {
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

// Dashboard (usuários e admins)
router.get('/dashboard', verificarSessaoAdmin, async (req, res) => {
  try {
    const usuarios = await buscarUsuarios();
    const admins = await buscarAdmins();
    res.render('admin/dashboard', {
      admNome: req.session.admnome,
      usuarios,
      admins
    });
  } catch (err) {
    console.error('Erro ao carregar dashboard:', err);
    res.status(500).send('Erro interno no servidor.');
  }
});

// Promover usuário para admin
router.post('/usuarios/promover/:id', async (req, res) => {
  try {
    await promoverParaAdmin(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Erro ao promover:', err);
    res.status(500).send('Erro ao promover usuário.');
  }
});

// Excluir usuário
router.post('/usuarios/excluir/:id', async (req, res) => {
  try {
    await excluirUsuario(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Erro ao excluir usuário:', err);
    res.status(500).send('Erro ao excluir usuário.');
  }
});

// Excluir admin
router.post('/admins/excluir/:id', async (req, res) => {
  try {
    await excluirAdmin(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Erro ao excluir admin:', err);
    res.status(500).send('Erro ao excluir admin.');
  }
});

// Página de categorias
router.get('/categorias', verificarSessaoAdmin, async (req, res) => {
  try {
    const usuarios = await buscarUsuarios();
    const categorias = await buscarCategorias();
    res.render('admin/categorias', {
      admNome: req.session.admnome,
      usuarios,
      categorias
    });
  } catch (err) {
    console.error('Erro ao carregar categorias:', err);
    res.status(500).send('Erro interno no servidor.');
  }
});

// Adicionar categoria
router.post('/categorias/adicionar', async (req, res) => {
  try {
    await adicionarCategoria(req.body.nome);
    res.redirect('/admin/categorias');
  } catch (err) {
    console.error('Erro ao adicionar categoria:', err);
    res.status(500).send('Erro ao adicionar categoria.');
  }
});

// Excluir categoria
router.post('/categorias/excluir', async (req, res) => {
  try {
    await excluirCategoria(req.body.id);
    res.redirect('/admin/categorias');
  } catch (err) {
    console.error('Erro ao excluir categoria:', err);
    res.status(500).send('Erro ao excluir categoria.');
  }
});

// Editar categoria
router.post('/categorias/editar/:id', async (req, res) => {
  try {
    await atualizarCategoria(req.params.id, req.body.nome);
    res.redirect('/admin/categorias');
  } catch (err) {
    console.error('Erro ao atualizar categoria:', err);
    res.status(500).send('Erro ao atualizar categoria.');
  }
});

// Página fotos
router.get('/fotos', verificarSessaoAdmin, async (req, res) => {
  try {
    const usuarios = await buscarUsuarios();
    res.render('admin/fotos', {
      admNome: req.session.admnome,
      usuarios
    });
  } catch (err) {
    console.error('Erro ao carregar fotos:', err);
    res.status(500).send('Erro interno no servidor.');
  }
});

// Logout admin
router.get('/logout_admin', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin');
  });
});

module.exports = router;
