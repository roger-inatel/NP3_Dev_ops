const pool = require('../database/connection');

async function create(title, author) {
  const [result] = await pool.execute(
    'INSERT INTO books (title, author) VALUES (?, ?)',
    [title, author]
  );
  return { id: result.insertId, title, author, available: true };
}

async function findAll() {
  const [rows] = await pool.execute('SELECT * FROM books');
  return rows;
}

module.exports = { create, findAll };
