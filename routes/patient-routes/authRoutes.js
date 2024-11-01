const express = require('express');
const router = express.Router();
const AuthenticationController = require('../../controllers/AuthenticationController')
const fetchPatient = require('../../middleware/fetchPatient')

router.post('/register', AuthenticationController.register)
router.post('/login', AuthenticationController.login)
router.get('/get-patient', fetchPatient, AuthenticationController.fetchPatient)

module.exports = router;