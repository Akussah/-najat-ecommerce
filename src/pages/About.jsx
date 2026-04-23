import { Link } from 'react-router-dom';

const values = [
  {
    title: 'Craft first',
    text: 'Every product starts with beadwork quality, material choice, and wearability.'
  },
  {
    title: 'Modern presentation',
    text: 'We pair handmade detail with a clean, contemporary shopping experience.'
  },
  {
    title: 'Personal service',
    text: 'Consultations help customers shape custom ideas before they place an order.'
  }
];

function About() {
  return (
    <main className="page">
      <section className="hero-simple">
        <div className="container hero-shell">
          <div className="hero-copy">
            <p className="eyebrow">About</p>
            <h1 className="hero-title">A bead brand shaped by craftsmanship, clarity, and restraint.</h1>
            <p className="hero-subtitle">
              We make handmade bead pieces while keeping the customer experience simple, polished,
              and easy to navigate.
            </p>
            <div className="tag-row">
              <span className="tag-pill">Craft-led</span>
              <span className="tag-pill">Modern presentation</span>
            </div>
          </div>
          <aside className="hero-panel">
            <h3>What defines the brand</h3>
            <div className="metric-grid">
              <div className="metric-card">
                <strong>Handmade</strong>
                <span>Bead-focused products with artisan detail</span>
              </div>
              <div className="metric-card">
                <strong>Thoughtful</strong>
                <span>Simple guidance for custom and ready-made pieces</span>
              </div>
              <div className="metric-card">
                <strong>Flexible</strong>
                <span>Great for bridal, gifting, and event orders</span>
              </div>
              <div className="metric-card">
                <strong>Refined</strong>
                <span>A softer, more modern storefront experience</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container feature-grid">
          {values.map((item, index) => (
            <article key={item.title} className="feature-card">
              <div className="feature-icon">0{index + 1}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container page-grid">
          <article className="panel-card page-card">
            <p className="eyebrow">Our Approach</p>
            <h2 className="section-title">The store is designed to feel calm, clear, and premium.</h2>
            <p className="section-subtitle">
              Instead of overly busy pages, we focus on strong product presentation, soft surfaces,
              and direct paths to shopping, consulting, and checkout.
            </p>
          </article>

          <article className="panel-card page-card">
            <p className="eyebrow">Next Step</p>
            <h2 className="section-title">Browse or start a custom conversation.</h2>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary">Browse Shop</Link>
              <Link to="/consult" className="btn btn-secondary">Book Consult</Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

export default About;
