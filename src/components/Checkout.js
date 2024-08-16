import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from './UserContext';
import './Checkout.css';

const Checkout = () => {
  const { totalPrice } = useUser();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { products = [] } = location.state || {};
  const { order } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!address || !city || !postalCode || !country) {
      alert('Please fill in all fields');
      return;
    }

    // Handle order submission and payment
    if (window.Razorpay) {
      const options = {
        key: "rzp_test_xtFnbnQ0oQ9B1o", // Replace with your Razorpay key
        amount: totalPrice * 100, // Amount in paise
        currency: "INR",
        name: "Your Company Name",
        description: "Order Description",
        handler: async function (response) {
          console.log(response);
          navigate('/order', { state: { order } });

          // Save order details to localStorage
          const newOrder = {
            address,
            city,
            postalCode,
            country,
            products,
            totalAmount: totalPrice,
            paymentId: response.razorpay_payment_id,
            date: new Date().toISOString()
          };

          // Save the order to localStorage
          const orders = JSON.parse(localStorage.getItem('orders')) || [];
          localStorage.setItem('orders', JSON.stringify([...orders, newOrder]));

          // Clear the cart after checkout
          localStorage.removeItem('cartProducts');

          // Redirect to the Order page with order details
          navigate('/order', { state: { order: newOrder } });
        },
        prefill: {
          name: '', // You might want to get the user's name from context or another source
          email: '', // You might want to get the user's email from context or another source
          contact: '' // You might want to get the user's contact from context or another source
        },
        notes: {
          address: address
        },
        theme: {
          color: "#339989"
        }
      };
      const pay = new window.Razorpay(options);
      pay.open();
    } else {
      console.error("Razorpay SDK not loaded");
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <p className="checkout-total">Total: ${totalPrice}</p>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            id="postalCode"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="primary-button">Submit Order</button>
      </form>
    </div>
  );
};

export default Checkout;
