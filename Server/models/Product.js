const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type:String,
    required:true
  },
  pet:{
    type: String,
    required:true
  },
  category: {
    type: String,
    required: true,
    enum: ['alimentos', 'accesorios', 'higiene', 'indumentaria', 'colchonetas'],
  },
  age:{
    type:String,
    required: true
  },
  price: {
    type: String,
    required: true,
  },
   kg: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  condition:{
    type:String,
    required:true
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;