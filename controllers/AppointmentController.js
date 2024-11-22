const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/patients/Appointment');

const generateAppointmentId = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000); // Generates a random 10-digit number
};

const patientDetails = async (req, res) => {
    let success = false;

    // If there are errors, return bad request and the errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        const { patientDetails } = req.body;
        const { appointmentId } = req.query; // Fetch appointmentId from the query (if provided)
        const patientId = req.patient.id; // Fetched from token using middleware

        let appointment;

        if (appointmentId) {
            // Case: Update an existing appointment if appointmentId is provided
            appointment = await Appointment.findOneAndUpdate(
                { appointmentId, patientId },
                { $set: { patientDetails } },
                { new: true } // Return the updated document
            );

            if (!appointment) {
                return res.status(404).json({ success, message: "Appointment not found." });
            }
        } else {
            // Case: Create a new appointment if appointmentId is not provided
            let newAppointmentId;
            let isUnique = false;

            // Ensure unique appointmentId
            while (!isUnique) {
                newAppointmentId = generateAppointmentId();
                const existingAppointment = await Appointment.findOne({ appointmentId: newAppointmentId });
                if (!existingAppointment) {
                    isUnique = true; // Exit loop if no conflicting appointmentId exists
                }
            }

            appointment = await Appointment.create({
                patientDetails,
                patientId,
                appointmentId: newAppointmentId,
            });
        }

        success = true;
        res.status(200).json({
            success,
            message: appointmentId ? "Appointment updated successfully" : "Appointment created successfully",
            appointment,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, message: "An unexpected error occurred. Please try again later." });
    }
};

const saveAppointmentDraft = async (req, res) => {
    try {
        const { appointmentId, patientDetails, physicianDetails, appointmentDetails, lastStepCompleted } = req.body;
        const patientId = req.patient.id;

        let appointment;

        if (appointmentId) {
            appointment = await Appointment.findOneAndUpdate(
                { appointmentId, patientId, status: 'draft' },
                {
                    $set: {
                        ...(patientDetails && { patientDetails }),
                        ...(physicianDetails && { physicianDetails }),
                        ...(appointmentDetails && { appointmentDetails }),
                        ...(lastStepCompleted && { lastStepCompleted }),
                        updatedAt: new Date(),
                    },
                },
                { new: true, upsert: true } // `upsert` creates a new draft if it doesn't exist
            );
        } else {
            // Create a new draft if appointmentId is not provided
            const newAppointmentId = generateAppointmentId();
            appointment = await Appointment.create({
                appointmentId: newAppointmentId,
                patientId,
                patientDetails: patientDetails || {},
                physicianDetails: physicianDetails || {},
                appointmentDetails: appointmentDetails || {},
                lastStepCompleted: lastStepCompleted || 0,
                status: 'draft',
                createdAt: new Date(),
            });
        }

        res.status(200).json({
            success: true,
            message: 'Appointment is saved as Draft',
            appointment,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Failed to save draft.' });
    }
};

const savePhysicianInfo = async (req, res) => {
    try {
        let success = false;
        const { appointmentId, physicianInfo } = req.body;
        const patientId = req.patient.id; // From authentication middleware

        // Check if required data is provided
        if (!physicianInfo || !physicianInfo.physician || !physicianInfo.type) {
            return res.status(400).json({
                success,
                message: 'Incomplete physician information provided.',
            });
        }

        let appointment;

        if (appointmentId) {
            // Update existing appointment
            appointment = await Appointment.findOneAndUpdate(
                { appointmentId, patientId },
                { $set: { physicianInfo, updatedAt: new Date() } },
                { new: true } // Return the updated document
            );

            if (!appointment) {
                return res.status(404).json({
                    success,
                    message: 'Appointment not found.',
                });
            }
        } else {
            return res.status(404).json({ success, message: 'Appointment details not found' });
        }
        success = true;
        res.status(200).json({
            success,
            message: 'Physician information saved successfully.',
            appointment,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to save physician information.',
        });
    }
};

const saveAppointmentDetails = async (req, res) => {
    try {
        let success = false;
        const { appointmentId, appointmentDetails } = req.body;
        const patientId = req.patient.id; // From authentication middleware

        // Validate the provided data
        if (!appointmentDetails || !appointmentDetails.appointmentDateTime || !appointmentDetails.reasonForVisit) {
            return res.status(400).json({
                success,
                message: 'Incomplete appointment details provided.',
            });
        }

        let appointment;

        if (appointmentId) {
            // Update existing appointment
            appointment = await Appointment.findOneAndUpdate(
                { appointmentId, patientId },
                { 
                    $set: { appointmentDetails, status: 'completed', updatedAt: new Date() },
                },
                { new: true } // Return the updated document
            );

            if (!appointment) {
                return res.status(404).json({
                    success,
                    message: 'Appointment not found.',
                });
            }
        } else {
            return res.status(404).json({ success, message: 'Appointment details not found' });
        }
        success = true;
        return res.status(200).json({
            success,
            message: 'Appointment details saved successfully.',
            appointment,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to save appointment details.',
        });
    }
};

const getAppointments = async (req, res) => {
    try {
        const patientId = req.patient.id;

        const appointments = await Appointment.find({ patientId });

        res.status(200).json({
            success: true,
            appointments,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch appointments.' });
    }
};

module.exports = {
    patientDetails,
    saveAppointmentDraft,
    getAppointments,
    savePhysicianInfo,
    saveAppointmentDetails,
}