import { Link } from 'react-router-dom';

function PropertyCard({ property }) {
  return (
    <Link
      to={`/properties/${property._id}`}
      className="block bg-slate-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-purple-500 transition"
    >
      <div className="h-40 bg-slate-700 flex items-center justify-center overflow-hidden">
        {property.images?.[0] ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-slate-500 text-sm">No image</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold truncate">{property.title}</h3>
        <p className="text-purple-400 font-medium mt-1">
          ₹{property.price?.toLocaleString('en-IN')}
        </p>
        <p className="text-slate-400 text-sm mt-1 capitalize">{property.type}</p>
      </div>
    </Link>
  );
}

export default PropertyCard;