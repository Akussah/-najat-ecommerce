import { Link } from 'react-router-dom';

const collectionGroups = [
  {
    title: 'Event Bags',
    text: 'Statement pieces for weddings, receptions, and special occasions.'
  },
  {
    title: 'Everyday Picks',
    text: 'Cleaner silhouettes that still carry handcrafted bead texture and detail.'
  },
  {
    title: 'Gift Sets',
    text: 'Curated combinations designed for celebrations, gifting, and premium presentation.'
  },
  {
    title: 'Custom Orders',
    text: 'Flexible pieces shaped around your colors, quantity, or event needs.'
  }
];

function Collections() {
  return (
    <main className="page">
      <section className="hero-simple">
        <div className="container hero-shell">
          <div className="hero-copy">
            <p className="eyebrow">Collections</p>
            <h1 className="hero-title">Organized collections for the way people actually shop.</h1>
            <p className="hero-subtitle">
              Browse by purpose, event, or order type instead of digging through overly complex
              layouts.
            </p>
          </div>
          <aside className="hero-panel">
            <h3>Best for</h3>
            <div className="metric-grid">
              <div className="metric-card">
                <strong>Bridal</strong>
                <span>Elegant event-ready designs</span>
              </div>
              <div className="metric-card">
                <strong>Gifting</strong>
                <span>Premium picks for special occasions</span>
              </div>
              <div className="metric-card">
                <strong>Bulk orders</strong>
                <span>Event and coordinated orders</span>
              </div>
              <div className="metric-card">
                <strong>Custom needs</strong>
                <span>Flexible design conversations</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container feature-grid">
          {collectionGroups.map((item, index) => (
            <article key={item.title} className="feature-card">
              <div className="feature-icon">0{index + 1}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.78)' }}>Need Help Choosing?</p>
            <h2>Use a consultation if you want help narrowing the right collection.</h2>
            <p>
              We can guide you based on style, budget, occasion, and timeline before you order.
            </p>
            <div className="hero-actions">
              <Link to="/consult" className="btn btn-secondary">Start Consultation</Link>
              <Link to="/shop" className="btn btn-secondary">Open Shop</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Collections;
