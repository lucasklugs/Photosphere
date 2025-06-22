const express = require('express');
const router = express.Router();
const {
  pool,
  buscarAdmin,
  buscarUsuarios,
  buscarAdmins,
  excluirUsuario,
  promoverParaAdmin,
  buscarCategorias,
  excluirCategoria,
  adicionarCategoria,
  atualizarCategoria
} = require('../db');

// Middleware para verificar sessão de admin
function verificarSessaoAdmin(req, res, next) {
  if (req.session && req.session.admemail) {
    return next();
  }
  res.redirect('/admin');
}

// Página de login admin
router.get('/', (req, res) => {
  res.render('admin/login');
});

// Dashboard com abas de usuários e admins
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
    const id = req.params.id;
    await excluirUsuario(id);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Erro ao excluir usuário:', err);
    res.status(500).send('Erro ao excluir usuário.');
  }
});

// Categorias
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

router.post('/categorias/adicionar', async (req, res) => {
  const { nome } = req.body;
  try {
    await adicionarCategoria(nome);
    res.redirect('/admin/categorias');
  } catch (err) {
    console.error('Erro ao adicionar categoria:', err);
    res.status(500).send('Erro ao adicionar categoria');
  }
});

router.post('/categorias/excluir', async (req, res) => {
  const { id } = req.body;
  try {
    await excluirCategoria(id);
    res.redirect('/admin/categorias');
  } catch (err) {
    console.error('Erro ao excluir categoria:', err);
    res.status(500).send('Erro ao excluir categoria');
  }
});

router.post('/categorias/editar/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { nome } = req.body;
    await atualizarCategoria(id, nome);
    res.redirect('/admin/categorias');
  } catch (err) {
    console.error('Erro ao atualizar categoria:', err);
    res.status(500).send('Erro ao atualizar categoria.');
  }
});

// Logout admin
router.get('/logout_admin', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin');
  });
});

module.exports = router;
