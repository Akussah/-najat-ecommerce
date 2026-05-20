import { Link } from 'react-router-dom';

const collectionGroups = [
  {
    title: 'Event Bags',
    text: 'Statement pieces for weddings, receptions, and special occasions.'
  },
  {
    title: 'Everyday Picks',
    text: 'Cleaner silhouettes that still carry handcrafted bead texture and detail.'
  },
  {
    title: 'Gift Sets',
    text: 'Curated combinations designed for celebrations, gifting, and premium presentation.'
  },
  {
    title: 'Custom Orders',
    text: 'Flexible pieces shaped around your colors, quantity, or event needs.'
  }
];

function Collections() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-6 mt-12 overflow-hidden rounded-[2rem] bg-white/95 px-6 py-16 shadow-[0_32px_80px_rgba(15,23,42,0.08)] md:mx-10 md:px-14">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1.5fr_0.95fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Collections</p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Organized collections for the way people actually shop.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Browse by purpose, event, or order type instead of digging through overly complex
              layouts.
            </p>
          </div>

          <aside className="rounded-[2rem] border border-slate-200/80 bg-slate-50 p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-950 mb-6">Best for</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <strong className="block text-lg font-semibold text-slate-950">Bridal</strong>
                <span className="mt-2 block text-sm leading-7 text-slate-600">Elegant event-ready designs</span>
              </div>
              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <strong className="block text-lg font-semibold text-slate-950">Gifting</strong>
                <span className="mt-2 block text-sm leading-7 text-slate-600">Premium picks for special occasions</span>
              </div>
              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <strong className="block text-lg font-semibold text-slate-950">Bulk orders</strong>
                <span className="mt-2 block text-sm leading-7 text-slate-600">Event and coordinated orders</span>
              </div>
              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <strong className="block text-lg font-semibold text-slate-950">Custom needs</strong>
                <span className="mt-2 block text-sm leading-7 text-slate-600">Flexible design conversations</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-[1200px] gap-6 px-6 md:px-10 lg:grid-cols-4">
          {collectionGroups.map((item, index) => (
            <article key={item.title} className="rounded-[1.75rem] border border-slate-200/80 bg-white p-8 text-center shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#b27f52]/10 text-lg font-bold text-[#b27f52]">
                0{index + 1}
              </div>
              <h3 className="text-xl font-semibold text-slate-950 mb-3">{item.title}</h3>
              <p className="text-sm leading-7 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <div className="rounded-[2rem] bg-white/95 p-10 shadow-[0_24px_44px_rgba(15,23,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Need Help Choosing?</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">Use a consultation if you want help narrowing the right collection.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              We can guide you based on style, budget, occasion, and timeline before you order.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/consult" className="btn btn-secondary">Start Consultation</Link>
              <Link to="/shop" className="btn btn-secondary">Open Shop</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Collections;
