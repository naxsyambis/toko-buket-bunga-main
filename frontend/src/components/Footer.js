import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section about">
          <h2 className="footer-logo">FLORYN.</h2>
          <p>
            Toko buket bunga terbaik dengan aneka pilihan bunga segar untuk setiap momen spesial Anda. Kualitas dan kepuasan pelanggan adalah prioritas kami.
          </p>
        </div>
        
        <div className="footer-section contact">
          <h3>Hubungi Kami</h3>
          <p><i className="fas fa-map-marker-alt"></i> Jl. Kenangan No. 123, Bantul, Yogyakarta</p>
          <p><i className="fas fa-phone"></i> (021) 123-4567</p>
          <p><i className="fas fa-envelope"></i> support@floryn.com</p>
        </div>
        <div className="footer-section social">
          <h3>Ikuti Kami</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 FLORYN. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;