// ════════════════════════════════════════════════
// UPLOAD ROUTES — /api/upload
// Handles file uploads from the frontend
// ════════════════════════════════════════════════
const express = require('express')
const multer = require('multer')
const path = require('path')

const router = express.Router()

// Configure where files are saved and how they're named
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'))  // save to backend/uploads/
  },
  filename: (req, file, cb) => {
    // Example filename: 1730498230472-balloon.jpeg
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-')
    cb(null, uniqueName)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'))
    }
    cb(null, true)
  }
})

// POST /api/upload — accepts ONE file with field name "image"
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' })
  }

  // Send back the filename so the frontend can use it
  res.json({ filename: req.file.filename })
})

module.exports = router