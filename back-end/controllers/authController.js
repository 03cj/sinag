/* eslint-env node */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Intern = require('../models/interns');
const Company = require('../models/company');

const JWT_SECRET = process.env.JWT_SECRET;

/* =========================
   HELPER: SIGN JWT
========================= */
const signToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

/* =========================
   AUTH: SIGNUP (Coordinator)
========================= */
exports.signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await User.findOne({
      where: { email: email.toLowerCase() },
    });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      mi: '',
      email: email.toLowerCase(),
      passwordHash,
      role: 'Coordinator',
    });

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      department: user.department,
      type: 'user',
    });

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

/* =========================
   AUTH: LOGIN (User + HTE)
========================= */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    /* ---- TRY USER LOGIN ---- */
    const user = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (user) {
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role,
        department: user.department,
        type: 'user',
      });

      return res.json({ token });
    }

    /* ---- TRY COMPANY (HTE) LOGIN ---- */
    const company = await Company.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!company) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, company.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken({
      id: company.id,
      email: company.email,
      role: 'HTE',
      type: 'company',
    });

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

/* =========================
   ADD INTERN (FINAL VERSION)
========================= */
exports.addIntern = async (req, res, next) => {
  try {
    const { firstName, lastName, mi, email, studentId, program, initialPassword } = req.body;

    if (!firstName || !lastName || !email || !studentId || !program || !initialPassword) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await User.findOne({
      where: { email: email.toLowerCase() },
    });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(initialPassword, 10);

    const user = await User.create({
      firstName,
      lastName,
      mi: mi || '',
      email: email.toLowerCase(),
      passwordHash,
      role: 'Intern',
      studentId,
    });

    await Intern.create({
      user_id: user.id,
      program,
      status: 'Pending',
    });

    res.status(201).json({
      message: 'Intern added successfully',
    });
  } catch (err) {
    console.error('❌ ADD INTERN ERROR:', err);
    next(err);
  }
};

/* =========================
   GET INTERNS (JOINED DATA)
========================= */
exports.getInterns = async (req, res, next) => {
  try {
    const interns = await Intern.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'studentId'],
        },
        {
          model: Company,
          attributes: ['name'],
          required: false,
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json(interns);
  } catch (err) {
    next(err);
  }
};

/* =========================
   USER PROFILE
========================= */
exports.me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['passwordHash'] },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    await User.update(req.body, { where: { id: req.user.id } });
    res.json({ message: 'Profile updated' });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);
    const match = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!match) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated' });
  } catch (err) {
    next(err);
  }
};

/* =========================
   COMPANY / HTE
========================= */
exports.addCompany = async (req, res, next) => {
  try {
    const { name, email, address, natureOfBusiness, supervisorName, moaStart, moaEnd, initialPassword } = req.body;

    const password = await bcrypt.hash(initialPassword, 10);

    await Company.create({
      name,
      email: email.toLowerCase(),
      address,
      natureOfBusiness,
      supervisorName,
      moaStart,
      moaEnd,
      moaFile: req.file?.filename || null,
      password,
    });

    res.status(201).json({ message: 'Company added' });
  } catch (err) {
    next(err);
  }
};

exports.getHTE = async (req, res, next) => {
  try {
    const companies = await Company.findAll({
      attributes: { exclude: ['password'] },
    });
    res.json(companies);
  } catch (err) {
    next(err);
  }
};

/* =========================
   GET ADVISERS
========================= */
exports.getAdvisers = async (req, res, next) => {
  try {
    const advisers = await User.findAll({
      where: { role: 'Adviser' },
      attributes: ['id', 'firstName', 'lastName', 'mi', 'email'],
      order: [['lastName', 'ASC']],
    });

    res.json(advisers);
  } catch (err) {
    next(err);
  }
};
