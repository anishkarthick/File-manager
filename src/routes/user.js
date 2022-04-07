const express = require('express');
const router = new express.Router();
const userController = require('../controller/user');
const auth = require('../middleware/auth');
// const User = require('../models/User');

// router.get('/users', userController.get);
router.get('/users/confirm/:confirmationCode', userController.verifyUser);
router.post('/users/register', userController.register);
router.post('/users/login', userController.login);
router.post('/users/logout', auth, userController.logout);
router.post('/users/logoutall', auth, userController.logoutall);

module.exports = router;
