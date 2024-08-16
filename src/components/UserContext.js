import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from localStorage if available
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [totalPrice, setTotalPrice] = useState(0); // Add total price state

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Save user to localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Remove user from localStorage
  };

  const updateTotalPrice = (price) => {
    setTotalPrice(price); // Update total price
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // Load user from localStorage on initial render
    }
  }, []);

  const[order,setOrder]=useState([]);

  return (
    <UserContext.Provider value={{ user, login, logout, totalPrice, updateTotalPrice,order,setOrder }}>
      {children}
    </UserContext.Provider>
  );
};
