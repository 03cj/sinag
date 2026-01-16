const Intern = require('../models/interns');
const User = require('../models/user');

exports.getAdviserForStudent = async (req, res) => {
  try {
    // 1️⃣ Find intern record
    const intern = await Intern.findOne({
      where: { user_id: req.user.id },
    });

    if (!intern) {
      return res.status(404).json({
        message: 'Intern record not found',
      });
    }

    // DEBUG (TEMPORARY)
    console.log('Intern program:', intern.program);

    // 2️⃣ Find adviser by role + program
    const adviser = await User.findOne({
      where: {
        role: 'Adviser', // MUST MATCH DB EXACTLY
        program: intern.program,
      },
    });

    if (!adviser) {
      return res.status(404).json({
        message: 'No adviser found for this program',
      });
    }

    // 3️⃣ Return adviser
    return res.json({
      adviserName: `${adviser.firstName} ${adviser.lastName}`,
    });
  } catch (err) {
    console.error('Adviser fetch error:', err);
    return res.status(500).json({
      message: 'Server error',
    });
  }
};
exports.getProgramsForAdviser = async (req, res) => {
  try {
    const { role, id } = req.user;

    // 🟢 COORDINATOR: see ALL programs
    if (role === 'coordinator') {
      const programs = await User.findAll({
        where: {
          role: 'Adviser',
          program: { [require('sequelize').Op.not]: null },
        },
        attributes: ['program'],
        group: ['program'],
        order: [['program', 'ASC']],
      });

      return res.json(programs.map((p) => p.program));
    }

    // 🟡 ADVISER: see own program only
    if (role === 'Adviser') {
      const adviser = await User.findByPk(id, {
        attributes: ['program'],
      });

      if (!adviser || !adviser.program) return res.json([]);

      return res.json([adviser.program]);
    }

    // 🔴 Others: no access
    return res.status(403).json({ message: 'Not allowed' });
  } catch (err) {
    console.error('Program fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
