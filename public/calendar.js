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

// Function to get tasks for a given week (startDate is the beginning of the week)
function getWeeklyTasks(startDate) {
    // Calculate end date as 6 days after start date
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6);

    const query = `
        SELECT * FROM tasks
        WHERE DATE(datetime) BETWEEN ? AND ?;
    `;

    // Execute the query with start and end date parameters
    dbConnection.query(query, [startDate.toISOString().slice(0, 10), endDate.toISOString().slice(0, 10)], (err, results) => {
        if (err) throw err;
        console.log(results);
    });
}

// Function to handle posting the task from the input field
function postTask(task, dayDate) {
    const formattedDate = dayDate.toISOString().split('T')[0];
    const userId = getUserIdFromToken();

    if (!userId) {
        console.error('User ID not found. Please log in.');
        return;
    }

    const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log('Submitting task:', { userId, datetime, task });

    fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId,
            datetime: formattedDate,
            task_info: task,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                console.error('Error posting task:', data.error);
            } else {
                console.log('Task added successfully:', data);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
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