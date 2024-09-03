const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Verifica que el tipo MIME del archivo sea una imagen.
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false);
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
};

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: limits 
});

module.exports = upload;
