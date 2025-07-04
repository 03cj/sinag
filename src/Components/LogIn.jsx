import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const LogIn = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const [showPassword, setShowPassword] = useState(false);

  const allowedRoles = ['coordinator', 'adviser', 'intern', 'supervisor'];

  if (!allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-600 font-semibold">Invalid user role.</p>
      </div>
    );
  }

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    alert(`${capitalize(role)} logged in successfully!`);

    if (role === 'intern') {
      navigate('/intern/home');
    } else {
      navigate(`/${role}/dashboard`);
    }
  };

  const handleForgotPassword = () => {
    navigate(`/forgot-password`);
  };

  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md mb-20">
        <h1 className="text-2xl font-bold text-red-900 mb-6 text-center">
          {capitalize(role)} Login
        </h1>
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
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={handleForgotPassword}
            className="text-sm text-red-900 font-semibold hover:underline mb-2"
          >
            Forgot Password?
          </button>

          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate(`/signup/${role}`)}
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
