const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc  Admin login
// @route POST /api/admin/login
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      token: generateToken(admin._id),
      admin: { id: admin._id, username: admin.username, email: admin.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  One-time admin setup (run once)
// @route POST /api/admin/setup
const setupAdmin = async (req, res) => {
  try {
    const exists = await Admin.findOne({});
    if (exists) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }
    const admin = new Admin({
      username: 'admin',
      password: 'VijayCanteen@2024',
      email: 'admin@vijaycanteen.com'
    });
    await admin.save();
    res.status(201).json({
      success: true,
      message: 'Admin created. Username: admin | Password: VijayCanteen@2024'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get admin profile
// @route GET /api/admin/profile
const getAdminProfile = async (req, res) => {
  res.json({ success: true, admin: req.admin });
};

module.exports = { loginAdmin, setupAdmin, getAdminProfile };
