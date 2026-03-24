const express = require("express")
const scheduleController = require("../controllers/schedule/scheduleController")
const { verifyToken } = require("../middlewares/auth")
const { checkPermission } = require("../middlewares/permissions")

const router = express.Router()

// ──────── PUBLIC ────────
router.get("/", scheduleController.getAll)
router.get("/:id", scheduleController.getOne)

// ──────── ADMIN ────────
router.post("/", verifyToken, checkPermission("content.create"), scheduleController.create)
router.put("/:id", verifyToken, checkPermission("content.edit"), scheduleController.update)
router.delete("/:id", verifyToken, checkPermission("content.delete"), scheduleController.delete)

module.exports = router
