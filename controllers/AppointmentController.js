const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/patients/Appointment');

const patientDetails = async (req, res) => {
    let success = false;

    // If there are errors, return bad request and the errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        const { fullName, emailId, mobNo, dateOfBirth, countryCode, gender, state, city } = req.body;

        const appointmentData = await Appointment.create({
            patientDetails: {
                fullName,
                emailId,
                mobNo,
                countryCode,
                dateOfBirth,
                gender,
                state,
                city,
            },
        });

        if (!appointmentData) {
            return res.status(500).json({ success, message: 'Something went wrong. Please try again.' });
        }

        success = true;

        return res.status(200).json({
            success,
            message: 'Patient details saved successfully! Thank you for providing the information.',
            data: appointmentData,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, message: "An unexpected error occurred. Please try again later." });
    }
};

const getPatientDetails = async (req, res) => {
    let success = false;
    try {
        const patientId = req.patient.id;

        // Find appointments associated with the patient
        const details = await Appointment.find({ patient: patientId }).populate('patient', '-password');

        if (!details || details.length === 0) {
            return res.status(404).json({ success, message: "No appointments found for this patient." });
        }

        success = true;
        res.json({ success, data: details });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
};



module.exports = {
    patientDetails,
    getPatientDetails
}