const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  emailId: { type: String, required: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  personalInfo: {
    profileImg: {
      type: String,
      default: null
    },
    firstName: { type: String },
    lastName: { type: String },
    fullName: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    mobNo: { type: String },
    countryCode: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    address: { type: String },
    maritalStatus: { type: String },
    occupation: { type: String },
    emergencyContact: {
      name: { type: String },
      relationship: { type: String },
      emergencyNo: { type: String }
    }
  },
  medicalInfo: {
    bloodGroup: { type: String },
    knownAllergies: { type: [String], default: [] },
    existingMedicalConditions: { type: [String], default: [] },
    currentMedications: { type: [String], default: [] },
    familyMedicalHistory: { type: [String], default: [] }
  },
  additionalInfo: {
    occupation: { type: String },
    maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'] }
  },
});

module.exports = mongoose.model('Patient-details', PatientSchema);
