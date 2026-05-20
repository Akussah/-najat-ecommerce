import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <div className="rounded-[2.5rem] border border-slate-200/80 bg-brand-light/70 p-10 shadow-hero">
            <h1 className="text-3xl font-semibold text-slate-950">Cart</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">Review your selected bead bags before payment.</p>

            {cartItems.length === 0 ? (
              <div className="mt-12 rounded-[2rem] border border-dashed border-slate-300 bg-white/90 p-10 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-700">Your cart is empty.</p>
                <Link to="/shop" className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Go to Shop
                </Link>
              </div>
            ) : (
              <div className="mt-10 space-y-8">
                <div className="space-y-4 rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="grid gap-4 rounded-[1.5rem] bg-white p-5 shadow-sm sm:grid-cols-[1.5fr_auto_auto_auto] sm:items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950">{item.name}</h3>
                        <p className="mt-1 text-sm text-slate-600">${item.price} each</p>
                      </div>
                      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-slate-600 transition hover:text-slate-900">-</button>
                        <span className="min-w-[2rem] text-center font-semibold">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-slate-600 transition hover:text-slate-900">+</button>
                      </div>
                      <div className="text-sm font-semibold text-slate-950">${(item.price * item.quantity).toFixed(2)}</div>
                      <button type="button" onClick={() => removeFromCart(item.id)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-4 rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Payment is completed securely at checkout.</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">Total: ${cartTotal.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button type="button" className="btn btn-secondary" onClick={clearCart}>Clear Cart</button>
                    <Link to="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Cart;
