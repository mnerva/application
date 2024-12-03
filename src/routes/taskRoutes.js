const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Route to add a new task
router.post('/', taskController.addTask);

// Route to fetch all tasks for a specific user
router.get('/:userId', taskController.getTasks);

module.exports = router;
