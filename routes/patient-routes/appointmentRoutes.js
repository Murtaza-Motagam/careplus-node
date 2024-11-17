const express = require('express');
const router = express.Router();
const AppointmentController = require('../../controllers/AppointmentController')
const fetchPatient = require('../../middleware/fetchPatient')

// patient routes
router.post('/patient-details', fetchPatient, AppointmentController.patientDetails)
router.get('/get-patient-details', fetchPatient, AppointmentController.getPatientDetails)

module.exports = router;