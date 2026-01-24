const { Supervisor } = require('../models');

// Get all supervisors for the current company
exports.getCompanySupervisors = async (req, res) => {
  try {
    const supervisors = await Supervisor.findAll({
      where: { company_id: req.user.id },
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });
    res.json(supervisors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch supervisors' });
  }
};

// Add a new supervisor for the current company
exports.addCompanySupervisor = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Supervisor name is required' });
    }
    // Generate a placeholder email (must be unique)
    const email = `${name.trim().toLowerCase().replace(/\s+/g, '')}${req.user.id}@placeholder.com`;
    const supervisor = await Supervisor.create({
      name: name.trim(),
      company_id: req.user.id,
      email,
    });
    res.status(201).json({ id: supervisor.id, name: supervisor.name });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add supervisor' });
  }
};
