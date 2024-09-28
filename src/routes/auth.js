const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route example
router.get('/protected', auth, (req, res) => {
  res.json({ message: 'This is a protected route', userData: req.userData });
});

module.exports = router;