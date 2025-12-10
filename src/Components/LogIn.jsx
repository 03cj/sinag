import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const LogIn = () => {
  const navigate = useNavigate();
  const { role } = useParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const capitalize = role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : 'User';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      // Save authentication details
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role.toLowerCase());

      // One-line role-based redirect
      navigate(`/pup-sinag/${data.user.role.toLowerCase()}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to login. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => navigate('/forgot-password');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-20 rounded-xl shadow-xl w-full max-w-md mb-20">
        <h1 className="text-2xl font-bold text-red-900 mb-6 text-center">{capitalize} Login your Account</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-900"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-900 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-900 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="text-sm text-red-600 mt-2 text-center">{error}</p>}

        {/* Bottom Links */}
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
