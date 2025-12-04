/* eslint-env node */
const { verify } = require('../utils/jwt');

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing token' }); // 1. Missing Header
  const token = auth.split(' ')[1];
  try {
    const payload = verify(token); // 2. Calls verify from utils/jwt
    req.user = payload;
    next(); // Success
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' }); // 3. Failed Verification
  }
}

module.exports = authMiddleware;
