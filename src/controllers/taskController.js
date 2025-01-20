const dbConnection = require('../config/database');
const Task = require('../models/task');


// Add a new task
exports.addTask = async (req, res) => {
    console.log('Request received:', req.body)
    const { userId, date, task_info, status = 'pending', priority = 'medium' } = req.body;

    // Validate required fields
    if (!userId || !date || !task_info) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Inserting task with data:', { userId, date, task_info, status, priority });

    try {
        // Use Sequelize's create method to insert a new task
        const newTask = await Task.create({
            user_id: userId,
            date,
            task_info,
            status,
            priority,
        });

        console.log('Task added successfully:', newTask);
        res.status(201).json({
            message: 'Task added successfully',
            task: newTask, // Send the created task details as the response
        });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ error: 'Failed to add task' });
    }
};

// Fetch all tasks for a specific user
exports.getTasks = (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    const query = `
        SELECT * FROM tasks
        WHERE user_id = ?;
    `;

    dbConnection.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching tasks:', err);
            return res.status(500).json({ error: 'Failed to fetch tasks' });
        }
        res.status(200).json(results);
    });
};

console.log(Task.associations); // Should show `user` association