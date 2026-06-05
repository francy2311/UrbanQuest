const express = require('express');
const userRepository = require('../repositories/userRepository');

const router = express.Router();

router.get('/leaderboard', (req, res) => {
  const users = userRepository.findLeaderboard();

  res.render('leaderboard', {
    title: 'Classifica',
    users
  });
});

module.exports = router;
