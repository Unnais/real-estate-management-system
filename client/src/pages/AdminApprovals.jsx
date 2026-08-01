import { useState, useEffect } from 'react';
import { getAllPropertiesAdmin, updatePropertyStatus } from '../services/propertyService';

function AdminApprovals() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await getAllPropertiesAdmin('pending');
      setProperties(res.data.data);
    } catch (err) {
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleDecision = async (id, status) => {
    try {
      await updatePropertyStatus(id, status);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Pending Approvals</h1>

        {loading && <p className="text-slate-400">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && properties.length === 0 && (
          <p className="text-slate-400">No pending properties.</p>
        )}

        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-slate-800 rounded-xl p-5 flex justify-between items-center"
            >
              <div>
                <h3 className="text-white font-semibold">{property.title}</h3>
                <p className="text-slate-400 text-sm capitalize">
                  {property.type} · ₹{property.price?.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDecision(property._id, 'approved')}
                  className="rounded-lg bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecision(property._id, 'rejected')}
                  className="rounded-lg bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminApprovals;