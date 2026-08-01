import { useState, useEffect } from 'react';
import { getMyBookings } from '../services/bookingService';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-green-500/20 text-green-400',
  completed: 'bg-blue-500/20 text-blue-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getMyBookings();
        setBookings(res.data.data);
      } catch (err) {
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">My Bookings</h1>

        {loading && <p className="text-slate-400">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && !error && bookings.length === 0 && (
          <p className="text-slate-400">No bookings yet.</p>
        )}

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-slate-800 rounded-xl p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-semibold">
                    {booking.propertyId?.title || 'Property'}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    {new Date(booking.scheduledAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                  {booking.notes && (
                    <p className="text-slate-500 text-sm mt-2">{booking.notes}</p>
                  )}
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
                    statusColors[booking.status] || 'bg-slate-600 text-slate-300'
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyBookings;