/* eslint-env node */
const { verify } = require('../utils/jwt');

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;

  // 1. Check for token presence
  if (!auth || !auth.startsWith('Bearer ')) {
    // Log the attempt to access a protected route without a token
    console.warn('Unauthorized access attempt: Missing or invalid Authorization header.');
    return res.status(401).json({ message: 'Missing token' });
  }

  const token = auth.split(' ')[1];

  try {
    const payload = verify(token);

    // 2. Attach clean, relevant user data to the request object
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      // Use logical OR for safe access, as 'department' might be undefined for some roles (e.g., Coordinator)
      department: payload.department || null,
    };

    next(); // Proceed to the protected controller
  } catch (error) {
    // ⭐ CRITICAL FIX: Ensure the catch block returns the response
    // to prevent execution from falling through to the next route/middleware.

    console.error('Token verification failed:', error.message);

    // Return 401 response and stop the request chain
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
