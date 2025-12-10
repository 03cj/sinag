// src/Components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles = [] }) {
  const token = localStorage.getItem('token');
  let role = (localStorage.getItem('role') || '').toLowerCase();

  // 🟢 Map company accounts to supervisor (if they exist)
  const roleAlias = {
    company: 'supervisor',
  };
  role = roleAlias[role] || role;

  // 🚫 No token or no role → must login
  if (!token || !role) {
    localStorage.clear(); // ensure no stale session
    return <Navigate to="/pup-sinag" replace />;
  }

  // 🚫 Role exists but not allowed for this route
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/pup-sinag" replace />;
  }

  // 🟢 Authorized → render nested route
  return <Outlet />;
}
