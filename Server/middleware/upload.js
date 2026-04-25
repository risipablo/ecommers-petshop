// Server/middleware/upload.js
const multer = require('multer');

// Configuración para MemoryStorage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (JPEG, PNG, WEBP)'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB por imagen
  fileFilter: fileFilter
});

// 🔥 Para múltiples imágenes
const uploadMultiple = upload.array('images', 10); // máximo 10 imágenes

// Para una sola imagen (mantener compatibilidad)
const uploadSingle = upload.single('image');

module.exports = { uploadSingle, uploadMultiple };