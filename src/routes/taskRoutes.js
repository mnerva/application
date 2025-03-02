const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Route to add a new task
router.post('/', taskController.addTask);

// Route to fetch all tasks for a specific user
router.get('/:userId', taskController.getTasks);

// Route to fetch tasks for a specific week
router.get('/:userId/week', taskController.getWeeklyTasks);

// Route to delete a specific task
router.delete('/:taskId', taskController.deleteTask);

router.put('/:taskId/complete', taskController.markTaskAsDone)

module.exports = router;
