import { Link } from 'react-router-dom';
import ProductList from '../components/ProductList';

const shopNotes = [
  {
    title: 'Curated selection',
    text: 'A focused edit of ready-to-order bead bags, kept clear and easy to browse.'
  },
  {
    title: 'Occasion-led',
    text: 'Designed for evenings, gifting, bridal moments, and special-event styling.'
  }
];

function Shop({ currentUser }) {
  const isAdmin = Boolean(currentUser?.is_admin);

  return (
    <main className="page">
      <section className="hero-simple">
        <div className="container hero-shell">
          <div className="hero-copy">
            <p className="eyebrow">Shop</p>
            <h1 className="hero-title">A focused shop for the bags, the details, and the add-to-cart flow.</h1>
            <p className="hero-subtitle">
              This is the product space for ALHAMD ASHINO. Browse the current bead bag lineup, add
              pieces to cart, or move to consultation if you need something more tailored.
            </p>

            <div className="tag-row">
              <span className="tag-pill">Ready to order</span>
              <span className="tag-pill">Editorial catalog</span>
              <span className="tag-pill">Custom on request</span>
            </div>
          </div>
          <aside className="hero-panel">
            <h3>Shop guide</h3>
            <div className="metric-grid">
              <div className="metric-card">
                <strong>Ready now</strong>
                <span>Browse currently listed pieces</span>
              </div>
              <div className="metric-card">
                <strong>Custom later</strong>
                <span>Move to consultation for edits or event orders</span>
              </div>
              <div className="metric-card">
                <strong>Clear cart flow</strong>
                <span>Quick add-to-cart and checkout path</span>
              </div>
              <div className="metric-card">
                <strong>Flexible checkout</strong>
                <span>Card and MoMo supported</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container editorial-grid">
          <article className="panel-card editorial-card">
            <p className="eyebrow">Editor’s Note</p>
            <blockquote>
              A calmer shopping floor for statement bead bags, where each piece has space to feel considered.
            </blockquote>
          </article>

          {shopNotes.map((note, index) => (
            <article key={note.title} className="panel-card editorial-card">
              <p className="eyebrow">0{index + 1}</p>
              <h3>{note.title}</h3>
              <p className="section-subtitle">{note.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Catalog</p>
              <h2 className="section-title">Current products</h2>
              <p className="section-subtitle">Everything below is pulled directly from your live product catalog.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link to="/consult" className="btn btn-secondary">
                Need Something Custom?
              </Link>
              {isAdmin ? (
                <>
                  <Link to="/admin" className="btn btn-secondary">
                    Admin Dashboard
                  </Link>
                  <Link to="/admin/orders" className="btn btn-secondary">
                    View Orders
                  </Link>
                  <Link to="/admin/products/new" className="btn btn-primary">
                    + Add New Bag
                  </Link>
                </>
              ) : null}
            </div>
          </div>

          <ProductList currentUser={currentUser} />
        </div>
      </section>
    </main>
  );
}

export default Shop;
