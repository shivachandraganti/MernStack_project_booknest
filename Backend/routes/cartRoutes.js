const express = require('express');
const router = express.Router();
const Cart = require('../db/Cart');
const auth = require('../middleware/auth');

// Add to cart
router.post('/add', auth, async (req, res) => {
  const { bookId } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [{ book: bookId }] });
    } else {
      const item = cart.items.find(i => i.book.toString() === bookId);
      if (item) item.quantity += 1;
      else cart.items.push({ book: bookId });
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).send('Server error');
  }
});
module.exports=router;