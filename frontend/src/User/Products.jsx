import React, { useState, useEffect } from 'react';
import Unavbar from './Unavbar';
import { Button, Card } from 'react-bootstrap';
import Footer from '../Components/Footer';
import axios from 'axios';

const Ucart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      axios
        .get(`http://localhost:4000/cart/${user.id}`)  // ✅ Fetch cart by user id
        .then((response) => {
          setCartItems(response.data);
        })
        .catch((error) => {
          console.error('Error fetching cart items: ', error);
        });
    } else {
      console.log('User not logged in');
    }
  }, []);

  const removeFromCart = async (itemId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
      await axios.post('http://localhost:4000/cart/remove', {
        userId: user.id,
        itemId: itemId
      });

      // Refresh cart
      const res = await axios.get(`http://localhost:4000/cart/${user.id}`);
      setCartItems(res.data);
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };
  return (
    <div>
      <Unavbar />
      
        <h1 className="text-center">Your Cart</h1>
        {cartItems.length === 0 ? (
          <h3 className='text-center'>Your cart is empty!</h3>
        ) : (
          <div className="d-flex flex-wrap justify-content-center">
            {cartItems.map((item) => (
              <Card key={item._id} style={{ width: '18rem', margin: '10px' }}>
                <Card.Img 
                  variant="top" 
                  src={`http://localhost:4000/${item.itemImage}`} 
                  style={{ height: '250px', objectFit: 'cover' }} 
                />
                <Card.Body>
                  <Card.Title className='text-center'>{item.title}</Card.Title>
                  <p className='text-center'>Author: {item.author}</p>
                  <p className='text-center'>Price: ${item.price}</p>
                  <div className='d-flex justify-content-center'>
                    <Button 
                      variant="danger" 
                      onClick={() => removeFromCart(item.itemId)}
                    >
                      Remove from Cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      
      <Footer />
    </div>
  );
};

export default Ucart;
