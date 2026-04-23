import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-grid">
        <div>
          <p className="footer-kicker">ALHAMD ASHINO</p>
          <h2>African bead bag design with a cleaner, more refined digital home.</h2>
          <p className="footer-copy">
            Explore ready-to-order bags, request custom work, and move through the brand with a
            calmer, more polished experience.
          </p>
          <p className="footer-copy">
            <strong>Email:</strong>{' '}
            <a href="mailto:Alhamdashino@gmail.com">Alhamdashino@gmail.com</a>
            <br />
            <strong>Phone:</strong>{' '}
            <a href="tel:+18622710875">862-271-0875</a>
          </p>
        </div>

        <div className="footer-links">
          <Link to="/shop">Shop</Link>
          <Link to="/consult">Consult</Link>
          <Link to="/commission">Commission</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
