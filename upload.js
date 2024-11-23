const multer = require('multer');
const path = require('path');

// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Specify the destination folder for uploads
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        // Create a unique filename using timestamp and original name
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExt = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
    },
});

// Initialize Multer with the defined storage
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
    fileFilter: (req, file, cb) => {
        // Accept only specific file types (e.g., images)
        const allowedFileTypes = /jpeg|jpg|png|gif/;
        const extName = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = allowedFileTypes.test(file.mimetype);

        if (extName && mimeType) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    },
});

module.exports = upload;