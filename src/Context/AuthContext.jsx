import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Check for a 'token' in localStorage on initial load
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const login = (token) => {
    // Save the token and update the state
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Remove the token and update the state
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Good practice to clear role too
    setIsAuthenticated(false);
  };

  // Provide the state and functions globally
  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
};

// Custom hook to easily use the auth context
export const useAuth = () => useContext(AuthContext);
