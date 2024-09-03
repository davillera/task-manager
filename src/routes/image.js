const express = require('express');
const router = express.Router();
const imageController = require('../controllers/image');
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/Multer');

router.use(authMiddleware);


// Crear y subir una imagen
router.post('/', upload.single('file'), (req, res, next) => {
  // Si hay un error en `multer`, este middleware lo capturará.
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or invalid file type' });
  }
  next();
}, imageController.uploadImage);

router.delete('/:id', imageController.deleteImage);

module.exports = router;
