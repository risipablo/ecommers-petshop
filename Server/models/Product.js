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
  pet: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['alimentos', 'accesorios', 'higiene', 'indumentaria', 'colchonetas']
  },
  age: { 
    type: String,
    required: true, 
    enum: ['cachorro', 'mini adulto', 'adulto', 'senior', 'otro']
  },
  price: { type: Number, required: true },
  special: {
    type: String, 
    required: false,  
    enum: ['derma adulto', 'derma mini adulto', 'urinary', 'castrado', 'light'],
    default: null     
  }, 
  kg: { type: String, required: false },
  description: { type: String, required: true },
  images: [imageSchema],
  imageUrl: { type: String, required: false }, 
  imagePublicId: { type: String, required: false } 
});

productSchema.pre('save', function(next) {
  const mainImage = this.images.find(img => img.isMain) || this.images[0];
  if (mainImage) {
    this.imageUrl = mainImage.url;
    this.imagePublicId = mainImage.publicId;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;