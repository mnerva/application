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

// Controller method to fetch weekly tasks
exports.getWeeklyTasks = async (req, res) => {
    const { userId } = req.params;
    const { formattedDate } = req.query;

    if (!userId || !formattedDate) {
        return res.status(400).json({ error: 'Missing userId or formattedDate' });
    }

    try {
        const query = `
            SELECT * FROM tasks
            WHERE user_id = :userId AND yearweek(date, 1) = yearweek(:formattedDate, 1);
        `;
        const tasks = await dbConnection.query(query, {
            replacements: { userId, formattedDate },
            type: dbConnection.QueryTypes.SELECT,
        });

        res.status(200).json(tasks); // Return tasks as JSON
    } catch (error) {
        console.error('Error fetching weekly tasks:', error);
        res.status(500).json({ error: 'Failed to fetch weekly tasks' });
    }
};

exports.deleteTask = (req, res) => {
    console.log("Req params: ", req.params)
    const taskId = Number(req.params.taskId);

    if (!taskId || isNaN(taskId)) {
        return res.status(400).json({ error: 'Invalid task ID' });
    }

    const query = `DELETE FROM tasks WHERE task_id = ${taskId}`;

    try {
        dbConnection.query(query, [taskId], (err, result) => {
            if (err) {
                console.error('Error deleting task:', err)
                return res.status(500).json({ error: 'Failed to delete task'});
            }
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.status(200).json({ message: 'Task deleted successfully'})
            console.log('1 Response sent back to frontend');
        });
        res.status(200).json({ message: 'Task deleted successfully'})
        console.log('2 Response sent back to frontend');
    } catch (error) {
        console.error('Unexpected Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

console.log(Task.associations); // Should show `user` association