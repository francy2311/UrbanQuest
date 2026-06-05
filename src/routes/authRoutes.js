const express = require('express');
const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');
const { requireGuest } = require('../middleware/auth');

const router = express.Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.get('/register', requireGuest, (req, res) => {
  res.render('auth/register', {
    title: 'Registrazione'
  });
});

router.post('/register', requireGuest, (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const confirmPassword = String(req.body.confirmPassword || '');

  if (!name || !email || !password || !confirmPassword) {
    req.session.error = 'Compila tutti i campi.';
    return res.redirect('/register');
  }

  if (name.length < 2) {
    req.session.error = 'Il nome deve contenere almeno 2 caratteri.';
    return res.redirect('/register');
  }

  if (!isValidEmail(email)) {
    req.session.error = 'Inserisci un indirizzo email valido.';
    return res.redirect('/register');
  }

  if (password.length < 8) {
    req.session.error = 'La password deve contenere almeno 8 caratteri.';
    return res.redirect('/register');
  }

  if (password !== confirmPassword) {
    req.session.error = 'Le password non coincidono.';
    return res.redirect('/register');
  }

  const existingUser = userRepository.findByEmail(email);

  if (existingUser) {
    req.session.error = 'Esiste già un account con questa email.';
    return res.redirect('/register');
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  const user = userRepository.createUser({
    name,
    email,
    passwordHash
  });

  req.session.user = user;
  req.session.success = 'Registrazione completata correttamente.';

  res.redirect('/dashboard');
});

router.get('/login', requireGuest, (req, res) => {
  res.render('auth/login', {
    title: 'Login'
  });
});

router.post('/login', requireGuest, (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!email || !password) {
    req.session.error = 'Inserisci email e password.';
    return res.redirect('/login');
  }

  const user = userRepository.findByEmail(email);

  if (!user) {
    req.session.error = 'Credenziali non valide.';
    return res.redirect('/login');
  }

  const passwordOk = bcrypt.compareSync(password, user.password_hash);

  if (!passwordOk) {
    req.session.error = 'Credenziali non valide.';
    return res.redirect('/login');
  }

  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    points: user.points
  };

  req.session.success = 'Login effettuato correttamente.';

  res.redirect('/dashboard');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
