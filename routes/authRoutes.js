const express = require('express');
const router = express.Router();
const AuthenticationController = require('../controllers/AuthenticationController')
const UserController = require('../controllers/UserController')
const fetchUser = require('../middleware/fetchUser')

router.post('/register', AuthenticationController.register)
router.post('/login', AuthenticationController.login)
router.get('/get-user', fetchUser, UserController.fetchUser)

module.exports = router;