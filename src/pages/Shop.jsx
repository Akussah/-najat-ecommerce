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
    <main className="min-h-screen bg-slate-50">
      <section className="mx-6 mt-12 overflow-hidden rounded-[2.5rem] bg-brand-light/70 border border-slate-200/80 px-6 py-16 shadow-hero md:mx-10 md:px-14">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1.5fr_0.95fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-dark">Shop</p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              A focused shop for the bags, the details, and the add-to-cart flow.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              This is the product space for ALHAMD ASHINO. Browse the current bead bag lineup, add
              pieces to cart, or move to consultation if you need something more tailored.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700">Ready to order</span>
              <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700">Editorial catalog</span>
              <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700">Custom on request</span>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-950 mb-6">Shop guide</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-slate-50 p-5 shadow-sm">
                <strong className="block text-lg font-semibold text-slate-950">Ready now</strong>
                <span className="mt-2 block text-sm text-slate-600">Browse currently listed pieces</span>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5 shadow-sm">
                <strong className="block text-lg font-semibold text-slate-950">Custom later</strong>
                <span className="mt-2 block text-sm text-slate-600">Move to consultation for edits or event orders</span>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5 shadow-sm">
                <strong className="block text-lg font-semibold text-slate-950">Clear cart flow</strong>
                <span className="mt-2 block text-sm text-slate-600">Quick add-to-cart and checkout path</span>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5 shadow-sm">
                <strong className="block text-lg font-semibold text-slate-950">Flexible checkout</strong>
                <span className="mt-2 block text-sm text-slate-600">Card and MoMo supported</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-[1200px] gap-6 px-6 md:px-10 lg:grid-cols-3">
          <article className="rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Editor’s Note</p>
            <blockquote className="mt-4 text-xl font-semibold leading-9 text-slate-950">A calmer shopping floor for statement bead bags, where each piece has space to feel considered.</blockquote>
          </article>

          {shopNotes.map((note, index) => (
            <article key={note.title} className="rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">0{index + 1}</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-950">{note.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{note.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <div className="mb-10 rounded-[2.5rem] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_44px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Catalog</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950">Current products</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Everything below is pulled directly from your live product catalog.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/consult" className="btn btn-secondary">Need Something Custom?</Link>
                {isAdmin ? (
                  <>
                    <Link to="/admin" className="btn btn-secondary">Admin Dashboard</Link>
                    <Link to="/admin/orders" className="btn btn-secondary">View Orders</Link>
                    <Link to="/admin/products/new" className="btn btn-primary">+ Add New Bag</Link>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          <ProductList currentUser={currentUser} />
        </div>
      </section>
    </main>
  );
}

export default Shop;
