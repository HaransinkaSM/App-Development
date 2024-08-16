import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import './Cart.css';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';

const sizes = ['S', 'M', 'L', 'XL']; // Define available sizes

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [customizationDetails, setCustomizationDetails] = useState('');
  const [selectedSizes, setSelectedSizes] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const { user, updateTotalPrice, setOrder } = useUser(); // Ensure `setOrder` is available
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/cart/items', {
          params: { userId: user.id }
        });

        const cartData = response.data;
        const productRequests = Object.keys(cartData).map(async (productId) => {
          const productResponse = await axios.get(`http://localhost:8080/api/products/${productId}`);
          return {
            product: productResponse.data,
            quantity: cartData[productId]
          };
        });

        const resolvedProducts = await Promise.all(productRequests);
        setCartItems(resolvedProducts);

        // Load saved customizations
        const savedCustomizations = JSON.parse(localStorage.getItem('customizations')) || '';
        setCustomizationDetails(savedCustomizations);

      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    if (user) {
      fetchCartItems();
    }
  }, [user]);

  const handleRemoveItem = async (productId) => {
    try {
      await axios.post('http://localhost:8080/api/cart/remove', null, {
        params: { 
          userId: user.id, 
          productId: productId 
        }
      });
      setCartItems(cartItems.filter(item => item.product.id !== productId));

      // Remove item customizations
      const updatedCustomizations = JSON.parse(localStorage.getItem('customizations')) || '';
      localStorage.setItem('customizations', JSON.stringify(updatedCustomizations));

    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  const handleCustomizationChange = (event) => {
    setCustomizationDetails(event.target.value);
  };

  const saveAllCustomizations = () => {
    localStorage.setItem('customizations', JSON.stringify(customizationDetails));
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizes(prevSizes => ({
      ...prevSizes,
      [productId]: size
    }));
  };

  const calculateTotal = () => {
    const total = cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0).toFixed(2);

    updateTotalPrice(total);
    return total;
  };

  const openModal = () => {
    const details = {
      date: new Date(),
      products: cartItems.map(item => ({
        name: item.product.name,
        imageUrl: item.product.imageUrl,
        quantity: item.quantity,
        price: item.product.price,
        customization: customizationDetails,
        size: selectedSizes[item.product.id] || 'Not Selected'
      })),
      totalAmount: calculateTotal(),
      address,
      city,
      postalCode,
      country
    };

    setOrder(details);
    setIsModalOpen(true);
  };

  const sendEmail = (templateId, templateParams) => {
    emailjs.send('service_x35i82a', templateId, templateParams, 'gznZFvD3y4wD79rAX')
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
      }, (error) => {
        console.error('Failed to send email:', error);
        alert('Failed to send email');
      });
  };

  const handleCheckout = async () => {
    if (!address || !city || !postalCode || !country) {
      alert('Please fill in all address details');
      return;
    }

    const orderDetails = {
      date: new Date(),
      products: cartItems.map(item => ({
        name: item.product.name,
        imageUrl: item.product.imageUrl,
        quantity: item.quantity,
        price: item.product.price,
        customization: customizationDetails,
        size: selectedSizes[item.product.id] || 'Not Selected'
      })),
      totalAmount: calculateTotal(),
      address,
      city,
      postalCode,
      country
    };

    try {
      await axios.delete('http://localhost:8080/api/cart/clear', {
        params: { userId: user.id }
      });

      sendEmail('template_cd5wh8i', {
        customization: customizationDetails,
        orderDetails: JSON.stringify(orderDetails)
      });

      if (window.Razorpay) {
        const options = {
          key: "rzp_test_xtFnbnQ0oQ9B1o", // Replace with your Razorpay key
          amount: orderDetails.totalAmount * 100, // Amount in paise
          currency: "INR",
          name: "Your Company Name",
          description: "Order Description",
          handler: async function (response) {
            const newOrder = {
              ...orderDetails,
              paymentId: response.razorpay_payment_id,
              date: new Date().toISOString()
            };
            
            // Save order details to localStorage
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            localStorage.setItem('orders', JSON.stringify([...orders, newOrder]));
            
            // Redirect to the Order page with order details
            navigate('/order', { state: { order: newOrder } });
            setCartItems([]);
          },
          prefill: {
            name: user.name || '',
            email: user.email || '',
            contact: user.contact || ''
          },
          notes: {
            address: orderDetails.address
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
      
    } catch (error) {
      console.error('Error clearing the cart:', error);
    }
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.product.id} className="cart-item">
              <img src={item.product.imageUrl} alt={item.product.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h2 className="cart-item-name">{item.product.name}</h2>
                <p className="cart-item-price">${item.product.price.toFixed(2)}</p>
                <p className="cart-item-quantity">Quantity: {item.quantity}</p>

                <div className="size-selection">
                  <p>Select Size:</p>
                  {sizes.map(size => (
                    <button
                      key={size}
                      className={`size-button ${selectedSizes[item.product.id] === size ? 'selected' : ''}`}
                      onClick={() => handleSizeChange(item.product.id, size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <p 
                  onClick={() => handleRemoveItem(item.product.id)} 
                  className="remove-item-text"
                >
                  Remove
                </p>
              </div>
            </div>
          ))}
          <textarea
            placeholder="Enter customization details for your order"
            value={customizationDetails}
            onChange={handleCustomizationChange}
            className="customize-input"
          />
          <button 
            onClick={saveAllCustomizations} 
            className="save-customization-button"
          >
            Save Customization
          </button>

          <div className="cart-total">
            <h2>Total: ${calculateTotal()}</h2>
            <button 
              onClick={openModal} 
              className="checkout-button"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
      
      {/* Modal for Checkout */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Enter Address Details</h2>
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="address-input"
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="address-input"
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="address-input"
            />
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="address-input"
            />
            <button onClick={handleCheckout} className="pay-button">
              Pay Now
            </button>
            <button onClick={() => setIsModalOpen(false)} className="close-modal">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
