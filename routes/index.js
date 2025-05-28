var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Página de login' });
});

router.get('/explorar', function(req, res, next) {
  res.render('explorar', { title: 'Página - Explorar' });
});

/* GET página perfil (PLACEHOLDER APENAS - RELACIONAR COM O BANCO) */
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

module.exports = router;
