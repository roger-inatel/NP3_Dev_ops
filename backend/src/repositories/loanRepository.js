const pool = require('../database/connection');

async function findBookById(id) {
  const [rows] = await pool.execute('SELECT * FROM books WHERE id = ?', [id]);
  return rows[0] || null;
}

async function findReaderById(id) {
  const [rows] = await pool.execute('SELECT * FROM readers WHERE id = ?', [id]);
  return rows[0] || null;
}

async function findActiveLoanByBookId(bookId) {
  const [rows] = await pool.execute(
    'SELECT * FROM loans WHERE book_id = ? AND returned_at IS NULL',
    [bookId]
  );
  return rows[0] || null;
}

async function findActiveLoanById(id) {
  const [rows] = await pool.execute(
    'SELECT * FROM loans WHERE id = ? AND returned_at IS NULL',
    [id]
  );
  return rows[0] || null;
}

async function create(bookId, readerId) {
  const [result] = await pool.execute(
    'INSERT INTO loans (book_id, reader_id) VALUES (?, ?)',
    [bookId, readerId]
  );
  await pool.execute('UPDATE books SET available = FALSE WHERE id = ?', [bookId]);
  return { id: result.insertId, book_id: bookId, reader_id: readerId, returned_at: null };
}

async function returnLoan(id, bookId) {
  await pool.execute(
    'UPDATE loans SET returned_at = NOW() WHERE id = ?',
    [id]
  );
  await pool.execute('UPDATE books SET available = TRUE WHERE id = ?', [bookId]);
}

async function findAll() {
  const [rows] = await pool.execute('SELECT * FROM loans');
  return rows;
}

module.exports = { findBookById, findReaderById, findActiveLoanByBookId, findActiveLoanById, create, returnLoan, findAll };
