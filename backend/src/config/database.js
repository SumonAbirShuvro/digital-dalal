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
    queueLimit: 0,
    // --- EI LINE-TA ADD KORO ---
    ssl: {
        rejectUnauthorized: false
    }
});

const promisePool = pool.promise();

// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1);
    }
    
    console.log('✅ Database connected successfully to AIVEN CLOUD!');
    console.log('📡 Connected to: ' + process.env.DB_HOST);
    connection.release();
});

module.exports = promisePool;