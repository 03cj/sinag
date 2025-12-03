/* eslint-env node */
const bcrypt = require('bcryptjs');
const userService = require('./userService');
const jwtUtil = require('../utils/jwt');

/**
 * Coordinator self-signup
 */
async function signup({ firstName, lastName, email, password }) {
  const existing = await userService.findByEmail(email);
  if (existing) throw new Error('User already exists');

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await userService.createUser({
    firstName,
    lastName,
    email,
    passwordHash,
    role: 'Coordinator',
  });

  const token = jwtUtil.sign({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { message: 'User created', token };
}

/**
 * Coordinator adds Adviser
 */
async function addAdviser({ firstName, lastName, email, password, department, employeeId }) {
  const existing = await userService.findByEmail(email);
  if (existing) throw new Error('User already exists');

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await userService.createUser({
    firstName,
    lastName,
    email,
    passwordHash,
    department,
    employeeId,
    role: 'Adviser',
  });

  return { message: 'Adviser created successfully', user };
}

/**
 * Adviser adds Intern
 */
async function addIntern({ firstName, lastName, email, password, program, studentId }) {
  const existing = await userService.findByEmail(email);
  if (existing) throw new Error('User already exists');

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await userService.createUser({
    firstName,
    lastName,
    email,
    passwordHash,
    role: 'Intern',
    department: program,
    studentId,
  });

  return { message: 'Intern created successfully', user };
}

/**
 * Login existing user
 */
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

  // JWT with user info
  const token = jwtUtil.sign({
    id: user.id,
    email: user.email,
    role: user.role,
    department: user.department,
  });

  // Return a clean, safe object — NOT a model instance
  const cleanUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    department: user.department,
    employeeId: user.employeeId || null,
    studentId: user.studentId || null,
    contactNumber: user.contactNumber || null,
  };

  return {
    message: 'Logged in',
    token,
    user: cleanUser,
  };
}

module.exports = { signup, login, addAdviser, addIntern };
