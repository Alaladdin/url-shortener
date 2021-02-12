const express = require('express');
const ShortenerRoute = require('./ShortenerRoute');
const AuthRoute = require('./AuthRoute');
const WebRoute = require('./WebRoute');

const router = express.Router();

router.use('', AuthRoute);
router.use('', WebRoute);
router.use('', ShortenerRoute);

module.exports = router;
