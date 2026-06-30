const bookService = require('../services/bookService');

async function createBook(req, res) {
  try {
    const { title, author } = req.body;
    const book = await bookService.createBook(title, author);
    res.status(201).json(book);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function listBooks(req, res) {
  try {
    const books = await bookService.listBooks();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createBook, listBooks };
