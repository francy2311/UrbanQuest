const express = require('express');
const missionRepository = require('../repositories/missionRepository');
const categoryRepository = require('../repositories/categoryRepository');
const participationRepository = require('../repositories/participationRepository');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function isValidDifficulty(difficulty) {
  return ['easy', 'medium', 'hard'].includes(difficulty);
}
function generateUnlockCode() {
  return Math.random().toString(36).substring(2, 10);
}

/* =========================
   LISTA MISSIONI
========================= */

router.get('/missions', (req, res) => {
  const filters = {
    categoryId: req.query.categoryId || '',
    difficulty: req.query.difficulty || '',
    zone: req.query.zone || ''
  };

  const missions = missionRepository.findAllOpen(filters);
  const categories = categoryRepository.findAll();

  res.render('missions/list', {
    title: 'Missioni',
    missions,
    categories,
    filters
  });
});

/* =========================
   MAPPA MISSIONI
   Deve stare PRIMA di /missions/:id
========================= */

router.get('/missions/map', (req, res) => {
  const missions = missionRepository.findAllWithCoordinates();

  res.render('missions/map', {
    title: 'Mappa missioni',
    missionsJson: JSON.stringify(missions)
  });
});

/* =========================
   FORM CREAZIONE MISSIONE
========================= */

router.get('/missions/create', requireAuth, (req, res) => {
  const categories = categoryRepository.findAll();

  res.render('missions/create', {
    title: 'Crea missione',
    categories
  });
});

/* =========================
   CREAZIONE MISSIONE
========================= */

router.post('/missions/create', requireAuth, (req, res) => {
  const title = String(req.body.title || '').trim();
  const description = String(req.body.description || '').trim();
  const zone = String(req.body.zone || '').trim();
  const address = String(req.body.address || '').trim();
  const latitude = req.body.latitude ? Number(req.body.latitude) : null;
  const longitude = req.body.longitude ? Number(req.body.longitude) : null;
  const difficulty = String(req.body.difficulty || '').trim();
  const points = Number(req.body.points);
  const categoryId = req.body.categoryId ? Number(req.body.categoryId) : null;
  const isHidden = req.body.isHidden === 'on';
  const unlockCode = isHidden ? generateUnlockCode() : null;

  if (!title || !description || !zone || !difficulty || !points) {
    req.session.error = 'Compila tutti i campi obbligatori.';
    return res.redirect('/missions/create');
  }

  if (title.length < 4 || title.length > 100) {
    req.session.error = 'Il titolo deve contenere tra 4 e 100 caratteri.';
    return res.redirect('/missions/create');
  }

  if (description.length < 10 || description.length > 1000) {
    req.session.error = 'La descrizione deve contenere tra 10 e 1000 caratteri.';
    return res.redirect('/missions/create');
  }

  if (zone.length < 2 || zone.length > 80) {
    req.session.error = 'La zona deve contenere tra 2 e 80 caratteri.';
    return res.redirect('/missions/create');
  }

  if (!isValidDifficulty(difficulty)) {
    req.session.error = 'Difficoltà non valida.';
    return res.redirect('/missions/create');
  }

  if (!Number.isInteger(points) || points <= 0 || points > 200) {
    req.session.error = 'Il punteggio deve essere un numero intero tra 1 e 200.';
    return res.redirect('/missions/create');
  }

  if (
    (latitude !== null && Number.isNaN(latitude)) ||
    (longitude !== null && Number.isNaN(longitude))
  ) {
    req.session.error = 'Coordinate non valide.';
    return res.redirect('/missions/create');
  }

  const mission = missionRepository.create({
    title,
    description,
    zone,
    address,
    latitude,
    longitude,
    difficulty,
    points,
    isHidden,
    unlockCode,
    categoryId,
    creatorId: req.session.user.id
  });

  req.session.success = 'Missione creata correttamente.';
  res.redirect(`/missions/${mission.id}`);
});

/* =========================
   ACCETTAZIONE MISSIONE
   Deve stare PRIMA di /missions/:id
========================= */

router.post('/missions/:id/accept', requireAuth, (req, res) => {
  const missionId = Number(req.params.id);
  const userId = req.session.user.id;

  const mission = missionRepository.findById(missionId);

  if (!mission) {
    req.session.error = 'Missione non trovata.';
    return res.redirect('/missions');
  }

  if (mission.status !== 'open') {
    req.session.error = 'Questa missione non è più disponibile.';
    return res.redirect(`/missions/${missionId}`);
  }

  if (mission.creator_id === userId) {
    req.session.error = 'Non puoi accettare una missione che hai creato tu.';
    return res.redirect(`/missions/${missionId}`);
  }

  const existingParticipation = participationRepository.findByMissionAndUser(
    missionId,
    userId
  );

  if (existingParticipation) {
    req.session.error = 'Hai già accettato questa missione.';
    return res.redirect(`/missions/${missionId}`);
  }

  participationRepository.create({
    missionId,
    userId
  });

  req.session.success = 'Missione accettata correttamente.';
  res.redirect('/dashboard/my-participations');
});

/* =========================
   PARTECIPANTI MISSIONE
   Visibile solo al creatore
========================= */

router.get('/missions/:id/participants', requireAuth, (req, res) => {
  const missionId = Number(req.params.id);
  const mission = missionRepository.findById(missionId);

  if (!mission) {
    req.session.error = 'Missione non trovata.';
    return res.redirect('/dashboard/my-missions');
  }

  if (mission.creator_id !== req.session.user.id) {
    req.session.error = 'Non puoi vedere i partecipanti di una missione non tua.';
    return res.redirect('/dashboard/my-missions');
  }

  const participants = participationRepository.findByMissionIdForCreator(missionId);

  res.render('missions/participants', {
    title: 'Partecipanti missione',
    mission,
    participants
  });
});

/* =========================
   SBLOCCO MISSIONE SEGRETA DA QR CODE
========================= */

router.get('/missions/unlock/:code', requireAuth, (req, res) => {
  const unlockCode = req.params.code;
  const mission = missionRepository.findByUnlockCode(unlockCode);

  if (!mission) {
    req.session.error = 'Missione segreta non trovata.';
    return res.redirect('/missions');
  }

  if (mission.status !== 'open') {
    req.session.error = 'Questa missione non è più disponibile.';
    return res.redirect('/missions');
  }

  if (!mission.is_hidden) {
    req.session.error = 'Questa missione non è segreta.';
    return res.redirect(`/missions/${mission.id}`);
  }

  if (mission.creator_id === req.session.user.id) {
    req.session.error = 'Hai creato tu questa missione, quindi non puoi sbloccarla.';
    return res.redirect(`/missions/${mission.id}`);
  }

  const existingParticipation = participationRepository.findByMissionAndUser(
    mission.id,
    req.session.user.id
  );

  if (existingParticipation) {
    req.session.success = 'Missione già presente tra le tue partecipazioni.';
    return res.redirect('/dashboard/my-participations');
  }

  participationRepository.create({
    missionId: mission.id,
    userId: req.session.user.id
  });

  req.session.success = 'Missione segreta sbloccata correttamente.';
  res.redirect('/dashboard/my-participations');
});

/* =========================
   DETTAGLIO MISSIONE
   Deve stare DOPO le rotte specifiche
========================= */

router.get('/missions/:id', (req, res) => {
  const mission = missionRepository.findById(req.params.id);

  if (!mission) {
    req.session.error = 'Missione non trovata.';
    return res.redirect('/missions');
  }

  res.render('missions/detail', {
    title: mission.title,
    mission
  });
});

module.exports = router;
