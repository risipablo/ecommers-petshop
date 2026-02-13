const express = require('express')
const { getProducts, getProductId, addProduct } = require('../controllers/productController')
const router = express.Router()

router.get('/products', getProducts)
router.get('/products/:id', getProductId)

// Routes para el admin
router.post('/products', addProduct)

module.exports = router