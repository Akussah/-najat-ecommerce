import { Link } from 'react-router-dom';
import ProductList from '../components/ProductList';
import StorySections from '../components/StorySections';

function Home({ currentUser }) {
  return (
    <main className="min-h-screen">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-brand-light/75 border border-slate-200/80 shadow-hero py-28 md:py-32 mx-6 md:mx-10 lg:mx-16">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(194,125,61,0.18),transparent_32%)]" />
        <div className="absolute inset-y-0 right-0 w-72 bg-[radial-gradient(circle,_rgba(42,35,24,0.12),transparent_60%)] opacity-80" />
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-16">
          
          {/* Top Meta */}
          <div className="hidden md:flex justify-between text-[0.6875rem] uppercase tracking-[0.32em] text-slate-500 mb-16">
            <span>Collection 001</span>
            <span>Accra, Ghana</span>
          </div>

          {/* Main Hero */}
          <div className="grid gap-16 md:grid-cols-[1.2fr_0.8fr] items-end">
            
            <h1 className="text-[clamp(4rem,12vw,10rem)] leading-[0.85] font-[200] tracking-[-0.05em] text-slate-950 m-0">
              Alhamd<br />Ashino
            </h1>

            <div className="max-w-xl space-y-8">
              <p className="text-xl leading-[1.75] text-slate-600">
                Redefining African adornment through refined minimalism,
                cultural heritage, and modern elegance.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/shop"
                  className="btn btn-primary"
                >
                  Shop
                </Link>

                <Link
                  to="/consult"
                  className="btn btn-secondary"
                >
                  Consult
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* HIGHLIGHTS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-16 grid gap-12 md:grid-cols-3 border-t border-slate-200 pt-16">
          
          {[
            {
              title: 'Handcrafted Detail',
              text: 'Each piece is handcrafted in Ghana, preserving deep-rooted tradition.'
            },
            {
              title: 'Personal Curation',
              text: 'Custom-designed pieces tailored to your identity and presence.',
            },
            {
              title: 'Ethical Luxury',
              text: 'Empowering artisans through ethical, meaningful craftsmanship.',
            }
          ].map((item, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">
                0{i + 1}
              </div>

              <h3>
                {item.title}
              </h3>
              <p>
                {item.text}
              </p>
            </div>
          ))}

        </div>
      </section>


      {/* STATS */}
      <section className="section bg-white/90 rounded-[2.5rem] border border-slate-200/80 shadow-[0_24px_64px_rgba(15,23,42,0.08)] mx-6 md:mx-10 lg:mx-16">
        <div className="container stats-grid">

          {[
            { value: '500+', label: 'Pieces' },
            { value: '15+', label: 'Countries' },
            { value: '100%', label: 'Handcrafted' }
          ].map((stat, i) => (
            <div key={i} className="stat-item rounded-[1.75rem] bg-white px-8 py-10 shadow-sm">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">
                {stat.label}
              </div>
            </div>
          ))}

        </div>
      </section>


      {/* BRAND INFO / FOUNDER - This section is now handled by StorySections.jsx */}

      {/* PRODUCTS */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Catalogue</p>
            <h2 className="section-title">
              Selected Works
            </h2>
            </div>
            <Link
              to="/shop"
              className="btn btn-secondary"
            >
              Shop All
            </Link>
          </div>

          <ProductList currentUser={currentUser} limit={6} />
        </div>
      </section>


      {/* STORY */}
      <StorySections />
      
      {/* CTA */}
      <section className="py-24 bg-[radial-gradient(circle_at_top,_rgba(199,125,61,0.18),transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(24,34,58,0.1),transparent_36%),#fff6eb]">
        <div className="mx-auto max-w-6xl px-6 md:px-16 text-center">

          <div className="mx-auto mb-8 max-w-2xl rounded-[2rem] border border-slate-200/80 bg-white/95 p-10 shadow-[0_24px_44px_rgba(15,23,42,0.08)]">
            <h2 className="section-title">
              Begin Your Journey
            </h2>
            <p className="section-subtitle">
              Discover handcrafted pieces rooted in heritage and refined for modern elegance.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              to="/shop"
              className="btn btn-primary"
            >
              Shop Collection
            </Link>
            <Link
              to="/consult"
              className="btn btn-secondary"
            >
              Custom Piece
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}

export default Home;