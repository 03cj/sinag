/* eslint-env node */
const bcrypt = require('bcryptjs');
const userService = require('./userService');
const companyService = require('./companyService');
const jwtUtil = require('../utils/jwt');

/**
 * Coordinator Signup
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
    type: 'user',
  });

  return { message: 'User created successfully', token };
}

/**
 * Add Adviser Account
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
 * Add Intern Account
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
 * Add Company Account (Supervisor-level Access)
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
  const existing = await companyService.getCompanyByEmail(email);
  if (existing) throw new Error('Company already exists');

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
    password: passwordHash,
  });

  return { message: 'Company created successfully', company };
}

/**
 * LOGIN SERVICE
 * Checks Users table first, then Company table
 */
async function login({ email, password }) {
  console.log('🔐 Login attempt:', email);

  /** 1️⃣ Try USER login */
  const user = await userService.findByEmail(email);
  if (user) {
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new Error('Invalid credentials');

    const token = jwtUtil.sign({
      id: user.id,
      email: user.email,
      role: user.role,
      type: 'user',
      department: user.department || null,
    });

    return {
      message: 'Logged in',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        type: 'user',
        department: user.department || null,
      },
    };
  }

  /** 2️⃣ Try COMPANY login */
  const company = await companyService.getCompanyByEmail(email);
  if (company) {
    const match = await bcrypt.compare(password, company.password);
    if (!match) throw new Error('Invalid credentials');

    // COMPANY ACCOUNTS ARE SUPERVISORS
    const token = jwtUtil.sign({
      id: company.id,
      email: company.email,
      role: 'supervisor',
      type: 'company',
      supervisorName: company.supervisorName,
      companyName: company.name,
    });

    return {
      message: 'Logged in',
      token,
      user: {
        id: company.id,
        email: company.email,
        role: 'supervisor',
        type: 'company',
        supervisorName: company.supervisorName,
        companyName: company.name,
      },
    };
  }

  /** 3️⃣ No match */
  throw new Error('Invalid credentials');
}

module.exports = {
  signup,
  login,
  addAdviser,
  addIntern,
  addCompany,
};
