const express = require('express');
const router = express.Router();
const Wishlist = require('../db/Wishlist');
const auth = require('../middleware/auth');

// POST /wishlist/add
router.post('/add', auth, async (req, res) => {
  const { bookId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user.id,
        books: [bookId]
      });
    } else {
      if (!wishlist.books.includes(bookId)) {
        wishlist.books.push(bookId);
      }
    }

    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
