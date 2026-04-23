import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';

function AdminOrders({ currentUser }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isAdmin = Boolean(currentUser?.is_admin);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    apiFetch('/api/orders', { auth: true })
      .then((data) => setOrders(data.orders || []))
      .catch((err) => setError(err.message || 'Failed to load orders.'))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <main className="page">
        <section className="section">
          <div className="container narrow">
            <h1 className="section-title">Order Dashboard</h1>
            <div className="empty-box">
              <p>{currentUser ? 'Admin access is required to view orders.' : 'Please sign in to view orders.'}</p>
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
          <h1 className="section-title">Order Dashboard</h1>
          <p className="section-subtitle" style={{ marginBottom: '2rem' }}>A real-time overview of all successfully processed transactions.</p>
          
          {loading && <p>Loading orders...</p>}
          {error && <p className="error-msg">{error}</p>}
          {!loading && !error && orders.length === 0 && <p className="muted-text">No orders yet. They will appear here once customers checkout!</p>}

          {!loading && !error && orders.length > 0 && (
            <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '1.25rem 1rem', fontWeight: '600' }}>Order ID</th>
                    <th style={{ padding: '1.25rem 1rem', fontWeight: '600' }}>Date</th>
                    <th style={{ padding: '1.25rem 1rem', fontWeight: '600' }}>Customer</th>
                    <th style={{ padding: '1.25rem 1rem', fontWeight: '600' }}>Total</th>
                    <th style={{ padding: '1.25rem 1rem', fontWeight: '600' }}>Shipping Destination</th>
                    <th style={{ padding: '1.25rem 1rem', fontWeight: '600' }}>Purchased Items</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const items = JSON.parse(order.items_json || '[]');
                    return (
                      <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '1rem', color: '#666' }}>#{order.id}</td>
                        <td style={{ padding: '1rem' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: '1rem', fontWeight: '500' }}>{order.user_email}</td>
                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>${Number(order.total).toFixed(2)}</td>
                        <td style={{ padding: '1rem', maxWidth: '250px', lineHeight: '1.5' }}>{order.address}</td>
                        <td style={{ padding: '1rem' }}>
                          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#444' }}>
                            {items.map((item, idx) => (
                              <li key={idx} style={{ marginBottom: '4px' }}>{item.name} <span style={{ color: '#999' }}>(x{item.quantity})</span></li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default AdminOrders;
