const path = require('path');
const multer = require('multer');

const proofStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads/proofs'));
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    cb(null, uniqueName);
  }
});

function imageFileFilter(req, file, cb) {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const extension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return cb(new Error('Formato immagine non valido. Sono consentiti JPG, JPEG, PNG e WEBP.'));
  }

  cb(null, true);
}

const uploadProofImage = multer({
  storage: proofStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024
  }
});

module.exports = {
  uploadProofImage
};
