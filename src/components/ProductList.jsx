import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch, resolveApiAssetUrl } from '../lib/api';
import { useCart } from '../context/CartContext';

const resolveImageSrc = (image) => {
  if (!image) return '';
  if (image.startsWith('http') || image.startsWith('data:image/')) return image;
  if (image.startsWith('/')) return resolveApiAssetUrl(image);
  if (image.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return `/${image}`;
  return '';
};

const getProductImages = (product) => {
  const rawImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image];

  return rawImages
    .map((image) => resolveImageSrc(String(image || '')))
    .filter(Boolean);
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
          const imageSources = getProductImages(product);
          const hasImages = imageSources.length > 0;
          return (
          <article
            key={product.id}
            className="product-card animate-fade-up"
          >
            <div className={`product-image ${hasImages ? 'product-image-gallery' : ''}`}>
              {hasImages ? (
                <>
                  <div className="product-gallery-track" aria-label={`${product.name} image gallery`}>
                    {imageSources.map((src, index) => (
                      <button
                        key={`${product.id}-${src}-${index}`}
                        type="button"
                        className="product-gallery-slide"
                        onClick={() => setLightbox({ src, name: `${product.name} ${index + 1} of ${imageSources.length}` })}
                        aria-label={`Open ${product.name} image ${index + 1}`}
                      >
                        <img
                          src={src}
                          alt={`${product.name} view ${index + 1}`}
                        />
                      </button>
                    ))}
                  </div>
                  {imageSources.length > 1 && (
                    <div className="product-gallery-dots" aria-hidden="true">
                      {imageSources.map((src, index) => (
                        <span key={`${src}-dot-${index}`} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="product-image-placeholder">
                  {String(product.image || 'Bag')}
                </div>
              )}
            </div>
            <div className="product-details">
              <p className="product-kicker">ALHAMD ASHINO</p>
              <h3 className="product-name">{product.name}</h3>
              {product.bio && (
                <p className="product-bio">
                  "{product.bio}"
                </p>
              )}

              <div className="flex items-center justify-between gap-4 mt-auto">
                <p className={`stock-tag ${product.stock === 'In stock' ? 'in-stock' : 'low-stock'}`}>
                  {product.stock}
                </p>
                <strong className="current-price">${Number(product.price).toFixed(2)}</strong>
              </div>
            </div>
            <div className="product-card-actions">
              <button
                type="button"
                className="btn btn-primary w-full"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
              {isAdmin ? (
                <>
                  <Link
                    to={`/admin/products/${product.id}/edit`}
                    className="btn btn-secondary product-admin-btn"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(product.id)}
                    className="btn btn-delete product-admin-btn"
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
          onClick={() => setLightbox(null)} /* Removed inline styles, now handled by class */
          className="lightbox-overlay"
        >
          <div
            onClick={(event) => event.stopPropagation()} /* Removed inline styles, now handled by class */
            className="lightbox-content"
          >
            <div className="lightbox-header">
              <strong className="lightbox-title">{lightbox.name}</strong>
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
              className="lightbox-image" /* Removed inline styles, now handled by class */
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ProductList;
