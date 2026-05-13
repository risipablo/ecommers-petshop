// Server/routes/routerProducts.js (actualizado)
const express = require('express');
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  deleteProductImage,
  setMainImage
} = require('../controllers/productController');
const { uploadMultiple } = require('../middleware/upload');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Rutas públicas
router.get('/products', getProducts);
router.get('/products/:id', getProductById);

// Rutas protegidas (solo admin)
router.post('/products', requireAdmin, uploadMultiple, createProduct);
router.put('/products/:id', requireAdmin, uploadMultiple, updateProduct);
router.delete('/products/:id', requireAdmin, deleteProduct);
router.delete('/products/:productId/images/:imageId', requireAdmin, deleteProductImage);
router.patch('/products/:productId/main-image/:imageId', requireAdmin, setMainImage);

module.exports = router;