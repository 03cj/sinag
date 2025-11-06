/* eslint-env node */
const authService = require('../services/authService');
const userService = require('../services/userService');

async function addAdviser(req, res, next) {
  try {
    // Only coordinators or admins can create advisers
    const creatorRole = req.user.role;
    if (creatorRole !== 'Coordinator' && creatorRole !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized to create adviser accounts' });
    }

    const { firstName, lastName, employeeId, department, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Use the renamed service function
    const result = await authService.addAdviser({
      firstName,
      lastName,
      email,
      password,
      department,
      employeeId,
    });

    res.status(201).json({
      message: 'Adviser account created successfully',
      user: {
        id: result.user.id,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        email: result.user.email,
        department: result.user.department,
        employeeId: result.user.employeeId,
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
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await userService.findByEmail(req.user.email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const userObj = user.toJSON();
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

    const userObj = updatedUser.toJSON();
    delete userObj.passwordHash;

    res.json({ message: 'Profile updated successfully', user: userObj });
  } catch (err) {
    next(err);
  }
}

// 🆕 ADD THIS FUNCTION HERE
async function getAdvisers(req, res, next) {
  try {
    const advisers = await userService.getAdvisers();
    res.status(200).json(advisers);
  } catch (err) {
    console.error('Error fetching advisers:', err);
    res.status(500).json({ message: 'Failed to fetch advisers' });
  }
}

// ✅ Export all controllers
module.exports = {
  signup,
  login,
  me,
  updateProfile,
  addAdviser,
  getAdvisers,
};
