const express = require('express');
const { Redirect, AddUrl, DeleteUrl } = require('../controllers/ShortenerController');

const router = express.Router();

router.get('/:shortId', Redirect);

router.delete('/', DeleteUrl);

router.post('/', AddUrl);

module.exports = router;
