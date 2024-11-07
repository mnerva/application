const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('account', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  timestamps: false // This line disables the createdAt and updatedAt fields
});
module.exports = User;
