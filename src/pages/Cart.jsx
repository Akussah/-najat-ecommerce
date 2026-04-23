import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  return (
    <main className="page">
      <section className="section">
        <div className="container narrow">
          <h1 className="section-title">Cart</h1>
          <p className="section-subtitle">Review your selected bead bags before payment.</p>

          {cartItems.length === 0 ? (
            <div className="empty-box">
              <p>Your cart is empty.</p>
              <Link to="/shop" className="btn btn-primary">Go to Shop</Link>
            </div>
          ) : (
            <>
              <div className="cart-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div>
                      <h3>{item.name}</h3>
                      <p>${item.price} each</p>
                    </div>
                    <div className="qty-controls">
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <div className="line-total">${(item.price * item.quantity).toFixed(2)}</div>
                    <button type="button" className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div>
                  <strong>Total: ${cartTotal.toFixed(2)}</strong>
                  <p className="section-subtitle">Payment is completed securely at checkout.</p>
                </div>
                <div className="cart-footer-actions">
                  <button type="button" className="btn btn-secondary" onClick={clearCart}>Clear Cart</button>
                  <Link to="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Cart;
