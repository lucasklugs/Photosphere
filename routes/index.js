var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Página de login' });
});

router.get('/explorar', function(req, res, next) {
  res.render('explorar', { title: 'Página - Explorar' });
});

module.exports = router;
