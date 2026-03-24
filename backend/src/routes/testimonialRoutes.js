const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const testimonialController = require("../controllers/testimonials/testimonialController")
const { verifyToken } = require("../middlewares/auth")
const { checkPermission } = require("../middlewares/permissions")

const router = express.Router()

// Configuration Multer pour les photos de profil des témoignages
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads/testimonials")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/
    if (allowedTypes.test(path.extname(file.originalname).toLowerCase())) return cb(null, true)
    cb(new Error("Format non supporté"))
  }
})

// ──────── PUBLIC ────────
router.get("/", testimonialController.getAll)

// ──────── ADMIN ────────
router.post("/", verifyToken, checkPermission("content.create"), upload.single("image"), testimonialController.create)
router.put("/:id", verifyToken, checkPermission("content.edit"), upload.single("image"), testimonialController.update)
router.delete("/:id", verifyToken, checkPermission("content.delete"), testimonialController.delete)

module.exports = router
module.exports = router
