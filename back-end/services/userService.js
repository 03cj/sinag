/* eslint-env node */
const User = require('../models/user');

async function findByEmail(email) {
  return User.findOne({ where: { email: String(email).toLowerCase() } });
}

async function createUser({ firstName, lastName, email, passwordHash, role }) {
  return User.create({ firstName, lastName, email: String(email).toLowerCase(), passwordHash, role });
}

module.exports = { findByEmail, createUser };
