import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

function Navbar() {
  const { user, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-slate-800 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/properties" className="text-white font-bold text-lg">
          RealEstateMS
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/properties" className="text-slate-300 hover:text-white transition">
            Browse
          </Link>

          {accessToken ? (
            <>
              <Link to="/bookings" className="text-slate-300 hover:text-white transition">
                My Bookings
              </Link>
              <Link to="/dashboard" className="text-slate-300 hover:text-white transition">
                Dashboard
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin/approvals"
                  className="text-slate-300 hover:text-white transition"
                >
                  Approvals
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-slate-300 hover:text-white transition"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-300 hover:text-white transition">
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;