const mysql = require('mysql2');
require('dotenv').config();

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Promise wrapper
const promisePool = pool.promise();

// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        
        if (err.code === 'ECONNREFUSED') {
            console.error('    Check MySQL server!');
        } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('   check username/password in .env file!');
        } else if (err.code === 'ER_BAD_DB_ERROR') {
            console.error('   Database "scst_db"  check !');
        }
        
        process.exit(1);
    }
    
    console.log('✅ Database connected successfully!');
    console.log('   Database: ' + process.env.DB_NAME);
    connection.release();
});

module.exports = promisePool;