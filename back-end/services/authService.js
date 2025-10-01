/* eslint-env node */
const bcrypt = require('bcryptjs');
const userService = require('./userService');
const jwtUtil = require('../utils/jwt');

async function signup({ firstName, lastName, email, password, role }) {
  const existing = await userService.findByEmail(email);
  if (existing) {
    const err = new Error('User already exists');
    err.status = 409;
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userService.createUser({ firstName, lastName, email, passwordHash, role });
  const token = jwtUtil.sign({ id: user.id, email: user.email, role: user.role });
  return { message: 'User created', token };
}

async function login({ email, password }) {
  const user = await userService.findByEmail(email);
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const token = jwtUtil.sign({ id: user.id, email: user.email, role: user.role });
  return { message: 'Logged in', token };
}

module.exports = { signup, login };
