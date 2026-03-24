const express = require("express")
const eventConfigController = require("../controllers/eventConfig/eventConfigController")
const { verifyToken } = require("../middlewares/auth")
const { checkPermission } = require("../middlewares/permissions")

const router = express.Router()

// ──────── PUBLIC ────────
// Vue fusionnée (defaults + BD) pour le frontend client
router.get("/public", eventConfigController.getPublic)

// ──────── ADMIN ────────
router.get("/", verifyToken, checkPermission("content.view"), eventConfigController.getAll)
router.post("/upsert", verifyToken, checkPermission("content.edit"), eventConfigController.upsert)
router.post("/bulk", verifyToken, checkPermission("content.edit"), eventConfigController.bulkUpsert)
router.delete("/:id", verifyToken, checkPermission("content.delete"), eventConfigController.delete)

module.exports = router
