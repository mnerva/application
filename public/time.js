function updateClockAndDate() {
    const now = new Date();

    // Format time as HH:MM:SS
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}:${seconds}`;

    // Format date as Weekday, Month Day, Year
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = now.toLocaleDateString(undefined, options);

    // Update the DOM
    document.getElementById('time').textContent = currentTime;
    document.getElementById('date').textContent = currentDate;
}

// Initial call to display immediately upon loading
updateClockAndDate();

// Update every second
setInterval(updateClockAndDate, 1000);

// Select a week for the drop menu
const select = document.getElementById("weekSelect");
const weekDaysContainer = document.getElementById("weekDays");

function generateWeeks(currentWeekStart) {
    // Clear existing options
    select.innerHTML = "";

    // Generate 10 weeks: 4 before, current, and 5 after
    for (let i = -4; i <= 5; i++) {
        const weekStart = new Date(currentWeekStart);
        weekStart.setDate(currentWeekStart.getDate() + i * 7 - 7);

        // Ensure the week starts on Monday
        const adjustedWeekStart = getCurrentWeekStart(weekStart);

        const weekEnd = new Date(adjustedWeekStart);
        weekEnd.setDate(adjustedWeekStart.getDate() + 6);

        // Format dates
        const startFormatted = adjustedWeekStart.toISOString().slice(0, 10);
        const endFormatted = weekEnd.toISOString().slice(0, 10);

        // Create option
        const option = document.createElement("option");
        option.value = startFormatted; // Use the start date as the value
        option.textContent = `${startFormatted} - ${endFormatted}`;

        // Mark current week as selected
        if (i === 1) {
            option.selected = true;
        }

        // Add to dropdown
        select.appendChild(option);
    }

    // Display the current week's days
    displayWeekDays(currentWeekStart);
}

// Get the current week's Monday
function getCurrentWeekStart(date) {
    const currentDay = date.getDay() === 0 ? 6 : date.getDay() - 1;
    const currentWeekStart = new Date(date);
    currentWeekStart.setDate(date.getDate() - currentDay);
    return currentWeekStart;
}

// Display each day of the selected week
function displayWeekDays(startDate) {
    // Clear previous days
    weekDaysContainer.innerHTML = "";

    // Ensure the week starts on Monday
    const adjustedStartDate = getCurrentWeekStart(startDate);

    // Generate and display headers for the week
    for (let i = 0; i < 7; i++) {
        const dayDate = new Date(adjustedStartDate);
        dayDate.setDate(adjustedStartDate.getDate() + i);

        const userId = getUserIdFromToken();

        // Day container
        const dayContainer = document.createElement("div");
        dayContainer.className = "day-container";
        dayContainer.dataset.date = dayDate.toISOString().split('T')[0];

        // Day header
        const dayHeader = document.createElement("h3");
        dayHeader.textContent = dayDate.toDateString();

        // Task input
        const taskInput = document.createElement("input");
        taskInput.type = "text";
        taskInput.placeholder = `Task for ${dayDate.toDateString()}`;
        taskInput.dataset.date = dayDate.toISOString().split('T')[0];

        const formattedDate = dayDate.toISOString().split('T')[0];

        // Add event listener to post task on Enter key press
        taskInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const task = taskInput.value.trim();
                if (task) {
                    console.log(`Task for ${dayDate.toDateString()}:`, task);
                    postTask(task, dayDate); // Pass the task and date to postTask
                    getDayTasks(formattedDate, userId);
                    taskInput.value = '';
                    taskInput.blur();
                } else {
                    console.log("Empty task, ignoring...")
                }
                event.preventDefault(); // Prevent any default behavior
            }
        });

        // Listen for input field losing focus (blur event)
        taskInput.addEventListener('blur', () => {
            const task = taskInput.value.trim();
            if (task) {
                postTask(task, dayDate);
                taskInput.value = '';
            }
        });

        // Append header and input to the day container
        dayContainer.appendChild(dayHeader);
        dayContainer.appendChild(taskInput);

        // Append day container to the main weekDays container
        weekDaysContainer.appendChild(dayContainer);
    }
    const userId = getUserIdFromToken();
    const dayDate = new Date(adjustedStartDate);
    const formattedDate = dayDate.toISOString().split('T')[0];

    if (userId) {
        getDayTasks(formattedDate, userId)
    }
}

// Handle week selection
select.addEventListener("change", (event) => {
    const selectedDate = new Date(event.target.value);

    // Ensure the week starts on Monday for the selected date
    const adjustedStartDate = getCurrentWeekStart(selectedDate);

    displayWeekDays(adjustedStartDate); // Display the selected week's days
    generateWeeks(adjustedStartDate);
});

// Initialize dropdown with the current week
const currentWeekStart = getCurrentWeekStart(new Date());
generateWeeks(currentWeekStart);
