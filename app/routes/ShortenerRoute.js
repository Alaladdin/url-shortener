const express = require('express');
const { Redirect, AddUrl, DeleteUrl, WebInterface, GetUrlList } = require('../controllers/ShortenerController');
const router = express.Router();

// GET

// Web Interface
router.get('/', WebInterface);

// Web Interface
router.get('/list', GetUrlList);

// Open shortId
router.get('/:shortId', Redirect);

// Delete shortId
router.delete('/', DeleteUrl);

// POST
router.post('/', AddUrl);

module.exports = router;