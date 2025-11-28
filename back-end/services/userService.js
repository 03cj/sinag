/* eslint-env node */
const User = require('../models/user');

async function findByEmail(email) {
  return User.findOne({ where: { email: String(email).toLowerCase() } });
}

async function createUser({ firstName, lastName, email, passwordHash, role, department, employeeId, studentId }) {
  return User.create({
    firstName,
    lastName,
    email: String(email).toLowerCase(),
    passwordHash,
    role,
    department,
    employeeId,
    studentId,
  });
}


// 🔧 NEW FUNCTION: update user profile
async function updateUser(id, data) {
  const user = await User.findByPk(id);
  if (!user) return null;

  // update only allowed fields
  await user.update({
    contactNumber: data.contactNumber,
    department: data.department,
    employeeId: data.employeeId,
  });

  return user;
}

// 🔍 NEW FUNCTION: get all advisers
async function getAdvisers() {
  return User.findAll({
    where: { role: 'Adviser' },
    attributes: ['id', 'firstName', 'lastName', 'email', 'department', 'employeeId'],
  });
}


module.exports = { findByEmail, createUser, updateUser, getAdvisers };
