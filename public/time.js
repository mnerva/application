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

function generateWeeks(currentWeekStart) {
    // Clear existing options
    select.innerHTML = "";

    // Generate 10 weeks: 4 before, current, and 5 after
    for (let i = -4; i <= 5; i++) {
        const weekStart = new Date(currentWeekStart);
        weekStart.setDate(currentWeekStart.getDate() + i * 7);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        // Format dates
        const startFormatted = weekStart.toISOString().slice(0, 10);
        const endFormatted = weekEnd.toISOString().slice(0, 10);

        // Create option
        const option = document.createElement("option");
        option.value = startFormatted; // Use the start date as the value
        option.textContent = `${startFormatted} - ${endFormatted}`;

        // Mark current week as selected
        if (i === 0) {
            option.selected = true;
        }

        // Add to dropdown
        select.appendChild(option);
    }
}

// Get the current week's Monday
function getCurrentWeekStart(date) {
    const currentDay = date.getDay() === 0 ? 6 : date.getDay() - 1; // Adjust for Monday start
    const currentWeekStart = new Date(date);
    currentWeekStart.setDate(date.getDate() - currentDay);
    return currentWeekStart;
}

// Handle week selection
select.addEventListener("change", (event) => {
    const selectedDate = new Date(event.target.value);
    generateWeeks(selectedDate); // Recalculate the weeks based on the selected week
});

// Initialize dropdown with the current week
const currentWeekStart = getCurrentWeekStart(new Date());
generateWeeks(currentWeekStart);
