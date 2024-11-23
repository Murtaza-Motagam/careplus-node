const express = require('express');
const upload = require('../../upload');
const router = express.Router();
const PatientProfileController = require('../../controllers/PatientProfileController')
const fetchPatient = require('../../middleware/fetchPatient')

// Route for save patient personal detail
router.post('/personal-detail', upload.single('profileImg'), fetchPatient, PatientProfileController.savePersonalDetail)

// Route for get patient details
router.get('/get-patient', fetchPatient, PatientProfileController.fetchPatient)

module.exports = router;