const express = require('express');
const shortener = require('../controllers/ShortenerController');

const router = express.Router();

router
  .get('/:shortId', shortener.redirect)
  .get('*', shortener.notFound);

module.exports = router;
