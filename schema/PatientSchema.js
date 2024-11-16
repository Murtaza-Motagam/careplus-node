const { z } = require('zod');

const PatientValidationSchema = z.object({
  emailId: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  personalInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    fullName: z.string().min(1, "Name is required"),
    dateOfBirth: z.date().optional(),
    gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']).optional(),
    mobNo: z.string().optional(),
    countryCode: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
    emergencyContact: z.object({
      name: z.string().optional(),
      relationship: z.string().optional(),
      emergencyNo: z.string().optional(),
    }).optional(),
  }).optional(),
  medicalInfo: z.object({
    bloodGroup: z.string().optional(),
    knownAllergies: z.array(z.string()).default([]),
    existingMedicalConditions: z.array(z.string()).default([]),
    currentMedications: z.array(z.string()).default([]),
    familyMedicalHistory: z.array(z.string()).default([]),
  }).optional(),
  insuranceDetail: z.object({
    insuranceProvider: z.string().optional(),
    insuranceID: z.string().optional(),
    coverageDetails: z.string().optional(),
  }).optional(),
  additionalInfo: z.object({
    occupation: z.string().optional(),
    maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']).optional(),
  }).optional(),
});

module.exports = PatientValidationSchema;