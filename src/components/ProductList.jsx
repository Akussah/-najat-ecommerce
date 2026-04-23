import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { useCart } from '../context/CartContext';

const resolveImageSrc = (image) => {
  if (!image) return '';
  if (image.startsWith('http') || image.startsWith('/') || image.startsWith('data:image/')) return image;
  if (image.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return `/${image}`;
  return '';
};

const ProductList = ({ currentUser, limit }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightbox, setLightbox] = useState(null);
  const { addToCart } = useCart();
  const isAdmin = Boolean(currentUser?.is_admin);
  const hasLimit = Number.isFinite(limit);

  useEffect(() => {
    apiFetch('/api/products')
      .then((data) => setProducts(data.products || []))
      .catch((err) => setError(err.message || 'Failed to load products.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to completely delete this bag from your store?')) return;
    try {
      await apiFetch(`/api/products/${id}`, { method: 'DELETE', auth: true });
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightbox]);

  if (loading) return <p className="muted-text">Loading products...</p>;
  if (error) return <p className="error-msg">{error}</p>;
  if (!products.length) return <p className="muted-text">No products yet. Add a new bag to get started.</p>;

  const displayedProducts = hasLimit ? products.slice(0, Math.max(0, limit)) : products;

  return (
    <>
      <div className="products-grid catalog-grid">
        {displayedProducts.map((product) => {
          const imageSrc = resolveImageSrc(product.image || '');
          return (
          <article
            key={product.id}
            className="product-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
              backgroundColor: '#fff',
              paddingBottom: '1.5rem',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <div
              className="product-image"
              style={{ width: '100%', height: '200px', marginBottom: '1rem', backgroundColor: '#fcfcfc', cursor: imageSrc ? 'zoom-in' : 'default' }}
              onClick={() => {
                if (imageSrc) setLightbox({ src: imageSrc, name: product.name });
              }}
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6rem 0',
                    color: '#aaa',
                    fontStyle: 'italic'
                  }}
                >
                  {String(product.image || 'Bag')}
                </div>
              )}
            </div>
            <div style={{ padding: '0 1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <p
                className="product-kicker"
                style={{ fontSize: '0.75rem', letterSpacing: '0.08em', color: '#999', marginBottom: '0.25rem', textTransform: 'uppercase' }}
              >
                ALHAMD ASHINO
              </p>
              <h3 className="product-name" style={{ fontSize: '1.35rem', marginBottom: '0.5rem', fontWeight: '600', color: '#222' }}>{product.name}</h3>
              {product.bio && (
                <p className="product-bio" style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '1.25rem', flex: 1 }}>
                  "{product.bio}"
                </p>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <p
                  className="stock-tag"
                  style={{
                    fontSize: '0.85rem',
                    color: product.stock === 'In stock' ? '#2b8a3e' : '#e6a23c',
                    fontWeight: '600',
                    margin: 0,
                    padding: '4px 8px',
                    backgroundColor: product.stock === 'In stock' ? '#eefbf1' : '#fdf6ec',
                    borderRadius: '4px'
                  }}
                >
                  {product.stock}
                </p>
                <strong className="current-price" style={{ fontSize: '1.25rem', color: '#111' }}>${Number(product.price).toFixed(2)}</strong>
              </div>
            </div>
            <div style={{ padding: '1.25rem 1.5rem 0', display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1, borderRadius: '8px', padding: '0.85rem', fontWeight: '600', fontSize: '1rem' }}
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
              {isAdmin ? (
                <>
                  <Link
                    to={`/admin/products/${product.id}/edit`}
                    className="btn btn-secondary"
                    style={{ borderRadius: '8px', padding: '0.85rem', fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(product.id)}
                    className="btn"
                    style={{ backgroundColor: '#ff4d4f', color: '#fff', borderRadius: '8px', padding: '0.85rem', fontWeight: '600', fontSize: '1rem', border: 'none', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </>
              ) : null}
            </div>
          </article>
        );
      })}
      </div>

      {lightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 12, 16, 0.72)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            zIndex: 60
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '1.5rem',
              maxWidth: '90vw',
              maxHeight: '90vh',
              boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '1.1rem' }}>{lightbox.name}</strong>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setLightbox(null)}
                style={{ padding: '0.4rem 0.9rem' }}
              >
                Close
              </button>
            </div>
            <img
              src={lightbox.src}
              alt={lightbox.name}
              style={{ maxWidth: '86vw', maxHeight: '72vh', objectFit: 'contain', borderRadius: '16px' }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ProductList;
