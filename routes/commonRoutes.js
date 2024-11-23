const express = require('express');
const router = express.Router();
const upload = require('../upload');
const path = require('path');
const fs = require('fs');

router.post("/upload", upload.single("profileImg"), (req, res) => {
    try {
        const uploadDir = path.join(__dirname, "../uploads");
        const relativeDir = "/uploads";

        // Check if the file already exists by its original name
        const existingFile = fs.readdirSync(uploadDir).find(file => file === req.file.originalname);

        if (existingFile) {
            // If file already exists, return its relative path
            return res.status(200).json({
                success: true,
                message: "File already exists",
                data: {
                    filename: existingFile,
                    path: path.join(relativeDir, existingFile).replace(/\\/g, '/'), // Ensure forward slashes
                },
            });
        }

        // Move the uploaded file to the `uploads` folder with its original name
        const newFilePath = path.join(uploadDir, req.file.originalname);
        fs.renameSync(req.file.path, newFilePath);

        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            data: {
                filename: req.file.originalname,
                path: path.join(relativeDir, req.file.originalname).replace(/\\/g, '/'), // Ensure forward slashes
            },
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ success: false, message: "File upload failed" });
    }
});

module.exports = router;