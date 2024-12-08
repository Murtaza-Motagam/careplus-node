const express = require('express');
const User = require('../models/User');

const fetchUser = async (req, res) => {
    let success = false;
    try {
        let userId = req.user.id;
        const details = await User.findById(userId).select("-password");

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

module.exports = {
    fetchUser
}