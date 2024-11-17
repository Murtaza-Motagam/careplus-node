const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'patient'
    },
    patientDetails: {
        fullName: { type: String },
        emailId: { type: String,  required: true },
        countryCode: { type: String, default: '91' },
        mobNo: { type: String },
        dateOfBirth: { type: Date },
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        state: { type: String },
        city: { type: String },
        isPatientActive: { type: Boolean, default: true },
    },
    physicianInfo: {
        physicianId: { type: String },
        physicianNm: { type: String },
        type: { type: String },
    },
    appointmentDetails: {
        appointmentId: {
            type: String,
            required: true,
            default: function () {
                return `APPT-${Math.floor(Math.random() * 1000000)}`;
            }
        },
        appointmentDateTime: { type: Date },
        reasonForVisit: { type: String },
        appointmentStatus: { type: Number, default: 0 },
        location: { type: String },
        appointmentType: { type: String, enum: ['Virtual', 'In-person'] },
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
