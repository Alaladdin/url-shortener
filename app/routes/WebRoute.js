const express = require('express');
const { WebInterface, GetUrlList } = require('../controllers/WebController');

const router = express.Router();

// Web Interface
router.get('/', WebInterface);

// Web Interface
router.get('/list', GetUrlList);

module.exports = router;
