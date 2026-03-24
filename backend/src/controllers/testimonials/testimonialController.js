const { Testimonial } = require("../../models")
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
      logger.error(`Failed to delete testimonial image: ${fullPath}`, err)
    }
  }
}

module.exports = {
  async getAll(req, res) {
    const testimonials = await Testimonial.findAll({
      order: [["createdAt", "DESC"]],
    })
    res.json({ status: 200, data: testimonials })
  },

  async create(req, res) {
    try {
      const data = { ...req.body }
      
      if (req.file) {
        data.image_url = `/uploads/testimonials/${req.file.filename}`
      }

      const testimonial = await Testimonial.create(data)

      await auditService.log({
        userId: req.user.id,
        permission: "content.create",
        entityType: "testimonial",
        entityId: testimonial.id,
        action: "create",
        description: `Témoignage de "${testimonial.name}" créé`,
        changes: data,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      })

      res.status(201).json({ status: 201, message: "Testimonial created", data: testimonial })
    } catch (err) {
      res.status(500).json({ status: 500, message: err.message })
    }
  },

  async update(req, res) {
    try {
      const testimonial = await Testimonial.findByPk(req.params.id)
      if (!testimonial) return res.status(404).json({ status: 404, message: "Testimonial not found" })

      const data = { ...req.body }

      if (req.file) {
        // Supprimer l'ancienne image si locale
        if (testimonial.image_url && testimonial.image_url.includes("/uploads/testimonials/")) {
          deleteFile(testimonial.image_url)
        }
        data.image_url = `/uploads/testimonials/${req.file.filename}`
      }

      await testimonial.update(data)

      await auditService.log({
        userId: req.user.id,
        permission: "content.edit",
        entityType: "testimonial",
        entityId: testimonial.id,
        action: "update",
        description: `Témoignage de "${testimonial.name}" modifié`,
        changes: data,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      })

      res.json({ status: 200, message: "Testimonial updated", data: testimonial })
    } catch (err) {
      res.status(500).json({ status: 500, message: err.message })
    }
  },

  async delete(req, res) {
    try {
      const testimonial = await Testimonial.findByPk(req.params.id)
      if (!testimonial) return res.status(404).json({ status: 404, message: "Testimonial not found" })

      const name = testimonial.name
      const imageUrl = testimonial.image_url

      await testimonial.destroy()

      if (imageUrl && imageUrl.includes("/uploads/testimonials/")) {
        deleteFile(imageUrl)
      }

      await auditService.log({
        userId: req.user.id,
        permission: "content.delete",
        entityType: "testimonial",
        entityId: req.params.id,
        action: "delete",
        description: `Témoignage de "${name}" supprimé`,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      })

      res.json({ status: 200, message: "Testimonial deleted" })
    } catch (err) {
      res.status(500).json({ status: 500, message: err.message })
    }
  },
}
