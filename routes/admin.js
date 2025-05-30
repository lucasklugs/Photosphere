var express = require('express');
var router = express.Router();
const { buscarAdmin, buscarUsuarios, pool  } = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/login');  
});

router.get('/dashboard', async function(req, res, next){
  verificaLogin(res);
  const usuarios = await buscarUsuarios();
  res.render('admin/dashboard', { admNome: global.admnome, usuarios });
});

router.post('/login', async function(req, res, next) {
  const email = req.body.email;
  const senha = req.body.senha;

  const admin = await buscarAdmin({email,senha});

  if (admin.admcodigo)
  {
    pool.admcodigo = admin.admcodigo;
    pool.admemail = admin.admemail;
    pool.admnome = admin.admnome;
    res.redirect('/admin/dashboard');
  }
  else
  {
    res.redirect('/admin');
  }
});

function verificaLogin(res)
{
  if (!pool.admemail || pool.admemail == "")
  {
    res.redirect('/admin');
  }
}

module.exports = router;