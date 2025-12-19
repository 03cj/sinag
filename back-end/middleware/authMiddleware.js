/* eslint-env node */
const { verify } = require('../utils/jwt');

/**
 * Authentication & Authorization Middleware
 *
 * Usage:
 *  - router.use(authMiddleware())
 *  - router.use(authMiddleware(['SuperAdmin']))
 */
function authMiddleware(allowedRoles = []) {
  // normalize roles
  const roles = Array.isArray(allowedRoles) ? allowedRoles : typeof allowedRoles === 'string' ? [allowedRoles] : [];

  // RETURN REAL MIDDLEWARE
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 1. Check header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Missing or invalid authorization header',
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      // 2. Verify token
      const payload = verify(token);

      if (!payload?.id || !payload?.role) {
        return res.status(401).json({
          message: 'Invalid token payload',
        });
      }

      // 3. Attach user
      req.user = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        department: payload.department || null,
        type: payload.type || 'user',
      };

      // 4. Role check
      if (roles.length && !roles.includes(payload.role)) {
        return res.status(403).json({
          message: 'Access denied',
        });
      }

      // 5. Continue
      next();
    } catch (err) {
      console.error('Auth middleware error:', err);
      return res.status(401).json({
        message: 'Invalid or expired token',
      });
    }
  };
}

module.exports = authMiddleware;
