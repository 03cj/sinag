import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const LogIn = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  function saveToken(token) {
    try {
      const g = typeof globalThis !== 'undefined' ? globalThis : null;
      if (g && g.localStorage) g.localStorage.setItem('token', token);
    } catch (e) {
      console.warn('Could not save token to localStorage', e);
    }
  }
  const capitalize = role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : 'User';

const handleLogin = (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  const form = e.target;
  const email = form.querySelector('input[type="email"]').value;
  const password = form.querySelector('input[type="password"]').value;

  (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const body = (await (res.headers.get('content-type') || '').includes('application/json'))
        ? await res.json()
        : {};

      if (!res.ok) throw new Error(body.message || `Login failed (${res.status})`);

      // ✅ Save token and show success
      saveToken(body.token);
      setMessage(`${body.user.role} logged in successfully!`);

      // ✅ Redirect based on user role
        if (body.user && body.user.role) {
          const userRole = body.user.role.toLowerCase();

          if (userRole === 'coordinator') {
            navigate('/pup-sinag/coordinator');
          } else if (userRole === 'student') {
            navigate('/pup-sinag/student');
          } else if (userRole === 'intern') {
            navigate('/pup-sinag/intern');
          } else if (userRole === 'adviser') {
            navigate('/pup-sinag/adviser');
          } else {
            console.warn('Unknown role:', body.user.role);
            navigate('/pup-sinag');
          }
        }

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed (network error)');
    } finally {
      setLoading(false);
    }
  })();
};

  const handleForgotPassword = () => {
    navigate(`/forgot-password`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-20 rounded-xl shadow-xl w-full max-w-md mb-20">
        <h1 className="text-2xl font-bold text-red-900 mb-6 text-center">{capitalize} Login your Account</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-900 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-red-900 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        <div className="mt-4 text-center">
          <button onClick={handleForgotPassword} className="text-sm text-red-900 font-semibold hover:underline mb-2">
            Forgot Password?
          </button>

          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate(`/pup-sinag/sign-up`)}
              className="text-red-900 font-semibold hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
