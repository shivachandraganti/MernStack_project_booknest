import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Unavbar from './Unavbar';
import Footer from '../Components/Footer';
import { Button } from 'react-bootstrap';
import './whole.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      axios.get(`http://localhost:4000/getorders/${user.id}`)
        .then(res => setOrders(res.data))
        .catch(err => console.log(err));
    }
  }, []);

 const handleCancelOrder = async (orderId) => {
  try {
    await axios.delete(`http://localhost:4000/userorderdelete/${orderId}`);
    const updatedOrders = orders.filter(order => order._id !== orderId);
    setOrders(updatedOrders);
    alert('Order cancelled!');
  } catch (error) {
    console.error('Error cancelling order:', error);
    alert('Failed to cancel order');
  }
};


  return (
    <div>
      <Unavbar />

      <h1 className="text-center">My Orders</h1>
      {orders.length === 0 ? (
        <h3 className='text-center'>No orders yet!</h3>
      ) : (
        <div className='r'>
          {orders.map((book, index) => (
            <div key={index} className="card" style={{ width: '18rem' }}>
              <img
                src={`http://localhost:4000/${book.itemImage}`}
                className="card-img-top"
                alt={book.booktitle}
              />
              <div className="card-body">
                <h5 className="card-title">{book.booktitle}</h5>
                <p className="card-text">Author: {book.bookauthor}</p>
                <p className="card-text">Genre: {book.bookgenre}</p>
                <p className="card-text">Price: ${book.totalamount}</p>
                <p className="card-text">Description: {book.description}</p>
                <Button
                  variant="danger"
                  onClick={() => handleCancelOrder(book._id)}
                  className="mt-2"
                >
                  Cancel Order
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyOrders;
