const express = require('express');
const {
  Login, LoginView, Register, RegisterView, LogoutView,
} = require('../controllers/AuthController');

const router = express.Router();

router.post('/login', Login);

router.post('/register', Register);

router.get('/register', RegisterView);

router.get('/login', LoginView);

router.get('/logout', LogoutView);

module.exports = router;
