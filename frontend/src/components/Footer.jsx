import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">ShopEZ</Link>
          <p className="footer-tagline">Curated essentials for the modern lifestyle.</p>
        </div>

        <div className="footer-links">
          <div className="footer-section">
            <h4>Shop</h4>
            <Link to="/products">All Products</Link>
            <Link to="/products?category=beauty">Beauty</Link>
            <Link to="/products?category=furniture">Furniture</Link>
            <Link to="/products?category=mens-shirts">Men's Fashion</Link>
          </div>

          <div className="footer-section">
            <h4>Account</h4>
            <Link to="/profile">My Profile</Link>
            <Link to="/cart">Shopping Cart</Link>
            <Link to="/profile">Order History</Link>
          </div>

          <div className="footer-section">
            <h4>Help</h4>
            <Link to="/login">Log In</Link>
            <Link to="/register">Create Account</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">&copy; {currentYear} ShopEZ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
