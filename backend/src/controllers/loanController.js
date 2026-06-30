const loanService = require('../services/loanService');

async function createLoan(req, res) {
  try {
    const { book_id, reader_id } = req.body;
    const loan = await loanService.createLoan(book_id, reader_id);
    res.status(201).json(loan);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function returnLoan(req, res) {
  try {
    await loanService.returnLoan(req.params.id);
    res.status(200).json({ message: 'Livro devolvido com sucesso' });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function listLoans(req, res) {
  try {
    const loans = await loanService.listLoans();
    res.status(200).json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createLoan, returnLoan, listLoans };
