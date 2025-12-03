/* eslint-env node */
const authService = require('../services/authService');
const userService = require('../services/userService');
const bcrypt = require('bcrypt');
const User = require('../models/user');

/**
 * Helper to safely convert any user (model instance or plain object)
 */
function safeUserObject(user) {
  if (!user) return user;

  // Sequelize instance → convert to plain object
  if (typeof user.get === 'function') {
    return user.get({ plain: true });
  }

  // Mongoose document → convert to JSON
  if (typeof user.toJSON === 'function') {
    return user.toJSON();
  }

  // Already a normal object
  return user;
}

async function addAdviser(req, res, next) {
  try {
    const creatorRole = req.user.role;
    if (creatorRole !== 'Coordinator' && creatorRole !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized to create adviser accounts' });
    }

    const { firstName, lastName, employeeId, department, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await authService.addAdviser({
      firstName,
      lastName,
      email,
      password,
      department,
      employeeId,
    });

    const user = safeUserObject(result.user);

    res.status(201).json({
      message: 'Adviser account created successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        department: user.department,
        employeeId: user.employeeId,
        role: 'Adviser',
      },
    });
  } catch (err) {
    next(err);
  }
}

async function signup(req, res, next) {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { user, token } = await authService.login(req.body);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'Lax',
    });

    const userObj = safeUserObject(user);

    delete userObj.passwordHash;

    res.status(200).json({ message: 'Login successful', user: userObj });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await userService.findByEmail(req.user.email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userObj = safeUserObject(user);
    delete userObj.passwordHash;

    res.json({ user: userObj });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { contactNumber, department, employeeId } = req.body;

    const updatedUser = await userService.updateUser(userId, {
      contactNumber,
      department,
      employeeId,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userObj = safeUserObject(updatedUser);
    delete userObj.passwordHash;

    res.json({ message: 'Profile updated successfully', user: userObj });
  } catch (err) {
    next(err);
  }
}

async function getAdvisers(req, res, next) {
  try {
    const advisers = await userService.getAdvisers();
    res.status(200).json(advisers);
  } catch (err) {
    console.error('Error fetching advisers:', err);
    res.status(500).json({ message: 'Failed to fetch advisers' });
  }
}

async function changePassword(req, res, next) {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ passwordHash: hashedPassword });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    next(err);
  }
}

async function addIntern(req, res, next) {
  try {
    const creatorRole = req.user.role;

    if (creatorRole !== 'Adviser') {
      return res.status(403).json({
        message: 'Unauthorized. Only Advisers can add intern accounts.',
      });
    }

    const adviserDepartment = req.user.department;
    const { firstName, lastName, email, password, studentId } = req.body;

    if (!firstName || !lastName || !email || !password || !studentId) {
      return res.status(400).json({
        message: 'Missing required fields: first name, last name, email, password, or student ID.',
      });
    }

    const result = await authService.addIntern({
      firstName,
      lastName,
      email,
      password,
      program: adviserDepartment,
      studentId,
    });

    const user = safeUserObject(result.user);

    res.status(201).json({
      message: 'Intern account created successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        role: 'Intern',
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getInterns(req, res, next) {
  try {
    const { department } = req.query;

    if (!department) {
      return res.status(400).json({ message: 'Department is required' });
    }

    const interns = await User.findAll({
      where: {
        role: 'Intern',
        department: department,
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'studentId', 'department', 'createdAt'],
    });

    res.status(200).json(interns);
  } catch (err) {
    console.error('Error fetching interns:', err);
    return res.status(500).json({ message: 'Failed to fetch interns' });
  }
}

module.exports = {
  signup,
  login,
  me,
  updateProfile,
  addAdviser,
  getAdvisers,
  changePassword,
  addIntern,
  getInterns,
};
