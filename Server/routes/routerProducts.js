// Server/routes/routerProducts.js
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

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/products', uploadMultiple, createProduct);
router.put('/products/:id', uploadMultiple, updateProduct);
router.delete('/products/:id', deleteProduct);
router.delete('/products/:productId/images/:imageId', deleteProductImage);
router.patch('/products/:productId/main-image/:imageId', setMainImage);

module.exports = router;