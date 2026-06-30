const loanRepository = require('../repositories/loanRepository');

async function createLoan(bookId, readerId) {
  if (!bookId || !readerId) {
    const error = new Error('book_id e reader_id são obrigatórios');
    error.status = 400;
    throw error;
  }

  const book = await loanRepository.findBookById(bookId);
  if (!book) {
    const error = new Error('Livro não encontrado');
    error.status = 404;
    throw error;
  }

  const reader = await loanRepository.findReaderById(readerId);
  if (!reader) {
    const error = new Error('Leitor não encontrado');
    error.status = 404;
    throw error;
  }

  const activeLoan = await loanRepository.findActiveLoanByBookId(bookId);
  if (activeLoan) {
    const error = new Error('Livro já está emprestado');
    error.status = 400;
    throw error;
  }

  return loanRepository.create(bookId, readerId);
}

async function returnLoan(loanId) {
  const loan = await loanRepository.findActiveLoanById(loanId);
  if (!loan) {
    const error = new Error('Empréstimo ativo não encontrado');
    error.status = 404;
    throw error;
  }

  await loanRepository.returnLoan(loanId, loan.book_id);
}

async function listLoans() {
  return loanRepository.findAll();
}

module.exports = { createLoan, returnLoan, listLoans };
