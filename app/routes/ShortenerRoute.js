const express = require('express');
const { Redirect, AddUrl, DeleteUrl } = require('../controllers/ShortenerController');

const router = express.Router();

// Open shortId
router.get('/:shortId', Redirect);

// Delete shortId
router.delete('/', DeleteUrl);

// POST
router.post('/', AddUrl);

module.exports = router;
