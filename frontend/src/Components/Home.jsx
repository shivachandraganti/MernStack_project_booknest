import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from "react-router-dom";
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <Navbar  className="N" bg="primary" variant="dark" expand="lg">
        <Container className='nav'>
          <Navbar.Brand as={Link} to='/' style={{ color: 'white', textDecoration: "none" }}>
            BookStore
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login" style={{ color: "white" }}>User</Nav.Link>
              <Nav.Link as={Link} to="/slogin" style={{ color: "white" }}>Seller</Nav.Link>
              <Nav.Link as={Link} to="/alogin" style={{ color: "white" }}>Admin</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className='k'>
        <h1>Welcome to BookStore 📚</h1>
        <p>Browse our books and enjoy reading!</p>
        <br></br>
        <p>please login or signup  to access books</p>
        <br></br>
      </div>
    </div>
  );
};

export default Home;