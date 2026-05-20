import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import siteLogo from '../assets/Logo.jpg';
import { useCart } from '../context/CartContext';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/shop', label: 'Shop' },
  { path: '/collections', label: 'Collections' },
  { path: '/consult', label: 'Consult' },
  { path: '/contact', label: 'Contact' }
];

const Navbar = ({ currentUser, onSignOut }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();

  const isActive = (path) => location.pathname === path;

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#5c4834]/10 bg-[#fffaf3]/88 shadow-[0_12px_32px_rgba(39,28,18,0.06)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex min-w-0 items-center gap-3 text-sm font-black uppercase tracking-[0.22em] text-[#14110f]" onClick={closeMobile}>
          <img src={siteLogo} alt="ALHAMD ASHINO logo" className="h-12 w-12 shrink-0 rounded-full border border-[#5c4834]/15 object-cover shadow-sm" />
          <span className="hidden sm:inline">ALHAMD ASHINO</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-[#5c4834]/10 bg-white/62 p-1 shadow-sm xl:flex">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
                isActive(item.path)
                  ? 'bg-[#14110f] text-white shadow-sm'
                  : 'text-[#756a5f] hover:bg-white hover:text-[#14110f]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/cart" className="inline-flex items-center gap-2 rounded-full border border-[#5c4834]/12 bg-white/76 px-4 py-2 text-sm font-bold text-[#14110f] shadow-sm transition hover:bg-white">
            Cart
            <span className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-full bg-[#14110f] px-2 text-xs font-black text-white">
              {cartCount}
            </span>
          </Link>

          {currentUser ? (
            <div className="hidden items-center gap-2 lg:flex">
              <span className="max-w-[160px] truncate rounded-full border border-[#5c4834]/12 bg-white/70 px-4 py-2 text-sm font-bold text-[#756a5f]">{currentUser.name}</span>
              <button type="button" className="btn btn-secondary !min-h-0 !px-4 !py-3 !text-[0.72rem]" onClick={onSignOut}>
                Sign Out
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Link to="/signin" className="btn btn-secondary !min-h-0 !px-4 !py-3 !text-[0.72rem]">
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary !min-h-0 !px-4 !py-3 !text-[0.72rem]">
                Sign Up
              </Link>
            </div>
          )}

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-[#5c4834]/12 bg-white/80 px-4 py-2 text-sm font-black text-[#14110f] shadow-sm transition hover:bg-white xl:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      <div className={`${mobileOpen ? 'grid' : 'hidden'} gap-2 border-t border-[#5c4834]/10 bg-[#fffaf3]/96 px-4 py-4 shadow-lg backdrop-blur-xl xl:hidden`}>
        {navLinks.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={closeMobile}
            className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
              isActive(item.path) ? 'bg-[#14110f] text-white' : 'text-[#3f3730] hover:bg-white'
            }`}
          >
            {item.label}
          </Link>
        ))}
        <Link to="/cart" onClick={closeMobile} className="rounded-2xl px-4 py-3 text-sm font-bold text-[#3f3730] hover:bg-white">Cart ({cartCount})</Link>
        <Link to="/checkout" onClick={closeMobile} className="rounded-2xl px-4 py-3 text-sm font-bold text-[#3f3730] hover:bg-white">Checkout</Link>
        {currentUser ? (
          <button type="button" className="rounded-2xl px-4 py-3 text-left text-sm font-bold text-[#3f3730] hover:bg-white" onClick={() => { onSignOut(); closeMobile(); }}>
            Sign Out
          </button>
        ) : (
          <>
            <Link to="/signin" onClick={closeMobile} className="rounded-2xl px-4 py-3 text-sm font-bold text-[#3f3730] hover:bg-white">Sign In</Link>
            <Link to="/signup" onClick={closeMobile} className="rounded-2xl bg-[#14110f] px-4 py-3 text-sm font-bold text-white">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
