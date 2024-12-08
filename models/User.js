const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  emailId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  personalInfo: {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    fullName: {
      type: String,
    },
    dob: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other']
    },
    mobNo: {
      type: String,
      match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    address: {
      street: {
        type: String
      },
      city: {
        type: String
      },
      state: {
        type: String
      },
      country: {
        type: String
      },
      postalCode: {
        type: String,
        match: [/^\d{5,6}$/, 'Please enter a valid postal code']
      }
    }
  },
  insuranceDetails: {
    providerName: {
      type: String,
      trim: true
    },
    policyNumber: {
      type: String,
      trim: true
    },
    coverageDetails: {
      type: String,
      trim: true
    },
    expirationDate: {
      type: Date
    }
  },
  otherDetails: {
    preferences: {
      type: String, // Example: "Non-smoking room, vegetarian meals, etc."
      trim: true
    },
    notes: {
      type: String, // Example: "Additional information or requirements"
      trim: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('User-details', UserSchema);
