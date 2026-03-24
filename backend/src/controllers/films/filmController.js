const { Film } = require("../../models")
const auditService = require("../../services/auditService")
const logger = require("../../config/logger")
const fs = require("fs")
const path = require("path")

/**
 * Utilité pour supprimer une image physique
 */
const deleteFile = (filePath) => {
  if (!filePath) return
  const fullPath = path.join(process.cwd(), filePath.startsWith("/") ? filePath.slice(1) : filePath)
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath)
    } catch (err) {
      logger.error(`Failed to delete file: ${fullPath}`, err)
    }
  }
}

module.exports = {
  async getAll(req, res) {
    const { is_active } = req.query
    const where = {}
    if (is_active !== undefined) where.is_active = is_active === "true"

    const films = await Film.findAll({
      where,
      order: [
        ["display_order", "ASC"],
        ["createdAt", "DESC"],
      ],
    })

    res.json({ status: 200, message: "Films retrieved", data: films })
  },

  async getOne(req, res) {
    const film = await Film.findByPk(req.params.id)
    if (!film) return res.status(404).json({ status: 404, message: "Film not found" })
    res.json({ status: 200, message: "Film retrieved", data: film })
  },

  async create(req, res) {
    try {
      const data = { ...req.body }
      
      // Si une image a été uploadée
      if (req.file) {
        data.image_url = `/uploads/films/${req.file.filename}`
      }

      const film = await Film.create(data)

      logger.info(`Film created: ${film.id}`)
      await auditService.log({
        userId: req.user.id,
        permission: "content.create",
        entityType: "film",
        entityId: film.id,
        action: "create",
        description: `Film "${film.title_fr}" créé`,
        changes: data,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      })

      res.status(201).json({ status: 201, message: "Film created", data: film })
    } catch (err) {
      logger.error("Create film error:", err)
      res.status(500).json({ status: 500, message: err.message })
    }
  },

  async update(req, res) {
    try {
      const film = await Film.findByPk(req.params.id)
      if (!film) return res.status(404).json({ status: 404, message: "Film not found" })

      const data = { ...req.body }
      
      // Si une nouvelle image est envoyée
      if (req.file) {
        // Supprimer l'ancienne image si elle existe
        if (film.image_url && film.image_url.includes("/uploads/films/")) {
          deleteFile(film.image_url)
        }
        data.image_url = `/uploads/films/${req.file.filename}`
      }

      await film.update(data)

      logger.info(`Film updated: ${film.id}`)
      await auditService.log({
        userId: req.user.id,
        permission: "content.edit",
        entityType: "film",
        entityId: film.id,
        action: "update",
        description: `Film "${film.title_fr}" modifié`,
        changes: data,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      })

      res.json({ status: 200, message: "Film updated", data: film })
    } catch (err) {
      logger.error("Update film error:", err)
      res.status(500).json({ status: 500, message: err.message })
    }
  },

  async delete(req, res) {
    try {
      const film = await Film.findByPk(req.params.id)
      if (!film) return res.status(404).json({ status: 404, message: "Film not found" })

      const title = film.title_fr
      const imageUrl = film.image_url

      await film.destroy()

      // Supprimer l'image associée
      if (imageUrl && imageUrl.includes("/uploads/films/")) {
        deleteFile(imageUrl)
      }

      logger.info(`Film deleted: ${req.params.id}`)
      await auditService.log({
        userId: req.user.id,
        permission: "content.delete",
        entityType: "film",
        entityId: req.params.id,
        action: "delete",
        description: `Film "${title}" supprimé`,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      })

      res.json({ status: 200, message: "Film deleted" })
    } catch (err) {
      logger.error("Delete film error:", err)
      res.status(500).json({ status: 500, message: err.message })
    }
  },
}
