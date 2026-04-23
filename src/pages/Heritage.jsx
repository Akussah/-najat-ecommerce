import { Link } from 'react-router-dom';

const heritagePoints = [
  {
    title: 'Craftsmanship at the center',
    text: 'The brand story still begins with material detail, technique, and finish.'
  },
  {
    title: 'Made for modern customers',
    text: 'We keep the presentation current so the handmade work feels relevant and accessible.'
  },
  {
    title: 'Built for special moments',
    text: 'Many pieces are designed for celebrations, gift-giving, and meaningful events.'
  }
];

function Heritage() {
  return (
    <main className="page">
      <section className="hero-simple">
        <div className="container hero-shell">
          <div className="hero-copy">
            <p className="eyebrow">Heritage</p>
            <h1 className="hero-title">A softer modern look built on traditional beadwork values.</h1>
            <p className="hero-subtitle">
              Heritage here is not about heavy visuals. It is about keeping the craft visible while
              presenting it in a cleaner, more contemporary way.
            </p>
          </div>
          <aside className="hero-panel">
            <h3>What stays consistent</h3>
            <div className="metric-grid">
              <div className="metric-card">
                <strong>Detail</strong>
                <span>Careful bead selection and finishing</span>
              </div>
              <div className="metric-card">
                <strong>Purpose</strong>
                <span>Products designed for real occasions</span>
              </div>
              <div className="metric-card">
                <strong>Service</strong>
                <span>Direct help when custom work is needed</span>
              </div>
              <div className="metric-card">
                <strong>Presentation</strong>
                <span>A premium, calmer storefront experience</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container feature-grid">
          {heritagePoints.map((item, index) => (
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
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.78)' }}>Explore</p>
            <h2>See how that heritage shows up in the current collection.</h2>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-secondary">Browse Products</Link>
              <Link to="/collections" className="btn btn-secondary">View Collections</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Heritage;
