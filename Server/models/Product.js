// Server/models/Product.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  isMain: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  pet: { 
    type: String, 
    required: true,
    enum: ['Gato', 'Perro', 'Ambos', 'gato', 'perro', 'ambos']  
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Alimentos', 'Accesorios', 'Higiene', 'Indumentaria', 'Colchonetas', 'alimentos', 'accesorios', 'higiene', 'indumentaria', 'colchonetas']
  },
  age: { 
    type: String,
    required: true, 
    enum: ['Cachorro', 'Mini adulto', 'Adulto', 'Senior', 'Otro',, 'cachorro', 'mini adulto', 'adulto', 'senior', 'otro']
  },
  price: { type: Number, required: true },
  kg: { type: String, required: false },
  description: { type: String, required: true },
  condition: { 
    type: String, 
    required: true,
  },
  images: [imageSchema],
  imageUrl: { type: String, required: false },
  imagePublicId: { type: String, required: false }
}, {
  timestamps: true
});

// Middleware para convertir a minúsculas antes de guardar (opcional)
productSchema.pre('save', function(next) {
  if (this.pet) this.pet = this.pet.toLowerCase();
  if (this.category) this.category = this.category.toLowerCase();
  if (this.age) this.age = this.age.toLowerCase();
  if (this.condition) this.condition = this.condition.toLowerCase();
  
  const mainImage = this.images.find(img => img.isMain) || this.images[0];
  if (mainImage) {
    this.imageUrl = mainImage.url;
    this.imagePublicId = mainImage.publicId;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;