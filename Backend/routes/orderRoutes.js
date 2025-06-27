const express = require('express');
const router = express.Router();
const Order = require('../db/Order');
const auth = require('../middleware/auth');

// Place an order
router.post('/place', auth, async (req, res) => {
  const { books, totalPrice } = req.body;
  const newOrder = new Order({
    user: req.userId,
    books,
    totalPrice,
  });

  await newOrder.save();
  res.status(201).json({ message: 'Order placed' });
});

// Get orders for user
router.get('/', auth, async (req, res) => {
  const orders = await Order.find({ user: req.userId }).populate('books.book');
  res.json(orders);
});
module.exports = router;