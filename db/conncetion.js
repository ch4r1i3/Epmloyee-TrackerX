const mysql = require('mysql2');

//Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'karli.2606',
        database: 'employeeTracker'
    },
    console.log('Connected to the Employee Tracker database.')
);

//since it's an independent module now, must export it
module.exports = db;