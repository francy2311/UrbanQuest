const express = require('express');
const QRCode = require('qrcode');
const missionRepository = require('../repositories/missionRepository');

const router = express.Router();

router.get('/missions/:id/qrcode', async (req, res) => {
  const missionId = Number(req.params.id);
  const mission = missionRepository.findById(missionId);

  if (!mission) {
    req.session.error = 'Missione non trovata.';
    return res.redirect('/missions');
  }

  try {
    const missionUrl = `${req.protocol}://${req.get('host')}/missions/${mission.id}`;

    const qrCodeDataUrl = await QRCode.toDataURL(missionUrl, {
      width: 320,
      margin: 2
    });

    res.render('missions/qrcode', {
      title: 'QR Code missione',
      mission,
      missionUrl,
      qrCodeDataUrl
    });
  } catch (error) {
    req.session.error = 'Errore durante la generazione del QR code.';
    res.redirect(`/missions/${mission.id}`);
  }
});

module.exports = router;
