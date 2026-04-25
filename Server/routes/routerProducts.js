// Server/routes/routerProducts.js
const express = require('express');
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  deleteProductImage  
  
} = require('../controllers/productController');
const { uploadSingle, uploadMultiple } = require('../middleware/upload');

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:id', getProductById);

router.post('/products', uploadMultiple, createProduct);
router.put('/products/:id', uploadMultiple, updateProduct);
router.delete('/products/:id', deleteProduct);
router.delete('/products/:productId/images/:imageId', deleteProductImage); // 🔥 Eliminar imagen específica

module.exports = router;