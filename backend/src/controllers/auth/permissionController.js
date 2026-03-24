const { EventConfig } = require("../../models")
const { ROLE_PERMISSIONS } = require("../../middlewares/permissions")
const logger = require("../../config/logger")

module.exports = {
  /**
   * Récupère la liste de toutes les permissions disponibles et la configuration actuelle
   */
  getPermissionsMatrix: async (req, res) => {
    try {
      // 1. Définir toutes les permissions uniques possibles à partir des défauts
      const allPossiblePermissions = Array.from(new Set(
        Object.values(ROLE_PERMISSIONS).flat()
      )).sort()

      // 2. Récupérer la configuration actuelle en DB
      const config = await EventConfig.findOne({ where: { key: "role_permissions" } })
      
      let currentMatrix = ROLE_PERMISSIONS // Fallback sur les défauts
      if (config && config.value) {
        try {
          currentMatrix = typeof config.value === 'string' ? JSON.parse(config.value) : config.value
        } catch (e) {
          logger.error("Error parsing dynamic permissions:", e)
        }
      }

      res.json({
        status: 200,
        data: {
          available_permissions: allPossiblePermissions,
          roles: Object.keys(ROLE_PERMISSIONS),
          matrix: currentMatrix
        }
      })
    } catch (err) {
      logger.error("Error in getPermissionsMatrix:", err)
      res.status(500).json({ status: 500, message: "Internal server error" })
    }
  },

  /**
   * Met à jour la matrice des permissions
   */
  updatePermissionsMatrix: async (req, res) => {
    try {
      const { matrix } = req.body

      if (!matrix || typeof matrix !== 'object') {
        return res.status(400).json({ status: 400, message: "Invalid matrix format" })
      }

      // Sauvegarder dans EventConfig
      const [config, created] = await EventConfig.findOrCreate({
        where: { key: "role_permissions" },
        defaults: {
          key: "role_permissions",
          value: JSON.stringify(matrix),
          type: "json",
          label: "Permissions des rôles (RBAC)",
          group: "system"
        }
      })

      if (!created) {
        config.value = JSON.stringify(matrix)
        await config.save()
      }

      // Note: Le cache du middleware expirera tout seul après 5 minutes
      // ou on pourrait implémenter un moyen de le purger ici.

      res.json({
        status: 200,
        message: "Permissions mises à jour avec succès",
        data: matrix
      })
    } catch (err) {
      logger.error("Error in updatePermissionsMatrix:", err)
      res.status(500).json({ status: 500, message: "Internal server error" })
    }
  }
}
