import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUserMd } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  
  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <FaCalendarAlt className="navbar-icon" />
          <span>Raumbelegungsplan</span>
        </Link>
        
        <ul className="navbar-nav">
          <li className={`nav-item ${isActive('/') ? 'active' : ''}`}>
            <Link to="/" className="nav-link">Dashboard</Link>
          </li>
          <li className={`nav-item ${isActive('/locations') ? 'active' : ''}`}>
            <Link to="/locations" className="nav-link">
              <FaMapMarkerAlt className="nav-icon" />
              Standorte
            </Link>
          </li>
          <li className={`nav-item ${isActive('/therapists') ? 'active' : ''}`}>
            <Link to="/therapists" className="nav-link">
              <FaUserMd className="nav-icon" />
              Therapeuten
            </Link>
          </li>
          <li className={`nav-item ${isActive('/appointments') ? 'active' : ''}`}>
            <Link to="/appointments" className="nav-link">
              <FaCalendarAlt className="nav-icon" />
              Termine
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
