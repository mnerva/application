const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    const { email, username } = req.body;
    const emailExists = await User.findOne({ where: { email }})
    const usernameExists = await User.findOne({ where: { username }})
    if (emailExists) {
      res.status(401).json({ message: 'User with this email already exists'});
    } else if (usernameExists) {
      res.status(401).json({ message: 'User with this username already exists'})
    } else {
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  }
};

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed 1' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log(password)
        console.log(user.password)
        return res.status(401).json({ message: 'Authentication failed 2' });
      }
      const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
      res.status(200).json({ message: 'Authentication successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  };