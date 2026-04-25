// controllers/productController.js
const ProductModel = require('../models/Product');
const { uploadToSupabase, deleteFromSupabase } = require('../middleware/supabaseUpload');

exports.getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { 
      name, brand, pet, category, age, price, description, kg, special 
    } = req.body;

    const requiredFields = ['name', 'brand', 'pet', 'category', 'age', 'price', 'description'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: `Campos requeridos faltantes: ${missingFields.join(', ')}` 
      });
    }

    const priceNumber = Number(price);
    if (isNaN(priceNumber)) {
      return res.status(400).json({ success: false, error: 'El precio debe ser un número válido' });
    }

    // 🔥 Subir múltiples imágenes a Supabase
    const images = [];
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const imageData = await uploadToSupabase(file);
        images.push({
          url: imageData.url,
          publicId: imageData.path,
          isMain: i === 0, // La primera imagen es la principal
          order: i
        });
      }
    }

    const productData = {
      name,
      brand,
      pet,
      category,
      age: String(age).toLowerCase(),
      price: priceNumber,
      description,
      kg: kg || null,
      images: images,
      imageUrl: images[0]?.url || null,
      imagePublicId: images[0]?.publicId || null
    };

    if (special && special.trim() !== '') {
      productData.special = special;
    }

    const newProduct = new ProductModel(productData);
    const result = await newProduct.save();
    
    res.status(201).json({ 
      success: true, 
      data: result,
      message: 'Producto creado exitosamente'
    });
    
  } catch (err) {
    console.error('Error al crear producto:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: errors.join(', ') });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

// Actualizar producto con múltiples imágenes
exports.updateProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    
    // 🔥 Si vienen nuevas imágenes, agregarlas
    if (req.files && req.files.length > 0) {
      const newImages = [];
      const currentImageCount = product.images.length;
      
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const imageData = await uploadToSupabase(file);
        newImages.push({
          url: imageData.url,
          publicId: imageData.path,
          isMain: currentImageCount === 0 && i === 0,
          order: currentImageCount + i
        });
      }
      
      product.images.push(...newImages);
      
      // Actualizar imagen principal si no había ninguna
      if (product.images.length > 0 && !product.imageUrl) {
        const mainImage = product.images.find(img => img.isMain) || product.images[0];
        product.imageUrl = mainImage.url;
        product.imagePublicId = mainImage.publicId;
      }
    }
    
    // Actualizar otros campos
    if (req.body.price) req.body.price = Number(req.body.price);
    if (req.body.age) req.body.age = req.body.age.toLowerCase();
    
    Object.assign(product, req.body);
    await product.save();
    
    res.json({ success: true, data: product, message: 'Producto actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar una imagen específica del producto
exports.deleteProductImage = async (req, res) => {
  try {
    const { productId, imageId } = req.params;
    const product = await ProductModel.findById(productId);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    
    const imageToDelete = product.images.id(imageId);
    if (!imageToDelete) {
      return res.status(404).json({ success: false, message: 'Imagen no encontrada' });
    }
    
    // Eliminar de Supabase
    await deleteFromSupabase(imageToDelete.publicId);
    
    // Eliminar del array
    imageToDelete.deleteOne();
    
    // Reordenar imágenes restantes
    product.images.forEach((img, idx) => {
      img.order = idx;
    });
    
    // Actualizar imagen principal si es necesario
    if (imageToDelete.isMain && product.images.length > 0) {
      product.images[0].isMain = true;
      product.imageUrl = product.images[0].url;
      product.imagePublicId = product.images[0].publicId;
    }
    
    await product.save();
    
    res.json({ success: true, message: 'Imagen eliminada', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    
    // Eliminar imagen de Supabase
    if (product.imagePublicId) {
      await deleteFromSupabase(product.imagePublicId);
    }
    
    await ProductModel.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};