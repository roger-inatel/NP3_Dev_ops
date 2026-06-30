const pool = require('../database/connection');

async function create(name, email) {
  const [result] = await pool.execute(
    'INSERT INTO readers (name, email) VALUES (?, ?)',
    [name, email]
  );
  return { id: result.insertId, name, email };
}

async function findAll() {
  const [rows] = await pool.execute('SELECT * FROM readers');
  return rows;
}

module.exports = { create, findAll };
