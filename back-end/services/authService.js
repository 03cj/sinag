/* eslint-env node */
const bcrypt = require('bcryptjs');
const userService = require('./userService');
const companyService = require('./companyService');
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
    role: 'Coordinator', // Force coordinator role
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
    role: 'Adviser', // Fixed adviser role
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
    department: program, // store program in department
    studentId,
  });

  return { message: 'Intern created successfully', user };
}

/**
 * Add a new company (with password hashing)
 */
async function addCompany({
  name,
  email,
  address,
  natureOfBusiness,
  supervisorName,
  moaStart,
  moaEnd,
  moaFile,
  password,
}) {
  // 🔒 hash password
  const passwordHash = await bcrypt.hash(password, 10);

  const company = await companyService.createCompany({
    name,
    email,
    address,
    natureOfBusiness,
    supervisorName,
    moaStart,
    moaEnd,
    moaFile,
    password: passwordHash, // store hashed password
  });

  return { message: 'Company created successfully', company };
}

async function login({ email, password }) {
  console.log('Login attempt:', email);

  // 1️⃣ Check users table
  const user = await userService.findByEmail(email);
  console.log('User found:', user ? user.email : 'none');

  if (user) {
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new Error('Invalid credentials');

    // 👇 VITAL FIX: Include user.department in the JWT payload
    const token = jwtUtil.sign({
      id: user.id,
      email: user.email,
      role: user.role,
      type: 'user',
      department: user.department, // ADDED THIS LINE
    });

    return {
      message: 'Logged in',
      token,
      user: { id: user.id, email: user.email, role: user.role, department: user.department, type: 'user' },
    };
  }

  // 2️⃣ Check companies table
  const company = await companyService.getCompanyByEmail(email);
  console.log('Company found:', company ? company.email : 'none');

  if (company) {
    const match = await bcrypt.compare(password, company.password); // hashed password
    if (!match) throw new Error('Invalid credentials');

    const token = jwtUtil.sign({ id: company.id, email: company.email, role: 'Company', type: 'company' });
    return {
      message: 'Logged in',
      token,
      user: { id: company.id, email: company.email, role: 'Company', type: 'company' },
    };
  }

  // 3️⃣ Not found
  throw new Error('Invalid credentials');
}

module.exports = { signup, login, addAdviser, addIntern, addCompany };
