const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: String,        // ✅ to link cart to user
  itemId: String,        // ID of the book/product
  title: String,
  author: String,
  price: Number,
  itemImage: String,
  quantity: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model('cartitems', CartSchema);
