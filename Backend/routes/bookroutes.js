const express = require('express');
const router = express.Router();
const Book = require('../models/Additem'); // Adjust path to your 'Additem.js' model file

// GET all books
router.get('/item', async (req, res) => {
    try {
        const books = await Book.find(); // fetch all books from 'books' collection
        res.json(books); // send to frontend
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
