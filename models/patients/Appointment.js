const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient-details', required: true },
    patientDetails: {
        fullName: { type: String, required: true },
        emailId: { type: String, required: true },
        countryCode: { type: String, default: '91', required: true },
        mobNo: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
        state: { type: String, required: true },
        city: { type: String, required: true },
        isPatientActive: { type: Boolean, default: true },
    },
    physicianInfo: {
        physician: {
            name: { type: String },
            id: { type: String }
        },
        type: { type: String },
    },    
    appointmentId: {
        type: String,
    },
    status: { type: String, enum: ['draft', 'completed'], default: 'draft' },
    lastStepCompleted: { type: Number, default: 0 },
    appointmentDetails: {
        appointmentDateTime: { type: Date },
        reasonForVisit: { type: String },
        appointmentStatus: { type: Number, default: 0 },
        location: { type: String },
        appointmentType: { type: String },
        emergencyContact: {
            name: { type: String },
            relationship: { type: String },
            emergencyNo: { type: String }
        },
        notes: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    }
});

module.exports = mongoose.model('Appointment-details', AppointmentSchema);
