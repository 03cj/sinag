/* eslint-env node */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { literal } = require('sequelize');

const User = require('../models/user');
const Intern = require('../models/interns');
const Company = require('../models/company');

const JWT_SECRET = process.env.JWT_SECRET;

/* =========================
   HELPER: SIGN JWT
========================= */
const signToken = (payload) => {
  return jwt.sign(
    {
      ...payload,
      role: payload.role.toLowerCase(), // normalize role
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
};

/* =========================
   SIGNUP (Coordinator)
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
      type: 'user',
    });

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

/* =========================
   LOGIN (User + Company)
========================= */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // USER LOGIN
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
        type: 'user',
      });

      return res.json({ token });
    }

    // COMPANY / HTE LOGIN
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
      role: 'supervisor', // map HTE → supervisor
      type: 'company',
    });

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

/* =========================
   ADD COORDINATOR
========================= */
exports.addCoordinator = async (req, res, next) => {
  try {
    const { firstName, lastName, mi, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const coordinator = await User.create({
      firstName,
      lastName,
      mi: mi || '',
      email: email.toLowerCase(),
      passwordHash,
      role: 'Coordinator',
    });

    res.status(201).json({
      message: 'Coordinator added successfully',
      coordinator,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   ADVISERS
========================= */
exports.getAdvisers = async (req, res, next) => {
  try {
    const advisers = await User.findAll({
      where: { role: 'Adviser' },
      attributes: [
        'id',
        'firstName',
        'lastName',
        'mi',
        'email',
        'program',
        [
          literal(`(
            SELECT COUNT(*)
            FROM users AS u
            WHERE u.role = 'Intern'
            AND u.program = User.program
          )`),
          'interns',
        ],
      ],
      order: [['lastName', 'ASC']],
    });

    res.json(advisers);
  } catch (err) {
    next(err);
  }
};

exports.addAdviser = async (req, res, next) => {
  try {
    const { firstName, lastName, mi, email, program, password } = req.body;

    if (!firstName || !lastName || !email || !program || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const adviser = await User.create({
      firstName,
      lastName,
      mi: mi || '',
      email: email.toLowerCase(),
      passwordHash,
      role: 'Adviser',
      program,
    });

    res.status(201).json(adviser);
  } catch (err) {
    next(err);
  }
};

exports.updateAdviser = async (req, res, next) => {
  try {
    const adviser = await User.findByPk(req.params.id);
    if (!adviser || adviser.role !== 'Adviser') {
      return res.status(404).json({ message: 'Adviser not found' });
    }

    await adviser.update(req.body);
    res.json(adviser);
  } catch (err) {
    next(err);
  }
};

exports.deleteAdviser = async (req, res, next) => {
  try {
    const adviser = await User.findByPk(req.params.id);
    if (!adviser || adviser.role !== 'Adviser') {
      return res.status(404).json({ message: 'Adviser not found' });
    }

    await adviser.destroy();
    res.json({ message: 'Adviser deleted successfully' });
  } catch (err) {
    next(err);
  }
};

/* =========================
   INTERNS
========================= */
exports.addIntern = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      mi,
      email,
      studentId,
      program,
      initialPassword,
    } = req.body;

    if (!firstName || !lastName || !email || !studentId || !program || !initialPassword) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
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
      program,
    });

    await Intern.create({
      user_id: user.id,
      program,
      status: 'Pending',
    });

    res.status(201).json({ message: 'Intern added successfully' });
  } catch (err) {
    next(err);
  }
};

exports.getInterns = async (req, res, next) => {
  try {
    const interns = await Intern.findAll({
      include: [{ model: User }, { model: Company, required: false }],
      order: [['created_at', 'DESC']],
    });
    res.json(interns);
  } catch (err) {
    next(err);
  }
};

/* =========================
   COMPANY / HTE
========================= */
exports.addCompany = async (req, res, next) => {
  try {
    const {
      name,
      email,
      address,
      natureOfBusiness,
      supervisorName,
      moaStart,
      moaEnd,
      initialPassword,
    } = req.body;

    const passwordHash = await bcrypt.hash(initialPassword, 10);

    const company = await Company.create({
      name,
      email: email.toLowerCase(),
      address,
      natureOfBusiness,
      supervisorName,
      moaStart,
      moaEnd,
      moaFile: req.file?.filename || null,
      password: passwordHash,
    });

    res.status(201).json(company);
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

exports.updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'HTE not found' });
    }

    await company.update({
      ...req.body,
      email: req.body.email?.toLowerCase() || company.email,
      moaFile: req.file ? req.file.filename : company.moaFile,
    });

    res.json(company);
  } catch (err) {
    next(err);
  }
};

exports.deleteHTE = async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'HTE not found' });
    }

    await company.destroy();
    res.json({ message: 'HTE deleted successfully' });
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
    res.json({ message: 'Profile updated successfully' });
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
      return res.status(401).json({ message: 'Wrong current password' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};
