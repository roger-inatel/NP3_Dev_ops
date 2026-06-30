const readerService = require('../services/readerService');

async function createReader(req, res) {
  try {
    const { name, email } = req.body;
    const reader = await readerService.createReader(name, email);
    res.status(201).json(reader);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function listReaders(req, res) {
  try {
    const readers = await readerService.listReaders();
    res.status(200).json(readers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createReader, listReaders };
