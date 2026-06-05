const express = require('express');
const { requireAuth } = require('../middleware/auth');

const participationRepository = require('../repositories/participationRepository');
const proofRepository = require('../repositories/proofRepository');
const userRepository = require('../repositories/userRepository');
const badgeRepository = require('../repositories/badgeRepository');
const missionRepository = require('../repositories/missionRepository');

const router = express.Router();

router.get('/dashboard', requireAuth, (req, res) => {
  const user = userRepository.findById(req.session.user.id);
  const badges = badgeRepository.findUnlockedByUserId(req.session.user.id);

  req.session.user = user;

  res.render('dashboard/index', {
    title: 'Dashboard',
    user,
    badges
  });
});

router.get('/dashboard/my-participations', requireAuth, (req, res) => {
  const participations = participationRepository.findByUserId(req.session.user.id);

  res.render('dashboard/my-participations', {
    title: 'Missioni accettate',
    participations
  });
});

router.get('/dashboard/my-missions', requireAuth, (req, res) => {
  const createdMissions = missionRepository.findByCreatorId(req.session.user.id);
  const pendingProofs = proofRepository.findPendingByCreatorId(req.session.user.id);
  const reviewedProofs = proofRepository.findReviewedByCreatorId(req.session.user.id);

  res.render('dashboard/my-missions', {
    title: 'Missioni create',
    createdMissions,
    pendingProofs,
    reviewedProofs
  });
});

module.exports = router;
