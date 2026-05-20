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
    <main className="min-h-screen bg-slate-50">
      <section className="mx-6 mt-12 overflow-hidden rounded-[2rem] bg-white/95 px-6 py-16 shadow-[0_32px_80px_rgba(15,23,42,0.08)] md:mx-10 md:px-14">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1.5fr_0.95fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Commission</p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Custom commissions without the confusing process.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              This page is for clients who already know they want something bespoke and want a
              direct, polished way to start.
            </p>
          </div>

          <aside className="rounded-[2rem] border border-slate-200/80 bg-slate-50 p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-950 mb-6">Common requests</h3>
            <div className="grid gap-4">
              {commissionTypes.map((item) => (
                <div key={item} className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-950">{item}</h3>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-[1200px] gap-6 px-6 md:px-10 lg:grid-cols-2">
          <article className="rounded-[2rem] bg-white/95 p-10 shadow-[0_24px_44px_rgba(15,23,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">How It Works</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">Three clean steps from idea to approval.</h2>
            <ul className="mt-6 space-y-3 text-slate-600">
              {steps.map((step) => (
                <li key={step} className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50 p-4">
                  {step}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[2rem] bg-white/95 p-10 shadow-[0_24px_44px_rgba(15,23,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Start Here</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">The easiest way to begin is through consultation.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Share your event, desired look, quantity, and budget so we can recommend the right
              commission path.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
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
