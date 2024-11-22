const express = require('express');
const router = express.Router();
const AppointmentController = require('../../controllers/AppointmentController')
const fetchPatient = require('../../middleware/fetchPatient')

// Step-1 patient routes
router.post('/patient-details', fetchPatient, AppointmentController.patientDetails)

// Save draft route and get appointment draft route
router.post('/save-draft', fetchPatient, AppointmentController.saveAppointmentDraft)

// Step-2 Physician information
router.post('/physician-details', fetchPatient, AppointmentController.savePhysicianInfo)

// Step-3 Appointment information
router.post('/appointment-details', fetchPatient, AppointmentController.saveAppointmentDetails)

// get all appointment details
router.get('/get-appointments', fetchPatient, AppointmentController.getAppointments)

module.exports = router;