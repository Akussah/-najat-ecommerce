import { Link } from 'react-router-dom';

const heritagePoints = [
  {
    title: 'Craftsmanship at the center',
    text: 'The brand story still begins with material detail, technique, and finish.'
  },
  {
    title: 'Made for modern customers',
    text: 'We keep the presentation current so the handmade work feels relevant and accessible.'
  },
  {
    title: 'Built for special moments',
    text: 'Many pieces are designed for celebrations, gift-giving, and meaningful events.'
  }
];

function Heritage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-6 mt-12 overflow-hidden rounded-[2rem] bg-white/95 px-6 py-16 shadow-[0_32px_80px_rgba(15,23,42,0.08)] md:mx-10 md:px-14">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1.5fr_0.95fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Heritage</p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              A softer modern look built on traditional beadwork values.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Heritage here is not about heavy visuals. It is about keeping the craft visible while
              presenting it in a cleaner, more contemporary way.
            </p>
          </div>

          <aside className="rounded-[2rem] border border-slate-200/80 bg-slate-50 p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-950 mb-6">What stays consistent</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <strong className="block text-lg font-semibold text-slate-950">Detail</strong>
                <span className="mt-2 block text-sm leading-7 text-slate-600">Careful bead selection and finishing</span>
              </div>
              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <strong className="block text-lg font-semibold text-slate-950">Purpose</strong>
                <span className="mt-2 block text-sm leading-7 text-slate-600">Products designed for real occasions</span>
              </div>
              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <strong className="block text-lg font-semibold text-slate-950">Service</strong>
                <span className="mt-2 block text-sm leading-7 text-slate-600">Direct help when custom work is needed</span>
              </div>
              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <strong className="block text-lg font-semibold text-slate-950">Presentation</strong>
                <span className="mt-2 block text-sm leading-7 text-slate-600">A premium, calmer storefront experience</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-[1200px] gap-6 px-6 md:px-10 lg:grid-cols-3">
          {heritagePoints.map((item, index) => (
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
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Explore</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">See how that heritage shows up in the current collection.</h2>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/shop" className="btn btn-secondary">Browse Products</Link>
              <Link to="/collections" className="btn btn-secondary">View Collections</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Heritage;
