const readerRepository = require('../repositories/readerRepository');

async function createReader(name, email) {
  if (!name || !email) {
    const error = new Error('name e email são obrigatórios');
    error.status = 400;
    throw error;
  }
  return readerRepository.create(name, email);
}

async function listReaders() {
  return readerRepository.findAll();
}

module.exports = { createReader, listReaders };
