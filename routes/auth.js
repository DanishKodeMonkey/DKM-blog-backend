const express = require('express');
const auth_controller = require('../controllers/authController');

const router = express.Router();

router.post('/sign-in', auth_controller.signIn);

module.exports = router;
