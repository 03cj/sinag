const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const { getAdviserForStudent } = require('../controllers/adviserController');

router.get('/my-adviser', authMiddleware(), getAdviserForStudent);

module.exports = router;
