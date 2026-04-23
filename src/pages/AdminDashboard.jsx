import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

function AdminDashboard({ currentUser }) {
  const [stats, setStats] = useState({ products: 0, orders: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isAdmin = Boolean(currentUser?.is_admin);

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);

    Promise.all([
      apiFetch('/api/products'),
      apiFetch('/api/orders', { auth: true })
    ])
      .then(([productsData, ordersData]) => {
        setStats({
          products: productsData.products?.length || 0,
          orders: ordersData.orders?.length || 0
        });
      })
      .catch((err) => setError(err.message || 'Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, [currentUser]);

  if (!isAdmin) {
    return (
      <main className="page">
        <section className="section">
          <div className="container narrow">
            <h1 className="section-title">Admin Dashboard</h1>
            <div className="empty-box">
              <p>{currentUser ? 'Admin access is required to view the dashboard.' : 'Please sign in to manage products and orders.'}</p>
              <div className="stack-actions">
                {!currentUser && <Link to="/signin" className="btn btn-primary">Sign In</Link>}
                <Link to="/shop" className="btn btn-secondary">Back to Shop</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="section">
        <div className="container">
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="section-subtitle">Quick access to inventory and orders.</p>

          {loading && <p className="muted-text">Loading dashboard...</p>}
          {error && <p className="error-msg">{error}</p>}

          <div className="products-grid" style={{ marginTop: '2rem' }}>
            <article className="panel-card" style={{ padding: '1.75rem', borderRadius: '12px', backgroundColor: '#fff' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Products</h3>
              <p className="muted-text" style={{ marginBottom: '1.5rem' }}>Active catalog count: <strong>{stats.products}</strong></p>
              <Link to="/admin/products/new" className="btn btn-primary">Add New Product</Link>
            </article>

            <article className="panel-card" style={{ padding: '1.75rem', borderRadius: '12px', backgroundColor: '#fff' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Orders</h3>
              <p className="muted-text" style={{ marginBottom: '1.5rem' }}>Total orders: <strong>{stats.orders}</strong></p>
              <Link to="/admin/orders" className="btn btn-secondary">View Orders</Link>
            </article>

            <article className="panel-card" style={{ padding: '1.75rem', borderRadius: '12px', backgroundColor: '#fff' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Shop Preview</h3>
              <p className="muted-text" style={{ marginBottom: '1.5rem' }}>See how your catalog looks to customers.</p>
              <Link to="/shop" className="btn btn-secondary">Open Shop</Link>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
