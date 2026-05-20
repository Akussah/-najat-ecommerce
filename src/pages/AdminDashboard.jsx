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
      <main className="min-h-screen bg-slate-50">
        <section className="py-20">
          <div className="mx-auto max-w-[900px] px-6 md:px-10">
            <div className="rounded-[2rem] bg-white/95 p-10 shadow-[0_24px_44px_rgba(15,23,42,0.08)]">
              <h1 className="text-3xl font-semibold text-slate-950">Admin Dashboard</h1>
              <div className="mt-6 rounded-[1.5rem] border border-slate-200/80 bg-slate-50 p-8 text-center">
                <p className="text-slate-700">{currentUser ? 'Admin access is required to view the dashboard.' : 'Please sign in to manage products and orders.'}</p>
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
            <h1 className="text-3xl font-semibold text-slate-950">Admin Dashboard</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">Quick access to inventory and orders.</p>

            {loading && <p className="mt-6 text-slate-600">Loading dashboard...</p>}
            {error && <p className="mt-6 text-rose-600">{error}</p>}

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <article className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-950">Products</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">Active catalog count: <strong className="text-slate-950">{stats.products}</strong></p>
                <Link to="/admin/products/new" className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Add New Product
                </Link>
              </article>

              <article className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-950">Orders</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">Total orders: <strong className="text-slate-950">{stats.orders}</strong></p>
                <Link to="/admin/orders" className="mt-6 inline-flex rounded-full border border-slate-900 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                  View Orders
                </Link>
              </article>

              <article className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-950">Shop Preview</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">See how your catalog looks to customers.</p>
                <Link to="/shop" className="mt-6 inline-flex rounded-full border border-slate-900 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                  Open Shop
                </Link>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
