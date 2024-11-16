const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/patients/Appointment');

const patientDetails = async (req, res) => {
    let success = false;

    // If there are errors, return bad request and the errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() })
    }

    try {
        const { fullName, emailId, mobNo, dateOfBirth, countryCode, gender, state, city } = req.body;
        let appointmentData = await Appointment.findOne();

        appointmentData = await Appointment.create({
            fullName, emailId, mobNo, countryCode, dateOfBirth, gender, state, city
        });

        if(!appointmentData){
            return res.status(200).json({ success, message: 'Something went wrong please try again'})
        }

        success = true;

        return res.status(200).json({ success, data: appointmentData })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error is Occurred..");
    }
};


module.exports = {
    patientDetails
}