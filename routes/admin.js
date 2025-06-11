const express = require('express');
const router = express.Router();
const {
  pool,
  buscarAdmin,
  buscarUsuarios,
  excluirUsuario,
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

// Rotas GET

// Página de login admin
router.get('/', (req, res) => {
  res.render('admin/login');
});

// Dashboard admin (lista usuários)
router.get('/dashboard', verificarSessaoAdmin, async (req, res) => {
  try {
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

// Página categorias (lista usuários e categorias)
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

// Página fotos (lista usuários)
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

// Página editar categoria
router.get('/categorias/editar/:id', verificarSessaoAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query('SELECT * FROM categorias WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).send('Categoria não encontrada.');
    }

    const categoria = rows[0];
    res.render('admin/editarCategoria', {
      admNome: req.session.admnome,
      categoria
    });
  } catch (err) {
    console.error('Erro ao carregar categoria para edição:', err);
    res.status(500).send('Erro interno no servidor.');
  }
});

// Rotas POST

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

// Adicionar categoria
router.post('/categorias/adicionar', async (req, res) => {
  const { nome } = req.body;

  try {
    // Usar função do DB ou query direta (evitar duplicação)
    await adicionarCategoria(nome);
    res.redirect('/admin/categorias');
  } catch (err) {
    console.error('Erro ao adicionar categoria:', err);
    res.status(500).send('Erro ao adicionar categoria');
  }
});

// Excluir categoria
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

// Atualizar categoria
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
