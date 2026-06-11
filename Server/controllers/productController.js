// Server/controllers/productController.js (actualizado con todas las funciones)
const ProductModel = require('../models/Product');
const { uploadToSupabase, deleteFromSupabase } = require('../middleware/supabaseUpload');

// Obtener todos los productos
exports.getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Obtener producto por ID
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

// Crear producto (solo admin)
exports.createProduct = async (req, res) => {
  try {
    const { 
      name, brand, pet, category, age, price, description, condition, kg, stock, descuento,destacado
    } = req.body;

    console.log('📦 Datos recibidos:', { name, brand, pet, category, age, price, condition, kg, descuento, destacado });

    const requiredFields = ['name', 'brand', 'pet', 'category', 'age', 'price', 'description', 'condition'];
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

    const images = [];
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const imageData = await uploadToSupabase(file);
        images.push({
          url: imageData.url,
          publicId: imageData.path,
          isMain: i === 0,
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
      condition,
      stock: stock || null,
      descuento: descuento || null,
      kg: kg || null,
      destacado: destacado || 'false',
      images: images,
      imageUrl: images[0]?.url || null,
      imagePublicId: images[0]?.publicId || null
    };

    const newProduct = new ProductModel(productData);
    const result = await newProduct.save();
    
    console.log('✅ Producto creado:', result._id);
    
    res.status(201).json({ 
      success: true, 
      data: result,
      message: 'Producto creado exitosamente'
    });
    
  } catch (err) {
    console.error('❌ Error al crear producto:', err);
    
    if (err.name === 'ValidationError') {
      
      const validationErrors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ 
        success: false, 
        error: validationErrors.join(', ') 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Error interno del servidor'
    });
  }
};

// Actualizar producto completo (solo admin)
exports.updateProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    
    // Actualizar campos básicos
    const { name, brand, pet, category, age, price, description, condition, kg, stock, descuento, destacado } = req.body;
    
    if (name) product.name = name;
    if (brand) product.brand = brand;
    if (pet) product.pet = pet;
    if (category) product.category = category;
    if (age) product.age = String(age).toLowerCase();
    if (price) product.price = Number(price);
    if (description) product.description = description;
    if (condition) product.condition = condition;
    if (kg !== undefined) product.kg = kg || null;
    if (stock !== undefined) product.stock = stock || null;
    if (descuento !== undefined) product.descuento = descuento || null;
    if (destacado !== undefined) product.destacado = destacado;
    
    // Agregar nuevas imágenes
    if (req.files && req.files.length > 0) {
      const newImages = [];
      const currentImageCount = product.images.length;
      
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const imageData = await uploadToSupabase(file);
        newImages.push({
          url: imageData.url,
          publicId: imageData.path,
          isMain: currentImageCount === 0 && i === 0 && product.images.length === 0,
          order: currentImageCount + i
        });
      }
      
      product.images.push(...newImages);
      
      if (product.images.length > 0 && !product.imageUrl) {
        const mainImage = product.images.find(img => img.isMain) || product.images[0];
        product.imageUrl = mainImage.url;
        product.imagePublicId = mainImage.publicId;
      }
    }
    
    await product.save();
    
    res.json({ success: true, data: product, message: 'Producto actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar producto completo (solo admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    
    // Eliminar todas las imágenes de Supabase
    for (const image of product.images) {
      if (image.publicId) {
        await deleteFromSupabase(image.publicId);
      }
    }
    
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

// Eliminar una imagen específica (solo admin)
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
    } else if (product.images.length === 0) {
      product.imageUrl = null;
      product.imagePublicId = null;
    }
    
    await product.save();
    
    res.json({ success: true, message: 'Imagen eliminada', data: product });
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Establecer imagen principal (solo admin)
exports.setMainImage = async (req, res) => {
  try {
    const { productId, imageId } = req.params;
    const product = await ProductModel.findById(productId);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    
    // Resetear todas las imágenes a isMain false
    product.images.forEach(img => {
      img.isMain = img._id.toString() === imageId;
    });
    
    const mainImage = product.images.find(img => img.isMain);
    if (mainImage) {
      product.imageUrl = mainImage.url;
      product.imagePublicId = mainImage.publicId;
    }
    
    await product.save();
    
    res.json({ success: true, data: product, message: 'Imagen principal actualizada' });
  } catch (error) {
    console.error('Error al establecer imagen principal:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};