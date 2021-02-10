const express = require('express');
const {
  WebInterface, GetUrlList, RegisterView, LoginView, Logout,
} = require('../controllers/WebController');

const router = express.Router();

// Web Interface
router.get('/', WebInterface);

// Web Interface
router.get('/list', GetUrlList);

router.get('/register', RegisterView);

router.get('/login', LoginView);

router.get('/logout', Logout);

module.exports = router;
