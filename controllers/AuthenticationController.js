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

    try {
        const { emailId, password, cpassword, personalInfo } = req.body;

        // Find user by email
        let patient = await Patient.findOne({ emailId });

        if (patient) {
            return res.status(400).json({
                success: false,
                error: "Sorry, an email with this name already exists. Try using a different one."
            });
        }

        if (password === cpassword) {
            let salt = await bcrypt.genSalt(10);
            let secPass = await bcrypt.hash(cpassword, salt);

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

            res.status(200).json({ success, authtoken, "Patient-Details": patient });
        } else {
            res.status(400).json({ success, "Message": "Sorry, both passwords don't match." });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occurred.");
    }
};


module.exports = {
    register
}