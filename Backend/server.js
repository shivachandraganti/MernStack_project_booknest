const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcrypt');
require('./db/config');
const cartmodel = require('./db/Users/cart');
const Admin = require('./db/Admin/Admin');
const users = require('./db/Users/userschema');
const seller = require('./db/Seller/Sellers');
const books = require('./db/Seller/Additem'); // using books model here ✅
const myorders = require('./db/Users/myorders');
const WishlistItem = require('./db/Users/Wishlist');

const app = express();
const PORT = 4000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// 📦 Image Upload Handling
const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });
app.use('/uploads', express.static('uploads'));

// -------------------- USER AUTH --------------------

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) return res.json({ Status: 'Fail', message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await users.create({ name, email, password: hashedPassword });

    return res.json({ Status: 'Success', user: newUser });
  } catch (err) {
    return res.status(500).json({ Status: 'Error', error: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await users.findOne({ email });
    if (!user) return res.json({ Status: "Fail", message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ Status: "Fail", message: "Invalid password" });

    return res.json({
      Status: "Success",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    return res.status(500).json({ Status: "Error", error: err.message });
  }
});

// -------------------- ADMIN AUTH --------------------

app.post('/asignup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await Admin.findOne({ email });
    if (existing) return res.json('Already have an account');
    await Admin.create({ name, email, password });
    res.json('Account Created');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/alogin', async (req, res) => {
  const { email, password } = req.body;
  const user = await Admin.findOne({ email });
  if (!user || user.password !== password) return res.json('login fail');
  return res.json({ Status: 'Success', user: { id: user.id, name: user.name, email: user.email } });
});

// -------------------- SELLER AUTH --------------------

app.post('/ssignup', async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await seller.findOne({ email });
  if (existing) return res.json('Already have an account');
  try {
    await seller.create({ name, email, password });
    res.json('Account Created');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/slogin', async (req, res) => {
  const { email, password } = req.body;
  const user = await seller.findOne({ email });
  if (!user || user.password !== password) return res.json('login fail');
  return res.json({ Status: 'Success', user: { id: user.id, name: user.name, email: user.email } });
});

// -------------------- ITEM CRUD (Now called 'books' everywhere) --------------------

app.post('/items', upload.single('itemImage'), async (req, res) => {
  try {
    const { title, author, genre, description, price, userId, userName } = req.body;
    const item = await books.create({ // ✔️ changed to books.create
      itemImage: req.file.path,
      title, author, genre, description, price, userId, userName
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create item' });
  }
});

app.get('/getitem/:userId', async (req, res) => {
  try {
    const result = await books.find({ userId: req.params.userId }); // ✔️ changed to books.find
    res.json(result);
  } catch {
    res.sendStatus(500);
  }
});

app.delete('/itemdelete/:id', async (req, res) => {
  try {
    await books.findByIdAndDelete(req.params.id); // ✔️ changed to books
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

// -------------------- ORDERS --------------------

app.post('/userorder', async (req, res) => {
  try {
    console.log("📦 Order received:", req.body); // ADD THIS
    const order = await myorders.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    console.log("❌ Order error:", err);
    res.sendStatus(400);
  }
});


app.get('/getorders/:userId', async (req, res) => {
  try {
    const result = await myorders.find({ userId: req.params.userId });
    res.json(result);
  } catch {
    res.sendStatus(500);
  }
});

app.get('/getsellerorders/:userId', async (req, res) => {
  try {
    const result = await myorders.find({ sellerId: req.params.userId });
    res.json(result);
  } catch {
    res.sendStatus(500);
  }
});

app.get('/orders', async (req, res) => {
  try {
    const result = await myorders.find();
    res.json(result);
  } catch {
    res.sendStatus(500);
  }
});

// -------------------- WISHLIST --------------------

app.get('/wishlist/:userId', async (req, res) => {
  try {
    const result = await WishlistItem.find({ userId: req.params.userId });
    res.json(result);
  } catch {
    res.sendStatus(500);
  }
});

app.post('/wishlist/add', async (req, res) => {
  try {
   const exists = await WishlistItem.findOne({ userId: req.body.userId, itemId: req.body.itemId });

    if (exists) return res.status(400).json({ msg: 'Item already in wishlist' });

    const newItem = await WishlistItem.create(req.body);
    res.json(newItem);
  } catch {
    res.sendStatus(500);
  }
});

app.post('/wishlist/remove', async (req, res) => {
  try {
    await WishlistItem.findOneAndDelete({ itemId: req.body.itemId });
    res.json({ msg: 'Item removed from wishlist' });
  } catch {
    res.sendStatus(500);
  }
});

// -------------------- GET ALL BOOKS FOR HOME/PRODUCTS (IMPORTANT) --------------------

app.get('/item', async (req, res) => {
  try {
    const allBooks = await books.find(); // ✔️ using books.find
    res.json(allBooks);
  } catch {
    res.status(500).json({ message: 'Error fetching books' });
  }
});

// -------------------- USER/SELLER DELETE --------------------

app.delete('/userdelete/:id', async (req, res) => {
  try {
    await users.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

app.delete('/userorderdelete/:id', async (req, res) => {
  try {
    await myorders.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

app.delete('/useritemdelete/:id', async (req, res) => {
  try {
    await books.findByIdAndDelete(req.params.id); // ✔️ changed to books
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

app.delete('/sellerdelete/:id', async (req, res) => {
  try {
    await seller.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});


// Add to Cart
app.post('/cart/add', async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    // Prevent duplicates
    const exists = await cartmodel.findOne({ userId, itemId });
    if (exists) {
      return res.status(400).json({ msg: 'Item already in cart' });
    }

    const newItem = await cartmodel.create(req.body);
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Cart Items by userId
app.get('/cart/:userId', async (req, res) => {
  try {
    const items = await cartmodel.find({ userId: req.params.userId });
    res.json(items);
  } catch {
    res.sendStatus(500);
  }
});

// Remove from Cart
app.post('/cart/remove', async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const deletedItem = await cartmodel.findOneAndDelete({ userId, itemId });

    if (!deletedItem) {
      return res.status(404).json({ msg: 'Item not found in cart' });
    }

    res.json({ msg: 'Item removed from cart' });
  } catch (err) {
    console.error("Error removing item from cart:", err);
    res.sendStatus(500);
  }
});



// ✅ Get All Users (for Admin dashboard & users page)
app.get('/users', async (req, res) => {
  try {
    const allUsers = await users.find(); // users is your model
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ✅ Get All Sellers (for Admin dashboard & sellers page)
app.get('/sellers', async (req, res) => {
  try {
    const allSellers = await seller.find(); // seller is your model
    res.json(allSellers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sellers" });
  }
});

// -------------------- START SERVER --------------------

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
}); 
