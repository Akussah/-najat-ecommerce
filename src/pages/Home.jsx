import { Link } from 'react-router-dom';
import ProductList from '../components/ProductList';

const highlights = [
  {
    title: 'African craftsmanship',
    text: 'Handmade bead bags presented with a calmer, more modern visual language.'
  },
  {
    title: 'Special-order support',
    text: 'Consultations help with bridal requests, gifting, and custom planning.'
  }
];

function Home({ currentUser }) {
  return (
    <main className="page">
      <section className="hero-simple">
        <div className="container hero-shell">
          <div className="hero-copy">
            <p className="eyebrow">ALHAMD ASHINO</p>
            <h1 className="hero-title">African bead bag design presented with quiet confidence.</h1>
            <p className="hero-subtitle">
              Discover the world of ALHAMD ASHINO through craft, mood, and brand story here, then
              move into the shop when you are ready to browse the bags themselves.
            </p>

            <div className="tag-row">
              <span className="tag-pill">African bead bags</span>
              <span className="tag-pill">Quiet luxury mood</span>
              <span className="tag-pill">Custom consultations</span>
            </div>

            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary">
                Enter the Shop
              </Link>
              <Link to="/consult" className="btn btn-secondary">
                Book a Consultation
              </Link>
            </div>
          </div>

          <aside className="hero-panel">
            <h3>Brand focus</h3>
            <div className="metric-grid">
              <div className="metric-card">
                <strong>Craft-led</strong>
                <span>Beadwork shaped with patience, finish, and detail</span>
              </div>
              <div className="metric-card">
                <strong>Refined</strong>
                <span>A softer, more modern luxury experience</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container page-grid">
          {highlights.map((item, index) => (
            <article key={item.title} className="panel-card page-card">
              <p className="eyebrow">0{index + 1}</p>
              <h2 className="section-title">{item.title}</h2>
              <p className="section-subtitle">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Featured</p>
              <h2 className="section-title">Current products</h2>
              <p className="section-subtitle">A quick preview of the latest bead bags in the catalog.</p>
            </div>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-secondary">
                View Full Shop
              </Link>
            </div>
          </div>

          <ProductList currentUser={currentUser} limit={6} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.78)' }}>Next Step</p>
            <h2>The shop is where the bags and product browsing live.</h2>
            <p>
              Browse the collection in the shop, or use consultation when the order needs a more
              personal, bridal, or custom direction.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-secondary">
                Go to Shop
              </Link>
              <Link to="/consult" className="btn btn-secondary">
                Start Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
