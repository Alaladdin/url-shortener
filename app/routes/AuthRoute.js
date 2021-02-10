const express = require('express');
const { Login, Register, DeleteUser } = require('../controllers/AuthController');

const router = express.Router();

router.post('/login', Login);

router.post('/register', Register);

router.delete('/user', DeleteUser);

module.exports = router;
