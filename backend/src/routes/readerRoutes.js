const express = require('express');
const router = express.Router();
const readerController = require('../controllers/readerController');

router.post('/', readerController.createReader);
router.get('/', readerController.listReaders);

module.exports = router;
