import { useState, useEffect } from 'react';
import { getProperties, searchProperties } from '../services/propertyService';
import PropertyCard from '../components/PropertyCard';

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchProperties = async (useFilters = false) => {
    setLoading(true);
    setError('');
    try {
      if (useFilters) {
        const params = {};
        if (keyword) params.keyword = keyword;
        if (type) params.type = type;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        const res = await searchProperties(params);
        setProperties(res.data.data);
      } else {
        const res = await getProperties();
        setProperties(res.data.data);
      }
    } catch (err) {
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(false);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties(true);
  };

  const handleClear = () => {
    setKeyword('');
    setType('');
    setMinPrice('');
    setMaxPrice('');
    fetchProperties(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Browse Properties</h1>

        <form
          onSubmit={handleSearch}
          className="bg-slate-800 rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
        >
          <input
            type="text"
            placeholder="Search by title"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="rounded-lg bg-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-lg bg-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Any type</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="plot">Plot</option>
            <option value="commercial">Commercial</option>
          </select>

          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="rounded-lg bg-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="rounded-lg bg-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white py-2 text-sm transition"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white py-2 text-sm transition"
            >
              Clear
            </button>
          </div>
        </form>

        {loading && <p className="text-slate-400">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && properties.length === 0 && (
          <p className="text-slate-400">No properties found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Properties;