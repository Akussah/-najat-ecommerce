import { Link } from 'react-router-dom';

const values = [
  {
    title: 'Craft first',
    text: 'Every product starts with beadwork quality, material choice, and wearability.'
  },
  {
    title: 'Modern presentation',
    text: 'We pair handmade detail with a clean, contemporary shopping experience.'
  },
  {
    title: 'Personal service',
    text: 'Consultations help customers shape custom ideas before they place an order.'
  }
];

function About() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-6 mt-12 overflow-hidden rounded-[2rem] bg-white/95 px-6 py-16 shadow-[0_32px_80px_rgba(15,23,42,0.08)] md:mx-10 md:px-14">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1.55fr_0.95fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">About</p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              A bead brand shaped by craftsmanship, clarity, and restraint.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              We make handmade bead pieces while keeping the customer experience simple, polished,
              and easy to navigate.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Craft-led</span>
              <span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Modern presentation</span>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-200/80 bg-slate-50 p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-950 mb-6">What defines the brand</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <strong className="block text-lg font-semibold text-slate-950">Handmade</strong>
                <span className="mt-2 block text-sm leading-7 text-slate-600">Bead-focused products with artisan detail</span>
              </div>
              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <strong className="block text-lg font-semibold text-slate-950">Thoughtful</strong>
                <span className="mt-2 block text-sm leading-7 text-slate-600">Simple guidance for custom and ready-made pieces</span>
              </div>
              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <strong className="block text-lg font-semibold text-slate-950">Flexible</strong>
                <span className="mt-2 block text-sm leading-7 text-slate-600">Great for bridal, gifting, and event orders</span>
              </div>
              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <strong className="block text-lg font-semibold text-slate-950">Refined</strong>
                <span className="mt-2 block text-sm leading-7 text-slate-600">A softer, more modern storefront experience</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-[1200px] gap-6 px-6 md:px-10 lg:grid-cols-4">
          {values.map((item, index) => (
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

      <section className="pb-20">
        <div className="mx-auto grid max-w-[1200px] gap-6 px-6 md:px-10 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-slate-200/80 bg-white p-10 shadow-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Our Approach</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">The store is designed to feel calm, clear, and premium.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Instead of overly busy pages, we focus on strong product presentation, soft surfaces,
              and direct paths to shopping, consulting, and checkout.
            </p>
          </article>

          <article className="rounded-[2rem] border border-slate-200/80 bg-white p-10 shadow-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Next Step</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">Browse or start a custom conversation.</h2>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/shop" className="btn btn-primary">Browse Shop</Link>
              <Link to="/consult" className="btn btn-secondary">Book Consult</Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

export default About;
