const pool = require('./connection');

async function initDatabase() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS books (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      available BOOLEAN NOT NULL DEFAULT TRUE
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS readers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS loans (
      id INT AUTO_INCREMENT PRIMARY KEY,
      book_id INT NOT NULL,
      reader_id INT NOT NULL,
      borrowed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      returned_at DATETIME NULL,
      FOREIGN KEY (book_id) REFERENCES books(id),
      FOREIGN KEY (reader_id) REFERENCES readers(id)
    )
  `);

  console.log('Banco de dados inicializado com sucesso.');
}

module.exports = initDatabase;
