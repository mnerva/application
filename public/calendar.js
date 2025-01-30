// Logout function
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

function calendar() {
    window.location.href = 'calendar.html';
}

function dashboard() {
    window.location.href = 'dashboard.html';
}

// Function to get user_id from the token
function getUserIdFromToken() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('No token found');
        return null; // No token, return null
    }

    const tokenParts = token.split('.')
    if (tokenParts.length !== 3) {
        console.error('Invalid token format');
        return null;
    }

    const payload = atob(tokenParts[1]); // Decode base64 payload
    console.log('Decoded Payload:', payload); // Log the decoded payload to inspect it

    try {
        const parsedPayload = JSON.parse(payload); // Parse the JSON payload
        console.log('Parsed Payload:', parsedPayload); // Log the parsed payload
        
        const userId = parsedPayload.userId;
        console.log('User ID:', userId); // Log the extracted user ID
        return userId;
    } catch (error) {
        console.error('Error parsing payload:', error);
        return null;
    }
}

function getDayTasks(formattedDate, userId) {
    const apiUrl = `http://localhost:3000/tasks/${userId}/week?formattedDate=${formattedDate}`;

    return fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((tasks) => {
            console.log('Weekly tasks:', tasks);
            displayTasks(tasks, formattedDate);
        })
        .catch((error) => {
            console.error('Error fetching tasks:', error);
        });
}
// Function to display tasks grouped by day and append them to the correct day container
function displayTasks(tasks, formattedDate) {
    const weekDaysContainer = document.getElementById('weekDays'); // Container where the days are displayed

    // Group tasks by date
    const groupedTasks = tasks.reduce((acc, task) => {
        if (!acc[task.date]) acc[task.date] = [];
        acc[task.date].push({ id: task.task_id, text: task.task_info });
        return acc;
    }, {});

    console.log("Grouped Tasks:", groupedTasks);

    // Iterate over the grouped tasks
    for (const [date, taskList] of Object.entries(groupedTasks)) {

        // Find the corresponding day container based on the data-date attribute
        const dayContainer = weekDaysContainer.querySelector(`.day-container[data-date="${date}"]`);

        // Check if we found the day container
        if (!dayContainer) {
            console.error(`Day container for ${date} not found`);
            continue;  // Skip to the next task if the day container doesn't exist
        }

        if (dayContainer) {
            // Find or create the task list container for this day
            let taskListContainer = dayContainer.querySelector('.task-list');
            if (!taskListContainer) {
                // If task list container doesn't exist, create it
                taskListContainer = document.createElement('div');
                taskListContainer.classList.add('task-list');
                dayContainer.appendChild(taskListContainer); // Append it to the day container
            } else {
                taskListContainer.innerHTML = '';
            }

            // Add the tasks for this day
            taskList.forEach((task) => {
                console.log('this task in display', task)
                const taskItem = document.createElement('div');
                taskItem.classList.add('task-item');
                taskItem.dataset.taskId = task.id;

                const taskText = document.createElement('p')
                taskText.textContent = task.text;

                taskItem.appendChild(taskText);

                taskListContainer.appendChild(taskItem);

                // Create a delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-task-button');
                deleteButton.dataset.taskId = task.id;

                // Attach click event listener to delete the task
                deleteButton.addEventListener('click', () => {
                    deleteTask(task.id, formattedDate);
                });

                // Append delete button to the task item
                taskItem.appendChild(deleteButton)

                // Append task item to the task list container
                taskListContainer.appendChild(taskItem)
            });
        }
    }
}

// Function to handle posting the task from the input field
function postTask(task, dayDate) {
    const formattedDate = dayDate.toISOString().split('T')[0];
    const userId = getUserIdFromToken();

    if (!userId) {
        console.error('User ID not found. Please log in.');
        return;
    }

    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log('Submitting task:', { userId, date, task });

    fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId,
            date: formattedDate,
            task_info: task,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.error) {
            console.error('Error posting task:', data.error);
        } else {
            console.log('Task added successfully:', data);
            getDayTasks(formattedDate, userId)
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function deleteTask(taskId, formattedDate) {
    console.log('Deleting task with ID:', taskId)
    const apiUrl = `http://localhost:3000/tasks/${taskId}`

    return fetch(apiUrl, {
        method: 'DELETE',
    })
    .then(response => {
        console.log("Response status:", response.status);
        if (response.ok) {
            console.log(`Task ${taskId} deleted successfully`);
            
            // Optionally, you can parse the response body if needed
            response.json().then(data => {
                console.log(data.message); // Logs: Task deleted successfully
            });
            // Refresh the tasks after deletion
            const userId = getUserIdFromToken();
            getDayTasks(formattedDate, userId); // Re-fetch tasks
        
        } else {
            // Optionally, you can parse the response body if needed
            response.json().then(data => {
                console.log(data.message); // Logs: Task deleted successfully
            });
        }
    })
    .catch(error => {
        console.error('Error deleting task:', error);
    });
}


// Attach postTask to the global scope
window.postTask = postTask;

if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', logout);
}

if (document.getElementById('calendarBtn')) {
    document.getElementById('calendarBtn').addEventListener('click', calendar);
}

if (document.getElementById('dashBtn')) {
    document.getElementById('dashBtn').addEventListener('click', dashboard);
}