const Sequelize = require('sequelize');

const db = new Sequelize('application', 'root', 'qwerty', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = db;