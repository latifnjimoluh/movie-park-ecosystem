const { Role } = require("../../models")
const { DEFAULT_ROLE_PERMISSIONS, refreshRolesCache } = require("../../middlewares/permissions")
const logger = require("../../config/logger")

module.exports = {
  /**
   * Liste tous les rôles (avec leurs permissions)
   */
  getAllRoles: async (req, res) => {
    try {
      let roles = await Role.findAll({ order: [['label', 'ASC']] })

      // Migration automatique si aucun rôle en base
      if (roles.length === 0) {
        logger.info("No roles found in DB, initializing from defaults...")
        const initialRoles = [
          { name: 'superadmin', label: 'Super Administrateur', is_system: true, permissions: DEFAULT_ROLE_PERMISSIONS.superadmin },
          { name: 'admin',      label: 'Administrateur',       is_system: true, permissions: DEFAULT_ROLE_PERMISSIONS.admin },
          { name: 'cashier',    label: 'Caissier / Vendeur',   is_system: true, permissions: DEFAULT_ROLE_PERMISSIONS.cashier },
          { name: 'scanner',    label: 'Contrôleur Entrée',    is_system: true, permissions: DEFAULT_ROLE_PERMISSIONS.scanner },
        ]
        await Role.bulkCreate(initialRoles)
        roles = await Role.findAll({ order: [['label', 'ASC']] })
        await refreshRolesCache()
      }

      res.json({ status: 200, data: roles })
    } catch (err) {
      logger.error("Error in getAllRoles:", err)
      res.status(500).json({ status: 500, message: "Erreur serveur" })
    }
  },

  /**
   * Met à jour les permissions d'un rôle
   */
  updateRolePermissions: async (req, res) => {
    try {
      const { id } = req.params
      const { permissions } = req.body

      const role = await Role.findByPk(id)
      if (!role) return res.status(404).json({ status: 404, message: "Rôle non trouvé" })

      // Sécurité : ne pas vider les permissions du superadmin
      if (role.name === 'superadmin' && (!permissions || permissions.length === 0)) {
        return res.status(400).json({ status: 400, message: "Impossible de retirer tous les droits au superadmin" })
      }

      role.permissions = permissions
      await role.save()
      
      // Forcer le rafraîchissement du cache
      await refreshRolesCache()

      res.json({ status: 200, message: "Permissions mises à jour", data: role })
    } catch (err) {
      logger.error("Error in updateRolePermissions:", err)
      res.status(500).json({ status: 500, message: "Erreur serveur" })
    }
  }
}
