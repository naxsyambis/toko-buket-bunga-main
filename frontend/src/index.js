import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // <-- Import CartProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider> {/* <-- Bungkus App dengan CartProvider */}
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);