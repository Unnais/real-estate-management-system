import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">
            Welcome, {user?.name || 'User'}
          </h1>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 transition"
          >
            Log out
          </button>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <p className="text-slate-300">
            Role: <span className="text-purple-400 font-medium">{user?.role}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;