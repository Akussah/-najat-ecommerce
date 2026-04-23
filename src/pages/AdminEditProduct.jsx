import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../lib/api';

function AdminEditProduct({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    stock: 'In stock',
    image: '',
    bio: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const isAdmin = Boolean(currentUser?.is_admin);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    apiFetch(`/api/products/${id}`)
      .then((data) => {
        if (data.product) {
          setFormData(data.product);
          if (data.product.image) {
            const preview = data.product.image.startsWith('/') || data.product.image.startsWith('http')
              ? data.product.image
              : `/${data.product.image}`;
            setImagePreview(preview);
          }
        }
      })
      .catch((err) => setError(err.message || 'Failed to load product details.'))
      .finally(() => setLoading(false));
  }, [id, isAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('price', String(formData.price));
      payload.append('description', formData.description);
      payload.append('stock', formData.stock);
      payload.append('bio', formData.bio || '');
      if (imageFile) payload.append('image', imageFile);

      await apiFetch(`/api/products/${id}`, {
        method: 'PUT',
        body: payload,
        auth: true
      });
      navigate('/shop');
    } catch (err) {
      setError(err.message || 'Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <main className="page">
        <section className="section">
          <div className="container narrow">
            <h1 className="section-title">Edit Product</h1>
            <div className="empty-box">
              <p>{currentUser ? 'Admin access is required to edit products.' : 'Please sign in to manage products.'}</p>
              <div className="stack-actions">
                {!currentUser && <Link to="/signin" className="btn btn-primary">Sign In</Link>}
                <Link to="/shop" className="btn btn-secondary">Back to Shop</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (loading) return <main className="page"><div className="container narrow"><p>Loading product...</p></div></main>;

  return (
    <main className="page">
      <section className="section">
        <div className="container narrow">
          <h1 className="section-title">Edit Product</h1>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>Name<input type="text" name="name" value={formData.name} onChange={handleChange} required /></label>
            <label>Price ($)<input type="number" name="price" value={formData.price} onChange={handleChange} min="0.01" step="0.01" required /></label>
            <label>Description<textarea name="description" value={formData.description} onChange={handleChange} rows="3" required /></label>
            <label>Bio<textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows="3" /></label>
            <label>Stock Status<select name="stock" value={formData.stock} onChange={handleChange}><option value="In stock">In stock</option><option value="Low stock">Low stock</option><option value="Out of stock">Out of stock</option></select></label>
            <label>Upload New Image (Leave blank to keep current)<input type="file" accept="image/*" onChange={handleFileChange} /></label>
            {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxHeight: '200px', marginTop: '10px', borderRadius: '8px', objectFit: 'contain' }} />}
            {error && <p className="error-msg">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>
      </section>
    </main>
  );
}
export default AdminEditProduct;
