import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-branding">
            <h3>Therapie-Zentrum Berlin E.I.N.S.</h3>
            <p>Tucholskystr. 45, 10117 Berlin</p>
            <p>
              <a href="https://zentrum-eins.de" target="_blank" rel="noopener noreferrer">
                https://zentrum-eins.de
              </a>
            </p>
            <p>Telefon: +49 30 3993 7973</p>
          </div>
          <div className="footer-copyright">
            <p>&copy; {currentYear} Therapie-Zentrum Berlin E.I.N.S. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
