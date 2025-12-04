import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import v from 'voca';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { role } = useParams();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // basic client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/signup`, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, role: role || 'intern' }),
        });
        const body = (await (res.headers.get('content-type') || '').includes('application/json'))
          ? await res.json()
          : {};
        if (!res.ok) {
          const msg = body && body.message ? body.message : `Signup failed (${res.status})`;
          throw new Error(msg);
        }
        if (body.token) saveToken(body.token);
        navigate('/pup-sinag');
      } catch (err) {
        console.error('Signup error:', err);
        setError(err.message || 'Signup failed (network error)');
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <form onSubmit={handleSubmit}>
        <div className="bg-white min-w-[500px] p-8 rounded-xl shadow-xl w-full max-w-md mt-10 mb-20">
          <h1 className="text-2xl font-bold text-red-900 mb-6 text-center">
            {' '}
            Sign Up{role ? ` for ${v.titleCase(role)}` : ''}
          </h1>
          <div className="flex flex-col items-center justify-center gap-4 ">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-900"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-900"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-900"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-900"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-900"
            />
            <button
              type="submit"
              className="w-full bg-red-900 text-white text-center py-4 px-6 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                loading ||
                !formData.firstName ||
                !formData.lastName ||
                !formData.email ||
                !formData.password ||
                !formData.confirmPassword
              }
            >
              {loading ? 'Registering...' : 'Register Account'}
            </button>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button onClick={() => navigate(`/pup-sinag`)} className="text-red-900 font-semibold hover:underline">
                Login
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
