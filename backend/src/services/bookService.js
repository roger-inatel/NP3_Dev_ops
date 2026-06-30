const bookRepository = require('../repositories/bookRepository');

async function createBook(title, author) {
  if (!title || !author) {
    const error = new Error('title e author são obrigatórios');
    error.status = 400;
    throw error;
  }
  return bookRepository.create(title, author);
}

async function listBooks() {
  return bookRepository.findAll();
}

module.exports = { createBook, listBooks };
