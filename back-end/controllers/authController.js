/* eslint-env node */
const authService = require('../services/authService');
const userService = require('../services/userService');

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

module.exports = { signup, login, me };
