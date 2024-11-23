const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Patient = require('../models/Patient');
var jwt = require('jsonwebtoken');
const JWT_SECRET = 'UserIsValidated';

const register = async (req, res) => {
    let success = false;

    // If there are errors, return bad request and the errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const patientData = req.body;

    try {
        const { emailId, password } = patientData;

        // Find user by email
        let patient = await Patient.findOne({ emailId });

        if (patient) {
            return res.status(400).json({
                success: false,
                message: "Sorry, an email with this name already exists. Try using a different one."
            });
        }

        let salt = await bcrypt.genSalt(10);
        let secPass = await bcrypt.hash(password, salt);

        // Create the patient with all necessary details
        patient = await Patient.create({
            emailId: emailId,
            password: secPass,
            'authenticationInfo.isActive': true,
        });

        let data = {
            patient: {
                id: patient.id
            }
        };

        let authtoken = jwt.sign(data, JWT_SECRET);
        success = true;

        res.status(200).json({ success, message: "You're all set! Welcome aboard!", authtoken, module: 'patient', details: patient });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occurred.");
    }
};

const login = async (req, res) => {
    let success = false;

    // If there are errors, return bad request and the errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() })
    }

    try {
        const { emailId, password } = req.body;

        let patient = await Patient.findOne({ emailId });

        if (!patient) {
            return res.json({ success, message: "Sorry, try to login using proper credentials." });
        }

        const passwordCompare = await bcrypt.compare(password, patient.password);

        if (!passwordCompare) {
            return res.json({ message: "Please try to login with proper credentials" });
        }
        else {
            const data = {
                patient: {
                    id: patient.id
                }
            }

            const authtoken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.status(200).json({ success, message: "Login successful! Welcome back!", authtoken, module: 'patient', details: patient });
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error is Occurred..");
    }
};


module.exports = {
    register,
    login
}