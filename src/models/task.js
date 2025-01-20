const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('./user');

const Task = db.define('task', {
    task_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    task_info: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.ENUM('pending', 'completed', 'canceled'),
        defaultValue: 'pending',
    },
    priority: {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium',
    },
}, {
    tableName: 'tasks',
    timestamps: false // This line disables the createdAt and updatedAt fields
});

// Define association
Task.belongsTo(User, { foreignKey: 'user_id' })
User.hasMany(Task, { foreignKey: 'user_id' });

module.exports = Task;