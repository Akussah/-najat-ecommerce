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
      <main className="min-h-screen bg-slate-50">
        <section className="py-20">
          <div className="mx-auto max-w-[900px] px-6 md:px-10">
            <div className="rounded-[2rem] bg-white/95 p-10 shadow-[0_24px_44px_rgba(15,23,42,0.08)]">
              <h1 className="text-3xl font-semibold text-slate-950">Order Dashboard</h1>
              <div className="mt-6 rounded-[1.5rem] border border-slate-200/80 bg-slate-50 p-8 text-center">
                <p className="text-slate-700">{currentUser ? 'Admin access is required to view orders.' : 'Please sign in to view orders.'}</p>
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  {!currentUser && <Link to="/signin" className="btn btn-primary">Sign In</Link>}
                  <Link to="/shop" className="btn btn-secondary">Back to Shop</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="py-20">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <div className="rounded-[2rem] bg-white/95 p-10 shadow-[0_24px_44px_rgba(15,23,42,0.08)]">
            <h1 className="text-3xl font-semibold text-slate-950">Order Dashboard</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">A real-time overview of all successfully processed transactions.</p>
            {loading && <p className="mt-6 text-slate-600">Loading orders...</p>}
            {error && <p className="mt-6 text-rose-600">{error}</p>}
            {!loading && !error && orders.length === 0 && <p className="mt-6 text-slate-600">No orders yet. They will appear here once customers checkout!</p>}

            {!loading && !error && orders.length > 0 && (
              <div className="mt-10 overflow-x-auto rounded-[1.5rem] bg-white border border-slate-200 shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-100 text-left text-sm text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Order ID</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold">Customer</th>
                      <th className="px-6 py-4 font-semibold">Total</th>
                      <th className="px-6 py-4 font-semibold">Shipping Destination</th>
                      <th className="px-6 py-4 font-semibold">Purchased Items</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white text-sm text-slate-600">
                    {orders.map((order) => {
                      const items = JSON.parse(order.items_json || '[]');
                      return (
                        <tr key={order.id}>
                          <td className="px-6 py-4 font-medium text-slate-950">#{order.id}</td>
                          <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4">{order.user_email}</td>
                          <td className="px-6 py-4">${Number(order.total).toFixed(2)}</td>
                          <td className="px-6 py-4 max-w-[280px] text-slate-700">{order.address}</td>
                          <td className="px-6 py-4">
                            <ul className="space-y-1 text-slate-600">
                              {items.map((item, idx) => (
                                <li key={idx} className="rounded-lg bg-slate-50 px-3 py-2">
                                  {item.name} <span className="text-slate-500">(x{item.quantity})</span>
                                </li>
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
        </div>
      </section>
    </main>
  );
}

export default AdminOrders;
