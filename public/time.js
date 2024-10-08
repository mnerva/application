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