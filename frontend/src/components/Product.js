import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext';
import { useUser } from './UserContext';
import './product.css';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState({});
  const { addToCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    if (user) {
      try {
        await axios.post('http://localhost:8080/api/cart/add', null, {
          params: {
            userId: user.id,
            productId: product.id,
            quantity: quantity[product.id] || 1,  // Default to 1 if no quantity set
          }
        });

        addToCart(product, quantity[product.id] || 1);
        setQuantity({ ...quantity, [product.id]: 1 }); // Reset quantity after adding to cart
      } catch (error) {
        console.error('Error adding product to cart:', error);
      }
    } else {
      navigate('/signin');
    }
  };

  const incrementQuantity = (productId) => {
    setQuantity({
      ...quantity,
      [productId]: (quantity[productId] || 1) + 1,
    });
  };

  const decrementQuantity = (productId) => {
    setQuantity({
      ...quantity,
      [productId]: Math.max((quantity[productId] || 1) - 1, 1), // Ensure quantity doesn't go below 1
    });
  };

  return (
    <div className="product-container">
      <h1>Products</h1>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <img src={product.imageUrl} alt={product.name} className="product-image" />
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <div className="action-container">
                <div className="quantity-container">
                  <button
                    className="quantity-button"
                    onClick={() => decrementQuantity(product.id)}
                  >
                    -
                  </button>
                  <span className="quantity-display">
                    {quantity[product.id] || 1}
                  </span>
                  <button
                    className="quantity-button"
                    onClick={() => incrementQuantity(product.id)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="add-to-cart-button"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Product;
