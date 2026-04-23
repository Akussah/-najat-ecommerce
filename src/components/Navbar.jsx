import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import siteLogo from '../assets/Logo.jpg';
import { useCart } from '../context/CartContext';

const Navbar = ({ currentUser, onSignOut }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();

  const isActive = (path) => location.pathname === path;

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMobile}>
          <img src={siteLogo} alt="ALHAMD ASHINO logo" className="nav-logo-image" />
          <span>ALHAMD ASHINO</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/shop" className={`nav-link ${isActive('/shop') ? 'active' : ''}`}>
            Shop
          </Link>
          <Link to="/consult" className={`nav-link ${isActive('/consult') ? 'active' : ''}`}>
            Consult
          </Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
            Contact
          </Link>
          <Link to="/cart" className={`nav-link ${isActive('/cart') ? 'active' : ''}`}>
            Cart
          </Link>
        </nav>

        <div className="nav-actions">
          <Link to="/cart" className="cart-button">
            Cart
            <span className="cart-count">{cartCount}</span>
          </Link>

          {currentUser ? (
            <>
              <span className="user-pill">{currentUser.name}</span>
              <button type="button" className="btn btn-secondary" onClick={onSignOut}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="btn btn-secondary">
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <Link to="/" onClick={closeMobile}>Home</Link>
        <Link to="/shop" onClick={closeMobile}>Shop</Link>
        <Link to="/consult" onClick={closeMobile}>Consult</Link>
        <Link to="/contact" onClick={closeMobile}>Contact</Link>
        <Link to="/cart" onClick={closeMobile}>Cart ({cartCount})</Link>
        <Link to="/checkout" onClick={closeMobile}>Checkout</Link>
        {currentUser ? (
          <button type="button" className="mobile-signout" onClick={() => { onSignOut(); closeMobile(); }}>
            Sign Out
          </button>
        ) : (
          <>
            <Link to="/signin" onClick={closeMobile}>Sign In</Link>
            <Link to="/signup" onClick={closeMobile}>Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
