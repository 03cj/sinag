// src/Components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const token = localStorage.getItem('token');
  const role = (localStorage.getItem('role') || '').toLowerCase();

  // 🚫 Not logged in
  if (!token || !role) {
    return <Navigate to="/pup-sinag" replace />;
  }

  // 🚫 Logged in but not allowed to access this route
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/pup-sinag" replace />;
  }

  // ✅ Access granted
  return children;
}
