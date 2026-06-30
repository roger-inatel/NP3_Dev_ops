require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'biblioteca_user',
  password: process.env.DB_PASSWORD || 'biblioteca_pass',
  database: process.env.DB_NAME || 'biblioteca_np3',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
