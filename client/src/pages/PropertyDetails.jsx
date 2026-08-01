import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropertyById } from '../services/propertyService';
import { createBooking } from '../services/bookingService';

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await getPropertyById(id);
        setProperty(res.data.data);
      } catch (err) {
        setError('Property not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    setSubmitting(true);

    try {
      await createBooking({ propertyId: id, scheduledAt, notes });
      setBookingSuccess(true);
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-red-400">{error || 'Property not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <Link to="/properties" className="text-purple-400 hover:underline text-sm">
          ← Back to listings
        </Link>

        <div className="h-72 bg-slate-800 rounded-xl mt-4 overflow-hidden flex items-center justify-center">
          {property.images?.[0] ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-slate-500">No image</span>
          )}
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-bold text-white">{property.title}</h1>
          <p className="text-purple-400 text-2xl font-semibold mt-2">
            ₹{property.price?.toLocaleString('en-IN')}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Type</p>
              <p className="text-white capitalize">{property.type}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Area</p>
              <p className="text-white">{property.areaSqft} sqft</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Status</p>
              <p className="text-white capitalize">{property.status}</p>
            </div>
          </div>

          {property.amenities?.length > 0 && (
            <div className="mt-6">
              <p className="text-slate-400 text-sm mb-2">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="bg-slate-800 text-slate-300 text-sm px-3 py-1 rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="mt-8 w-full sm:w-auto rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 transition"
          >
            Book a Visit
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-sm">
            {bookingSuccess ? (
              <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-2">Visit requested!</h2>
                <p className="text-slate-400 text-sm mb-4">
                  We've notified the owner/agent. You'll be updated on the status.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-lg bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 transition"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <h2 className="text-xl font-bold text-white">Book a visit</h2>

                {bookingError && (
                  <p className="text-red-400 text-sm">{bookingError}</p>
                )}

                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  required
                  className="w-full rounded-lg bg-slate-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                />

                <textarea
                  placeholder="Notes (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg bg-slate-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white py-2 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white py-2 transition disabled:opacity-50"
                  >
                    {submitting ? 'Booking...' : 'Confirm'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyDetails;