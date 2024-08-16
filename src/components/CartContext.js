import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [price,setPrice]=useState('');
  const addToCart = (product, quantity, customization) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.product.id === product.id);
      if (existingItemIndex >= 0) {
        // Item already exists, update quantity and customization
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        updatedItems[existingItemIndex].customDescription = customization;
        return updatedItems;
      } else {
        // Item does not exist, add new item
        return [...prevItems, { product, quantity, customDescription: customization }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart,price,setPrice }}>
      {children}
    </CartContext.Provider>
  );
};
