import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Unavbar from './Unavbar';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';

const Uhome = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:4000/item')
      .then((response) => setItems(response.data))
      .catch((error) => console.error('Error fetching books:', error));
  }, []);

  const handleAddToCart = (bookId) => {
    console.log("Book added to cart:", bookId);
    navigate('/ucart');
  };

  const handleAddToWishlist = (bookId) => {
    console.log("Book added to wishlist:", bookId);
    navigate('/uwishlist');
  };

  // NEW: Buy button
  const handleBuyNow = async (book) => {
  try {
    const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user info

    const orderData = {
      flatno: "N/A",
      pincode: "000000",
      city: "N/A",
      state: "N/A",
      totalamount: book.price,

      // ✅ Add seller info from book
      seller: book.userName,
      sellerId: book.userId,

      booktitle: book.title,
      bookauthor: book.author,
      bookgenre: book.genre,
      itemImage: book.itemImage,
      description: book.description,

      userId: user.id,
      userName: user.name
    };

    await axios.post("http://localhost:4000/userorder", orderData);
    alert("✅ Order placed successfully!");
    navigate("/myorders");
  } catch (error) {
    console.error("❌ Order failed:", error);
    alert("Order failed. Try again.");
  }
};


  return (
    <div>
      <Unavbar />
      <div>
        <h1 className='text-center' style={{ fontSize: '50px' }}>Best Seller</h1>
        <div className="container mx-auto p-8">
          {items.length === 0 ? (
            <h3 className='text-center'>No books available.</h3>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <Card key={item._id} style={{ width: '18rem', margin: '20px auto' }}>
                  <Card.Img 
                    variant="top" 
                    src={`http://localhost:4000/${item.itemImage}`} 
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title className='text-center'>{item.title}</Card.Title>
                    <p className='text-center'>Author: {item.author}</p>
                    <p className='text-center'>Price: ${item.price}</p>
                    <div className='d-flex justify-content-between'>
                      <Button variant="primary" onClick={() => handleAddToCart(item._id)}>Add to Cart</Button>
                      <Button variant="success" onClick={() => handleAddToWishlist(item._id)}>Wishlist</Button>
                      <Button variant="warning" onClick={() => handleBuyNow(item)}>Buy</Button> {/* Pass whole item */}
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Uhome;
