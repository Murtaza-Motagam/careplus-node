const express = require('express');
const router = express.Router();
const AppointmentController = require('../../controllers/AppointmentController')
const fetchPatient = require('../../middleware/fetchPatient')

router.post('/patient-details', fetchPatient, AppointmentController.patientDetails)

module.exports = router;