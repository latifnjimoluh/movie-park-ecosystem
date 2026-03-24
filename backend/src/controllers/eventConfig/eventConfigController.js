const { EventConfig } = require("../../models")
const auditService = require("../../services/auditService")
const logger = require("../../config/logger")

// Valeurs par défaut en cas de table vide
const DEFAULTS = {
  edition_label:      "🐣 Édition Pâques 2026",
  tagline:            "Une soirée cinéma unique, sous les étoiles de Yaoundé.",
  subtitle:           "Ambiance · Films · Expérience Printanière",
  social_proof:       "🎟️ Plus de 100 participants lors de la dernière édition",
  location_lat:       "3.876146",
  location_lng:       "11.518691",
  films_badge:        "🎬 Programme Pâques 2026",
  films_description:  "Deux films soigneusement sélectionnés pour une soirée inoubliable.",
  pricing_badge:      "🎟️ Choisissez votre expérience",
  particle_symbols:   JSON.stringify(["🌸", "🌼", "🌿", "🌺", "🥚", "✨", "🌱", "🐣"]),
  contact_phone:      "+237 697 30 44 50",
  contact_email:      "matangabrooklyn@gmail.com",
  contact_whatsapp:   "237697304450",
}

module.exports = {
  // Retourner TOUTES les configs (public + admin)
  async getAll(req, res) {
    const configs = await EventConfig.findAll({ order: [["group", "ASC"], ["key", "ASC"]] })

    // Merge avec les défauts pour les clés manquantes
    const result = {}
    for (const [k, v] of Object.entries(DEFAULTS)) {
      result[k] = v
    }
    for (const cfg of configs) {
      result[cfg.key] = cfg.value
    }

    res.json({ status: 200, message: "Event config retrieved", data: { configs, merged: result } })
  },

  // Retourner uniquement la vue fusionnée (pour le frontend public)
  async getPublic(req, res) {
    const configs = await EventConfig.findAll()

    const result = { ...DEFAULTS }
    for (const cfg of configs) {
      result[cfg.key] = cfg.value
    }

    res.json({ status: 200, message: "Event config retrieved", data: result })
  },

  // Upsert une clé
  async upsert(req, res) {
    const { key, value, type, label, group } = req.body

    if (!key) return res.status(400).json({ status: 400, message: "key is required" })

    const [cfg, created] = await EventConfig.findOrCreate({
      where: { key },
      defaults: { key, value, type: type || "text", label, group: group || "general" },
    })

    if (!created) {
      await cfg.update({ value, type: type || cfg.type, label: label || cfg.label, group: group || cfg.group })
    }

    logger.info(`EventConfig upsert: ${key}`)
    await auditService.log({
      userId: req.user.id,
      permission: "content.edit",
      entityType: "event_config",
      entityId: cfg.id,
      action: created ? "create" : "update",
      description: `Config événement "${key}" ${created ? "créée" : "mise à jour"}`,
      changes: { key, value },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    })

    res.json({ status: 200, message: created ? "Config created" : "Config updated", data: cfg })
  },

  // Upsert de plusieurs clés en bulk
  async bulkUpsert(req, res) {
    const { configs } = req.body
    if (!Array.isArray(configs) || configs.length === 0) {
      return res.status(400).json({ status: 400, message: "configs array required" })
    }

    const results = []
    for (const { key, value, type, label, group } of configs) {
      if (!key) continue
      const [cfg, created] = await EventConfig.findOrCreate({
        where: { key },
        defaults: { key, value, type: type || "text", label, group: group || "general" },
      })
      if (!created) {
        await cfg.update({ value, type: type || cfg.type, label: label || cfg.label, group: group || cfg.group })
      }
      results.push(cfg)
    }

    logger.info(`EventConfig bulk upsert: ${results.length} keys`)
    await auditService.log({
      userId: req.user.id,
      permission: "content.edit",
      entityType: "event_config",
      entityId: "bulk",
      action: "update",
      description: `${results.length} clés de configuration mises à jour`,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    })

    res.json({ status: 200, message: "Configs updated", data: results })
  },

  async delete(req, res) {
    const cfg = await EventConfig.findByPk(req.params.id)
    if (!cfg) return res.status(404).json({ status: 404, message: "Config not found" })

    const key = cfg.key
    await cfg.destroy()

    logger.info(`EventConfig deleted: ${key}`)
    await auditService.log({
      userId: req.user.id,
      permission: "content.delete",
      entityType: "event_config",
      entityId: req.params.id,
      action: "delete",
      description: `Config "${key}" supprimée (valeur par défaut restaurée)`,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    })

    res.json({ status: 200, message: "Config deleted (default value restored)" })
  },
}
