import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createProperty } from '../services/propertyService';

function CreateListing() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    type: 'apartment',
    price: '',
    areaSqft: '',
    lat: '',
    lng: '',
    amenities: '',
    imageUrl: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (user?.role !== 'owner' && user?.role !== 'agent') {
      setError('Only owners and agents can create listings');
      return;
    }

    setSubmitting(true);
    try {
      await createProperty({
        title: form.title,
        type: form.type,
        price: Number(form.price),
        areaSqft: Number(form.areaSqft),
        location: { lat: Number(form.lat), lng: Number(form.lng) },
        amenities: form.amenities
          ? form.amenities.split(',').map((a) => a.trim()).filter(Boolean)
          : [],
        images: [form.imageUrl],
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-10">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Create Listing</h1>

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-6 space-y-4">
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <input
            type="text"
            name="title"
            placeholder="Title (min 5 characters)"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full rounded-lg bg-slate-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full rounded-lg bg-slate-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="plot">Plot</option>
            <option value="commercial">Commercial</option>
          </select>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price (₹)"
              value={form.price}
              onChange={handleChange}
              required
              min="1"
              className="w-full rounded-lg bg-slate-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="number"
              name="areaSqft"
              placeholder="Area (sqft)"
              value={form.areaSqft}
              onChange={handleChange}
              required
              min="1"
              className="w-full rounded-lg bg-slate-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              step="any"
              name="lat"
              placeholder="Latitude"
              value={form.lat}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-slate-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="number"
              step="any"
              name="lng"
              placeholder="Longitude"
              value={form.lng}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-slate-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <input
            type="text"
            name="amenities"
            placeholder="Amenities (comma separated, e.g. parking, gym)"
            value={form.amenities}
            onChange={handleChange}
            className="w-full rounded-lg bg-slate-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="url"
            name="imageUrl"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={handleChange}
            required
            className="w-full rounded-lg bg-slate-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 transition disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateListing;