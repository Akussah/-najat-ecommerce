import { Link } from 'react-router-dom';

const commissionTypes = [
  'Signature bridal pieces',
  'Custom color-matched bags',
  'Gift sets for events and teams',
  'Small-batch premium orders'
];

const steps = [
  'Tell us what you want to create',
  'Receive guidance on timeline and pricing',
  'Approve the direction before production starts'
];

function Commission() {
  return (
    <main className="page">
      <section className="hero-simple">
        <div className="container hero-shell">
          <div className="hero-copy">
            <p className="eyebrow">Commission</p>
            <h1 className="hero-title">Custom commissions without the confusing process.</h1>
            <p className="hero-subtitle">
              This page is for clients who already know they want something bespoke and want a
              direct, polished way to start.
            </p>
          </div>
          <aside className="hero-panel">
            <h3>Common requests</h3>
            <div className="feature-grid">
              {commissionTypes.map((item) => (
                <div key={item} className="feature-card">
                  <h3>{item}</h3>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container page-grid">
          <article className="panel-card page-card">
            <p className="eyebrow">How It Works</p>
            <h2 className="section-title">Three clean steps from idea to approval.</h2>
            <ul>
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </article>

          <article className="panel-card page-card">
            <p className="eyebrow">Start Here</p>
            <h2 className="section-title">The easiest way to begin is through consultation.</h2>
            <p className="section-subtitle">
              Share your event, desired look, quantity, and budget so we can recommend the right
              commission path.
            </p>
            <div className="hero-actions">
              <Link to="/consult" className="btn btn-primary">Book Consultation</Link>
              <Link to="/contact" className="btn btn-secondary">Send a Message</Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

export default Commission;
