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
    role: 'Coordinator' // Force coordinator role
  });

  const token = jwtUtil.sign({ id: user.id, email: user.email, role: user.role });
  return { message: 'User created', token };
}

/**
 * Coordinator adds an Adviser account
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
    role: 'Adviser' // Fixed adviser role
  });

  return { message: 'Adviser created successfully', user };
}

/**
 * Adviser adds an Intern account
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
    department: program,   // store program in department
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

  const token = jwtUtil.sign({ id: user.id, email: user.email, role: user.role });
  return {
    message: 'Logged in',
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}

module.exports = { signup, login, addAdviser, addIntern };
