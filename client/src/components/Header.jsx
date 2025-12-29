// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setIsMenuOpen(false); // This already closes the menu
    navigate('/');
    window.location.reload();
  };

  // This closes the menu if you click outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.header-user-menu')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="app-header">
      <div className="header-content">
        
        {/* === LEFT: LOGO === */}
        <Link to="/" className="header-logo" onClick={() => setIsMenuOpen(false)}>
          <svg viewBox="0 0 1000 1000" fill="#FF385C" width="32" height="32" style={{ display: 'block' }}>
            <path d="M499.3 712.5c-103 0-204.8-22.1-291.6-63.1-85.3-39.1-155.6-96.1-200.3-163.7-27.9-42.3-43.9-89.9-43.9-140.2 0-142.9 88.5-274.5 220.4-338.4C294.5 1.9 417.9-16.1 539.3 18.5c120.3 34.3 218.7 114.2 270.5 223.4 51.5 108.5 44.5 238-19.1 340.5-51.2 82.5-126.2 144.3-211.3 176.6-43.4 16.5-88.5 24.8-132.3 24.8-15.6 0-31.3-1.6-46.8-4.8z M500 125.1c-164.8 0-298.6 133.8-298.6 298.6S335.2 722.3 500 722.3c164.8 0 298.6-133.8 298.6-298.6S664.8 125.1 500 125.1z"></path>
          </svg>
          <span className="logo-text">airbnb</span>
        </Link>

        {/* === CENTER: SEARCH BAR (UI only) === */}
        <div className="header-search">
          <button className="search-btn"><span>Anywhere</span></button>
          <span className="search-divider"></span>
          <button className="search-btn"><span>Any week</span></button>
          <span className="search-divider"></span>
          <button className="search-btn text-gray">
            <span>Add guests</span>
            <span className="search-icon-bg">
              <svg viewBox="0 0 32 32" height="12" width="12" fill="currentColor">
                <path d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8.7 5.3a1 1 0 0 1-1.4 0l-4.2-4.2a1 1 0 0 1 1.4-1.4l4.2 4.2a1 1 0 0 1 0 1.4z"></path>
              </svg>
            </span>
          </button>
        </div>

        {/* === RIGHT: USER MENU === */}
        <nav className="header-nav">
          <Link to="/add-property" className="nav-link host-link">
            Add your home
          </Link>
          
          <div className="header-user-menu">
            <button className="user-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg viewBox="0 0 32 32" height="16" width="16" fill="currentColor" style={{ display: 'block' }}>
                <path d="M2 16A2 2 0 1 1 2 12 2 2 0 0 1 2 16zm14 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm14 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"></path>
              </svg>
              <svg viewBox="0 0 32 32" height="30" width="30" fill="gray" style={{ display: 'block' }}>
                <path d="M16 .7C7.5.7.7 7.5.7 16S7.5 31.3 16 31.3 31.3 24.5 31.3 16 31.3 7.5 16 .7zm0 28.1c-7 0-12.8-5.7-12.8-12.8S9 3.2 16 3.2s12.8 5.7 12.8 12.8-5.7 12.8-12.8 12.8zm-2.1-13.8c0-1.2 1-2.1 2.1-2.1s2.1 1 2.1 2.1v-.2c3.1 0 5.7 2.5 5.7 5.7v1.1H8.3v-1.1c0-3.1 2.5-5.7 5.7-5.7v.2z"></path>
              </svg>
            </button>

            {/* --- The Dropdown Menu --- */}
            {isMenuOpen && (
              <div className="user-dropdown">
                {userId ? (
                  // Logged-in links
                  <>
                    {/* --- THIS IS THE FIX --- */}
                    <Link to="/my-properties" className="dropdown-link" onClick={() => setIsMenuOpen(false)}>My Properties</Link>
                    <Link to="/" className="dropdown-link" onClick={() => setIsMenuOpen(false)}>Wishlists</Link>
                    <hr className="dropdown-divider" />
                    <button onClick={handleLogout} className="dropdown-link bold">
                      Logout
                    </button>
                  </>
                ) : (
                  // Logged-out links
                  <>
                    {/* --- THIS IS THE FIX --- */}
                    <Link to="/login" className="dropdown-link bold" onClick={() => setIsMenuOpen(false)}>Log in</Link>
                    <Link to="/register" className="dropdown-link" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
                    <hr className="dropdown-divider" />
                    <Link to="/add-property" className="dropdown-link" onClick={() => setIsMenuOpen(false)}>Add your home</Link>
                    <Link to="/" className="dropdown-link" onClick={() => setIsMenuOpen(false)}>Help</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
        
      </div>
    </header>
  );
}

export default Header;