import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useUser } from './UserContext';

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <nav className="navbar">
      <div className="nav-right">
        <span>METRO</span>
      </div>
      <div className="nav-left">
        <Link to="/">Home</Link>
        <Link to="/product">Products</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/order">Order</Link>
        {user ? (
          <>
            <span>Welcome, {user.username}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/signin">Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
