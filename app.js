const express = require('express')
const mysql = require('mysql2');
const app = express();
const session = require('express-session');
const path = require('path');
const port = 3000;
const crypto = require('crypto');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// Session configuration
app.use(session({
	secret: 'your-secret-key', // Replace with a strong secret key
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }  // Set to `true` if using HTTPS
}));

// setup db connection
const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'qwerty',
	database : 'application'
});

// HTML file connection
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for /home
app.get('/home', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'home.html'));
  });

// http://localhost:3000/auth
app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
  });