const express = require('express');
const { body, validationResult } = require('express-validator');
const Patient = require('../models/Patient');
const path = require('path');

const fetchPatient = async (req, res) => {
    let success = false;
    try {
        let patientId = req.patient.id;
        const details = await Patient.findById(patientId).select("-password");

        // Ensure the profileImg path is properly formatted
        if (details.personalInfo.profileImg) {
            details.personalInfo.profileImg = details.personalInfo.profileImg.replace(/\\/g, '/');
        }
        success = true;
        res.json({ success, details });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}

const savePersonalDetail = async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const patientId = req.patient?.id;

    if (!patientId) {
        return res.status(400).json({ success, message: "Patient not found." });
    }

    try {
        const { personalInfo = {} } = req.body;
        if (personalInfo.firstName && personalInfo.lastName) {
            personalInfo.fullName = `${personalInfo.firstName} ${personalInfo.lastName}`
        }

        if (req.file) {
            const normalizedPath = req.file.path.replace(/\\/g, '/');
            personalInfo.profileImg = normalizedPath;
        }

        const updatedPatient = await Patient.findOneAndUpdate(
            { _id: patientId },
            {
                $set: Object.entries(personalInfo).reduce((acc, [key, value]) => {
                    if (value !== undefined) acc[`personalInfo.${key}`] = value;
                    return acc;
                }, {})
            },
            { new: true, runValidators: true }
        );

        if (!updatedPatient) {
            return res.status(404).json({ success, message: "Patient not found." });
        }

        success = true;
        return res.status(200).json({
            success,
            message: "Personal details updated successfully.",
            data: updatedPatient.personalInfo,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success, message: "An error occurred while updating personal details." });
    }
};

module.exports = {
    savePersonalDetail,
    fetchPatient
}