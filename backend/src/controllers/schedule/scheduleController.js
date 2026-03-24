const { ScheduleItem } = require("../../models")
const auditService = require("../../services/auditService")
const logger = require("../../config/logger")

module.exports = {
  async getAll(req, res) {
    const { is_active } = req.query
    const where = {}
    if (is_active !== undefined) where.is_active = is_active === "true"

    const items = await ScheduleItem.findAll({
      where,
      order: [
        ["display_order", "ASC"],
        ["createdAt", "ASC"],
      ],
    })

    res.json({ status: 200, message: "Schedule retrieved", data: items })
  },

  async getOne(req, res) {
    const item = await ScheduleItem.findByPk(req.params.id)
    if (!item) return res.status(404).json({ status: 404, message: "Schedule item not found" })
    res.json({ status: 200, message: "Schedule item retrieved", data: item })
  },

  async create(req, res) {
    const item = await ScheduleItem.create(req.body)

    logger.info(`Schedule item created: ${item.id}`)
    await auditService.log({
      userId: req.user.id,
      permission: "content.create",
      entityType: "schedule_item",
      entityId: item.id,
      action: "create",
      description: `Item programme "${item.title_fr}" créé`,
      changes: req.body,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    })

    res.status(201).json({ status: 201, message: "Schedule item created", data: item })
  },

  async update(req, res) {
    const item = await ScheduleItem.findByPk(req.params.id)
    if (!item) return res.status(404).json({ status: 404, message: "Schedule item not found" })

    await item.update(req.body)

    logger.info(`Schedule item updated: ${item.id}`)
    await auditService.log({
      userId: req.user.id,
      permission: "content.edit",
      entityType: "schedule_item",
      entityId: item.id,
      action: "update",
      description: `Item programme "${item.title_fr}" modifié`,
      changes: req.body,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    })

    res.json({ status: 200, message: "Schedule item updated", data: item })
  },

  async delete(req, res) {
    const item = await ScheduleItem.findByPk(req.params.id)
    if (!item) return res.status(404).json({ status: 404, message: "Schedule item not found" })

    const title = item.title_fr
    await item.destroy()

    logger.info(`Schedule item deleted: ${req.params.id}`)
    await auditService.log({
      userId: req.user.id,
      permission: "content.delete",
      entityType: "schedule_item",
      entityId: req.params.id,
      action: "delete",
      description: `Item programme "${title}" supprimé`,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    })

    res.json({ status: 200, message: "Schedule item deleted" })
  },
}
