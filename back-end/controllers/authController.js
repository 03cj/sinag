/* eslint-env node */
const authService = require('../services/authService');
const userService = require('../services/userService');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Company = require('../models/company');
const { get } = require('../routes/auth');

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

    console.log('🔍 Change password request received');
    console.log('User ID from token:', userId);
    console.log('Body:', req.body);

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Found user:', user.email);
    console.log('Stored hash:', user.passwordHash);

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('New hash will be:', hashedPassword);

    await user.update({ passwordHash: hashedPassword });

    console.log('✅ Password updated successfully in DB');

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    next(err);
  }
}

// intern
async function addIntern(req, res, next) {
  try {
    const { firstName, lastName, email, password, program, studentId } = req.body;

    if (!firstName || !lastName || !email || !password || !program || !studentId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await authService.addIntern({
      firstName,
      lastName,
      email,
      password,
      program,
      studentId,
    });

    res.status(201).json({
      message: 'Intern account created successfully',
      user: {
        id: result.user.id,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        email: result.user.email,
        studentId: result.user.studentId,
        department: result.user.department,
        role: 'Intern',
      },
    });
  } catch (err) {
    next(err);
  }
}
async function getInterns(req, res) {
  try {
    // Fetch all interns
    const interns = await User.findAll({
      where: { role: 'Intern' },
      attributes: ['id', 'firstName', 'lastName', 'mi', 'email', 'studentId', 'department'],
    });

    // Fetch all advisers
    const advisers = await User.findAll({
      where: { role: 'Adviser' },
      attributes: ['id', 'firstName', 'lastName', 'department'],
    });

    // Map advisers by department
    const advisersByDept = {};
    advisers.forEach((a) => {
      if (!advisersByDept[a.department]) advisersByDept[a.department] = [];
      advisersByDept[a.department].push(a);
    });

    // Format interns
    const formattedInterns = interns.map((i) => {
      const deptAdvisers = advisersByDept[i.department] || [];
      const adviserName =
        deptAdvisers.length > 0 ? `${deptAdvisers[0].firstName} ${deptAdvisers[0].lastName}` : 'Assign Adviser';

      return {
        studNo: i.studentId || i.id || 'N/A',
        lastname: i.lastName || 'N/A',
        firstname: i.firstName || 'N/A',
        mi: i.mi || '',
        email: i.email || 'N/A',
        program: i.department || 'N/A', // map department to program
        adviser: adviserName,
        company: 'NA', // fill if you join company later
        supervisor: 'NA',
        status: 'N/A',
      };
    });

    res.status(200).json(formattedInterns);
  } catch (err) {
    console.error('Error fetching interns:', err);
    res.status(500).json({ message: 'Failed to fetch interns' });
  }
}

//company
async function addCompany(req, res, next) {
  try {
    const { name, email, supervisorName, address, natureOfBusiness, moaStart, moaEnd, initialPassword } = req.body;
    const moaFile = req.file ? req.file.filename : null; // multer stores file info in req.file

    // Only required fields validation (exclude MOA file)
    if (
      !name ||
      !email ||
      !supervisorName ||
      !address ||
      !natureOfBusiness ||
      !moaStart ||
      !moaEnd ||
      !initialPassword
    ) {
      return res.status(400).json({ message: 'All required fields except MOA file must be filled.' });
    }

    const result = await authService.addCompany({
      name,
      email,
      supervisorName,
      address,
      natureOfBusiness,
      moaStart,
      moaEnd,
      moaFile,
      password: initialPassword,
    });

    res.status(201).json({
      message: result.message,
      company: result.company,
    });
  } catch (err) {
    console.error('Error adding company:', err);
    next(err);
  }
}

async function getHTE(req, res, next) {
  try {
    const HTE = await Company.findAll(); // fetch all HTE
    res.status(200).json(HTE);
  } catch (err) {
    console.error('Error fetching HTE:', err);
    res.status(500).json({ message: 'Failed to fetch HTE' });
  }
}

async function getCompanyProfile(req, res, next) {
  try {
    const companyId = req.user.id; // from token

    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    return res.json({
      supervisorName: company.supervisorName,
      companyName: company.name,
      natureOfBusiness: company.natureOfBusiness,
      email: company.email,
    });
  } catch (err) {
    next(err);
  }
}

async function updateCompanyProfile(req, res, next) {
  try {
    const companyId = req.user.id;
    const { supervisorName, companyName, natureOfBusiness } = req.body;

    const company = await Company.findByPk(companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    company.supervisorName = supervisorName || company.supervisorName;
    company.name = companyName || company.name;
    company.natureOfBusiness = natureOfBusiness || company.natureOfBusiness;

    await company.save();

    res.json({ message: 'Company profile updated successfully', company });
  } catch (err) {
    console.error('Update Company Profile Error:', err);
    next(err);
  }
}

// ... export at the bottom
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
  addCompany,
  getHTE,
  getCompanyProfile,
  updateCompanyProfile,
};
