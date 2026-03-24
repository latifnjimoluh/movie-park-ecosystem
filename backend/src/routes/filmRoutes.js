const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const filmController = require("../controllers/films/filmController")
const { verifyToken } = require("../middlewares/auth")
const { checkPermission } = require("../middlewares/permissions")

const router = express.Router()

// Configuration de Multer pour les affiches de films
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads/films")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, "film-" + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/
    const isMatch = allowedTypes.test(path.extname(file.originalname).toLowerCase()) && allowedTypes.test(file.mimetype)
    if (isMatch) return cb(null, true)
    cb(new Error("Format d'image non supporté (JPG, PNG, WEBP uniquement)"))
  }
})

// ──────── PUBLIC ────────
router.get("/", filmController.getAll)
router.get("/:id", filmController.getOne)

// ──────── ADMIN ────────
router.post("/", verifyToken, checkPermission("content.create"), upload.single("image"), filmController.create)
router.put("/:id", verifyToken, checkPermission("content.edit"), upload.single("image"), filmController.update)
router.delete("/:id", verifyToken, checkPermission("content.delete"), filmController.delete)

module.exports = router
