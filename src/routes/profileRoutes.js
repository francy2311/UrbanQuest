const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { uploadProfileImage } = require('../middleware/upload');
const userRepository = require('../repositories/userRepository');

const router = express.Router();

router.post(
  '/profile/photo',
  requireAuth,
  uploadProfileImage.single('profileImage'),
  (req, res) => {
    if (!req.file) {
      req.session.error = 'Seleziona una foto profilo valida.';
      return res.redirect('/dashboard');
    }

    const profileImagePath = `/uploads/profiles/${req.file.filename}`;

    userRepository.updateProfileImage(req.session.user.id, profileImagePath);

    const updatedUser = userRepository.findById(req.session.user.id);
    req.session.user = updatedUser;

    req.session.success = 'Foto profilo aggiornata correttamente.';
    res.redirect('/dashboard');
  }
);

router.use((err, req, res, next) => {
  if (err) {
    req.session.error = err.message || 'Errore durante il caricamento della foto profilo.';
    return res.redirect('/dashboard');
  }

  next();
});

module.exports = router;
