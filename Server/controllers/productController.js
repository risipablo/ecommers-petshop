
const ProductModel = require('../models/Product')


exports.getProducts = async (req,res) => {
  try{
    const products = await ProductModel.find()
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// obtener producto por ID
exports.getProductId = async (req,res) => {
  try{
    const product = await ProductModel.findById(req.params.id)
    if(!product) {
      return res.status(404).json({message: 'Producto no encontrado'})
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({message: 'Error del servidor'})
  }
}


// CRUD para el admin de la pagina

exports.addProduct = async (req, res) => {
  try {
    // Verificar si req.body existe
    if (!req.body) {
      return res.status(400).json({ error: "Cuerpo de la solicitud vacío" });
    }

    const { name, brand, pet, category, age, price, description, condition } = req.body;

    console.log('Datos recibidos:', req.body);

    if (!name || !brand || !pet || !category || !age || !price || !description || !condition) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const newProduct = new ProductModel({
      name, brand, pet, category, age, price, description, condition
    });

    const result = await newProduct.save();
    res.json(result);
  } catch (err) {
    console.log('Error al guardar:', err);
    res.status(500).json({ error: err.message });
  }
}