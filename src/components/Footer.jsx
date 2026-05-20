import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="mt-16 bg-[#14110f] text-[#fffaf3]">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-[1.4fr_0.8fr_0.8fr] lg:px-8">
        <div className="space-y-6">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#d1b192]">ALHAMD ASHINO</p>
          <h2 className="max-w-xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
            African bead bag design with a cleaner, more refined digital home.
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-white/68">
            Explore ready-to-order bags, request custom work, and move through the brand with a calmer, more polished experience.
          </p>
        </div>

        <div>
          <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-[#d1b192]">Explore</p>
          <div className="grid gap-3 text-sm font-semibold text-white/76">
            <Link to="/shop" className="transition hover:text-[#ffd9b4]">Shop</Link>
            <Link to="/collections" className="transition hover:text-[#ffd9b4]">Collections</Link>
            <Link to="/commission" className="transition hover:text-[#ffd9b4]">Commission</Link>
          </div>
        </div>

        <div>
          <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-[#d1b192]">Contact</p>
          <div className="grid gap-3 text-sm font-semibold text-white/76">
            <Link to="/consult" className="transition hover:text-[#ffd9b4]">Consult</Link>
            <Link to="/contact" className="transition hover:text-[#ffd9b4]">Contact</Link>
            <a href="mailto:Alhamdashino@gmail.com" className="transition hover:text-[#ffd9b4]">Alhamdashino@gmail.com</a>
            <a href="tel:+18622710875" className="transition hover:text-[#ffd9b4]">862-271-0875</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-5 text-center text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
        Handmade bead bags, refined for modern occasions
      </div>
    </footer>
  );
}

export default Footer;
