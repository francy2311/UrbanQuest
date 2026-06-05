
function requireAuth(req, res, next) {
  if (!req.session.user) {
    req.session.error = 'Devi effettuare il login per accedere a questa pagina.';
    return res.redirect('/login');
  }

  next();
}

function requireGuest(req, res, next) {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }

  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    req.session.error = 'Non hai i permessi per accedere a questa pagina.';
    return res.redirect('/');
  }

  next();
}

module.exports = {
  requireAuth,
  requireGuest,
  requireAdmin
};
