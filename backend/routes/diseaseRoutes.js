const express = require('express');
const router = express.Router();
const { analyzeCropImage, upload } = require('../controllers/diseaseController');

// The 'upload.single("image")' middleware handles the file upload
router.post('/scan', upload.single("image"), analyzeCropImage);

module.exports = router;