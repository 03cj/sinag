import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

import sinagLogo from '/PUP-SINAG.png';
import pupSeal from '/pup_1904.png';

const BASE_PATH = '/pup-sinag';

const LogIn = () => {
  // --- HOOKS ---
  const navigate = useNavigate();
  const { login } = useAuth();

  // --- STATE ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- API ---
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // --- LOGIN HANDLER ---
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

      // ✅ SAVE TOKEN
      login(data.token);

      // ✅ DECODE ROLE FROM JWT (THIS IS THE FIX)
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      const role = payload.role.toLowerCase();

      localStorage.setItem('role', role);

      // ✅ ROLE-BASED REDIRECT
      if (role === 'superadmin') {
        navigate(`${BASE_PATH}/superadmin`, { replace: true });
      } else if (role === 'coordinator') {
        navigate(`${BASE_PATH}/coordinator`, { replace: true });
      } else if (role === 'adviser') {
        navigate(`${BASE_PATH}/adviser`, { replace: true });
      } else if (role === 'intern') {
        navigate(`${BASE_PATH}/intern`, { replace: true });
      } else if (role === 'supervisor') {
        navigate(`${BASE_PATH}/supervisor`, { replace: true });
      } else {
        navigate(BASE_PATH, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Unable to login. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- LEFT PANEL GRADIENT ---
  const leftPanelGradient = `
    linear-gradient(
      to bottom,
      #FFE066 0%,
      #FFF2B3 38%,
      #FFFFFF 65%,
      #F7EAEA 80%,
      #EAD1D1 92%,
      #E0BFBF 100%
    )
  `;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: `linear-gradient(to right, #FFE066 0%, #FFF2B3 30%, #FFFFFF 50%, #F5F5F0 70%, #EAD1D1 85%, #E0BFBF 100%)` }}>
      {/* LEFT PANEL */}
      <div
        className="hidden lg:flex w-full lg:w-1/2 items-center justify-center text-[#5E0000] shadow-inner"
        style={{ background: 'transparent' }}
      >
        <div className="max-w-lg mx-auto flex flex-col items-center gap-6 px-4 sm:px-6 -translate-y-8">
          <h2 className="text-base sm:text-lg font-bold text-center whitespace-normal">
            PUP System for Internship Navigation and Guidance
          </h2>
          <img src={sinagLogo} alt="PUP SINAG Logo" className="w-[200px] sm:w-[280px] lg:w-[380px] h-auto drop-shadow-xl" />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-transparent py-8 sm:py-12 lg:py-0">
        <div className="w-full max-w-md px-4 sm:px-8 lg:px-12">
          {/* GLASS EFFECT CONTAINER */}
          <div className="p-6 sm:p-8 rounded-2xl backdrop-blur-sm bg-white/25 border border-white/30 shadow-lg">
            <div className="flex justify-center mb-4 sm:mb-6">
              <img src={pupSeal} alt="PUP Seal" className="w-16 sm:w-20 h-auto" />
            </div>

            <h1 className="text-lg sm:text-xl font-semibold text-center text-gray-700 mb-6 sm:mb-8">Login your PUP SINAG Account</h1>

            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 sm:px-5 py-2.5 sm:py-3 border-2 border-gray-300 rounded-full focus:ring-2 focus:ring-[#8B0000] bg-white/80 text-sm sm:text-base"
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 sm:px-5 py-2.5 sm:py-3 border-2 border-gray-300 rounded-full focus:ring-2 focus:ring-[#8B0000] pr-16 sm:pr-20 bg-white/80 text-sm sm:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-5 flex items-center text-xs sm:text-sm text-gray-500 hover:text-[#8B0000]"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8B0000] text-[#FFD700] font-bold py-2.5 sm:py-3 text-base sm:text-lg rounded-full hover:bg-[#6A0000] transition disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              {error && <p className="text-xs sm:text-sm text-red-600 text-center">{error}</p>}
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <button className="text-xs sm:text-sm text-gray-700 hover:text-[#8B0000] hover:underline">Forgot Password</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
