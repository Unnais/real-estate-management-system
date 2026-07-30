import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 rounded-xl p-8 w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-white text-center">Create account</h1>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded-lg bg-slate-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg bg-slate-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Password (min 8 chars, 1 number, 1 symbol)"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full rounded-lg bg-slate-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full rounded-lg bg-slate-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="customer">Customer</option>
          <option value="owner">Property Owner</option>
          <option value="agent">Agent</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 transition disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="text-slate-400 text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;