import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';

function AdminAddProduct({ currentUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    stock: 'In stock',
    bio: '',
    colors: ''
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);

  const isAdmin = Boolean(currentUser?.is_admin);

  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    // Limit selection to 5 files maximum on the frontend
    const files = Array.from(e.target.files).slice(0, 5);
    if (!files.length) return;
    
    imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    setImageFiles(files);
    setImagePreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (imageFiles.length > 0 && (imageFiles.length < 2 || imageFiles.length > 5)) {
      setError("Please select between 2 and 5 images.");
      setLoading(false);
      return;
    }

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('price', String(formData.price));
      payload.append('description', formData.description);
      payload.append('stock', formData.stock);
      payload.append('bio', formData.bio);
      if (formData.colors) payload.append('colors', formData.colors);
      imageFiles.forEach(file => payload.append('images', file));

      await apiFetch('/api/products', {
        method: 'POST',
        body: payload,
        auth: true
      });

      navigate('/shop');
    } catch (err) {
      setError(err.message || 'Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="py-20">
          <div className="mx-auto max-w-[900px] px-6 md:px-10">
            <div className="rounded-[2rem] bg-white/95 p-10 shadow-[0_24px_44px_rgba(15,23,42,0.08)]">
              <h1 className="text-3xl font-semibold text-slate-950">Add New Product</h1>
              <div className="mt-6 rounded-[1.5rem] border border-slate-200/80 bg-slate-50 p-8 text-center">
                <p className="text-slate-700">{currentUser ? 'Admin access is required to add products.' : 'Please sign in to manage products.'}</p>
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  {!currentUser && <Link to="/signin" className="btn btn-primary">Sign In</Link>}
                  <Link to="/shop" className="btn btn-secondary">Back to Shop</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="py-20">
        <div className="mx-auto max-w-[900px] px-6 md:px-10">
          <div className="rounded-[2rem] bg-white/95 p-10 shadow-[0_24px_44px_rgba(15,23,42,0.08)]">
            <h1 className="text-3xl font-semibold text-slate-950">Add New Product</h1>
            <form className="mt-8 grid gap-6" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm font-semibold text-slate-900">
                Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#b27f52] focus:ring-4 focus:ring-[#b27f52]/10"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-900">
                Price ($)
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                  className="rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#b27f52] focus:ring-4 focus:ring-[#b27f52]/10"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-900">
                Description
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  required
                  className="min-h-[8rem] rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#b27f52] focus:ring-4 focus:ring-[#b27f52]/10"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-900">
                Bio
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="min-h-[8rem] rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#b27f52] focus:ring-4 focus:ring-[#b27f52]/10"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-900">
                Stock Status
                <select
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#b27f52] focus:ring-4 focus:ring-[#b27f52]/10"
                >
                  <option value="In stock">In stock</option>
                  <option value="Low stock">Low stock</option>
                  <option value="Out of stock">Out of stock</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-900">
                Colors / Variants (comma separated)
                <input
                  type="text"
                  name="colors"
                  value={formData.colors}
                  onChange={handleChange}
                  placeholder="e.g. Red, Gold, Green"
                  className="rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#b27f52] focus:ring-4 focus:ring-[#b27f52]/10"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-900">
                Upload Images (Select 2 to 5)
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none file:cursor-pointer file:rounded-full file:border file:border-slate-300 file:bg-slate-100 file:px-4 file:py-2"
                />
              </label>
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {imagePreviews.map((src, i) => (
                    <img key={i} src={src} alt={`Preview ${i + 1}`} className="h-28 w-full rounded-[1rem] object-cover shadow-sm" />
                  ))}
                </div>
              )}

              {error && <p className="text-sm text-rose-600">{error}</p>}

              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? 'Adding...' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminAddProduct;
