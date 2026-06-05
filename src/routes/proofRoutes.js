const express = require('express');
const { requireAuth } = require('../middleware/auth');
const db = require('../db/connection');

const participationRepository = require('../repositories/participationRepository');
const proofRepository = require('../repositories/proofRepository');
const userRepository = require('../repositories/userRepository');
const missionRepository = require('../repositories/missionRepository');
const badgeRepository = require('../repositories/badgeRepository');
const { uploadProofImage } = require('../middleware/upload');

const router = express.Router();

/* =========================
   FORM INVIO PROVA
========================= */

router.get('/participations/:id/proof', requireAuth, (req, res) => {
  const participationId = Number(req.params.id);
  const participation = participationRepository.findById(participationId);

  if (!participation) {
    req.session.error = 'Partecipazione non trovata.';
    return res.redirect('/dashboard/my-participations');
  }

  if (participation.user_id !== req.session.user.id) {
    req.session.error = 'Non puoi inviare una prova per questa missione.';
    return res.redirect('/dashboard/my-participations');
  }

  if (participation.status !== 'accepted') {
    req.session.error = 'La prova è già stata inviata oppure la missione non è più modificabile.';
    return res.redirect('/dashboard/my-participations');
  }

  res.render('proofs/create', {
    title: 'Invia prova',
    participation
  });
});

/* =========================
   SALVATAGGIO PROVA
========================= */

router.post(
  '/participations/:id/proof',
  requireAuth,
  uploadProofImage.single('image'),
  (req, res) => {
    const participationId = Number(req.params.id);
    const text = String(req.body.text || '').trim();

    const participation = participationRepository.findById(participationId);

    if (!participation) {
      req.session.error = 'Partecipazione non trovata.';
      return res.redirect('/dashboard/my-participations');
    }

    if (participation.user_id !== req.session.user.id) {
      req.session.error = 'Non puoi inviare una prova per questa missione.';
      return res.redirect('/dashboard/my-participations');
    }

    if (participation.status !== 'accepted') {
      req.session.error = 'La prova è già stata inviata oppure la missione non è più modificabile.';
      return res.redirect('/dashboard/my-participations');
    }

    if (!text || text.length < 10 || text.length > 1000) {
      req.session.error = 'La prova deve contenere tra 10 e 1000 caratteri.';
      return res.redirect(`/participations/${participationId}/proof`);
    }

    const imagePath = req.file ? `/uploads/proofs/${req.file.filename}` : null;

    proofRepository.create({
      participationId,
      text,
      imagePath
    });

    participationRepository.updateStatus(participationId, 'submitted');

    req.session.success = 'Prova inviata correttamente. Ora è in attesa di verifica.';
    res.redirect('/dashboard/my-participations');
  }
);

/* =========================
   APPROVAZIONE PROVA
========================= */

router.post('/proofs/:id/approve', requireAuth, (req, res) => {
  const proofId = Number(req.params.id);
  const proof = proofRepository.findById(proofId);

  if (!proof) {
    req.session.error = 'Prova non trovata.';
    return res.redirect('/dashboard/my-missions');
  }

  const participation = participationRepository.findById(proof.participation_id);

  if (!participation) {
    req.session.error = 'Partecipazione non trovata.';
    return res.redirect('/dashboard/my-missions');
  }

  const mission = missionRepository.findById(participation.mission_id);

  if (!mission) {
    req.session.error = 'Missione non trovata.';
    return res.redirect('/dashboard/my-missions');
  }

  if (mission.creator_id !== req.session.user.id) {
    req.session.error = 'Non puoi verificare una prova di una missione non tua.';
    return res.redirect('/dashboard/my-missions');
  }

  if (proof.status !== 'pending' || participation.status !== 'submitted') {
    req.session.error = 'Questa prova è già stata verificata.';
    return res.redirect('/dashboard/my-missions');
  }

  const approveTransaction = db.transaction(() => {
    proofRepository.updateStatus(proof.id, 'approved', 'Prova approvata.');
    participationRepository.updateStatus(participation.id, 'approved');
    userRepository.addPoints(participation.user_id, mission.points);
    badgeRepository.assignEligibleBadges(participation.user_id);
  });

  approveTransaction();

  req.session.success = 'Prova approvata. I punti sono stati assegnati.';
  res.redirect('/dashboard/my-missions');
});

/* =========================
   RIFIUTO PROVA
========================= */

router.post('/proofs/:id/reject', requireAuth, (req, res) => {
  const proofId = Number(req.params.id);
  const proof = proofRepository.findById(proofId);

  if (!proof) {
    req.session.error = 'Prova non trovata.';
    return res.redirect('/dashboard/my-missions');
  }

  const participation = participationRepository.findById(proof.participation_id);

  if (!participation) {
    req.session.error = 'Partecipazione non trovata.';
    return res.redirect('/dashboard/my-missions');
  }

  const mission = missionRepository.findById(participation.mission_id);

  if (!mission) {
    req.session.error = 'Missione non trovata.';
    return res.redirect('/dashboard/my-missions');
  }

  if (mission.creator_id !== req.session.user.id) {
    req.session.error = 'Non puoi verificare una prova di una missione non tua.';
    return res.redirect('/dashboard/my-missions');
  }

  if (proof.status !== 'pending' || participation.status !== 'submitted') {
    req.session.error = 'Questa prova è già stata verificata.';
    return res.redirect('/dashboard/my-missions');
  }

  const rejectTransaction = db.transaction(() => {
    proofRepository.updateStatus(proof.id, 'rejected', 'Prova rifiutata.');
    participationRepository.updateStatus(participation.id, 'rejected');
  });

  rejectTransaction();

  req.session.success = 'Prova rifiutata correttamente.';
  res.redirect('/dashboard/my-missions');
});

router.use((err, req, res, next) => {
  if (err) {
    req.session.error = err.message || 'Errore durante il caricamento del file.';
    return res.redirect('back');
  }

  next();
});

module.exports = router;
