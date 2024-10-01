// Logout function
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', logout);
}