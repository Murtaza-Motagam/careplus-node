const express = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');
var jwt = require('jsonwebtoken');
const JWT_SECRET = 'UserIsValidated';

const register = async (req, res) => {
    let success = false;

    // If there are errors, return bad request and the errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const userData = req.body;

    try {
        const { emailId, password } = userData;

        // Find user by email
        let user = await User.findOne({ emailId });

        if (user) {
            return res.status(400).json({
                success: false,
                message: "Sorry, an email with this name already exists. Try using a different one."
            });
        }

        let salt = await bcrypt.genSalt(10);
        let secPass = await bcrypt.hash(password, salt);

        // Create the patient with all necessary details
        user = await User.create({
            emailId: emailId,
            password: secPass,
            isActive: true,
        });

        let data = {
            user: {
                id: user.id
            }
        };

        let authtoken = jwt.sign(data, JWT_SECRET);
        success = true;

        res.status(200).json({ success, message: "You're all set! Welcome aboard!", authtoken,  details: user });
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
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        const { emailId, password } = req.body;

        let user = await User.findOne({ emailId });

        if (!user) {
            return res.status(400).json({ success, message: "Sorry, try to login using proper credentials." });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.status(400).json({ success, message: "Please try to login with proper credentials." });
        }

        const userDetails = {
            user: {
                id: user.id
            }
        };

        const authtoken = jwt.sign(userDetails, JWT_SECRET); // Sign the token with user details
        success = true;
        return res.status(200).json({
            success,
            message: "Login successful! Welcome back!",
            authtoken,
            details: user
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Some Error Occurred..");
    }
};


module.exports = {
    register,
    login
}