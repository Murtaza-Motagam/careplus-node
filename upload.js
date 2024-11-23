const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
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