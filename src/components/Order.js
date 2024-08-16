import React from 'react';
import './Order.css';
import { useUser } from './UserContext';

const Order = () => {
  const { order } = useUser(); // Retrieve order from user context

  return (
    <div className="order-container">
      <h1>Order Confirmation</h1>
      {order && order.products && order.products.length > 0 ? (
        <div className="order-details">
          <p><strong>Order Date:</strong> {new Date(order.date).toLocaleString()}</p>
          
          <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
          <h2>Cart Items</h2>
          <ul className="order-items-list">
            {order.products.map((product, index) => (
              <li key={index} className="order-item">
                <img src={product.imageUrl} alt={product.name} className="order-item-image" />
                <div className="order-item-details">
                  <p><strong>Product:</strong> {product.name}</p>
                  <p><strong>Quantity:</strong> {product.quantity}</p>
                  <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No orders available.</p>
      )}
    </div>
  );
};

export default Order;
