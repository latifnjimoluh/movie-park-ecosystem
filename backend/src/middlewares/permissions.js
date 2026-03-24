const { Role, EventConfig } = require("../models")
const logger = require("../config/logger")

/**
 * Permissions par défaut (utilisées lors de l'initialisation de la DB)
 */
const DEFAULT_ROLE_PERMISSIONS = {
  superadmin: [
    "reservations.view", "reservations.view.all", "reservations.create", "reservations.edit", 
    "reservations.edit.status", "reservations.delete", "reservations.export", "reservations.statistics",
    "payments.view", "payments.view.all", "payments.create", "payments.edit", "payments.delete", 
    "payments.export", "payments.approve", "payments.statistics",
    "tickets.view", "tickets.view.all", "tickets.create", "tickets.generate", "tickets.download", "tickets.preview",
    "scan.validate", "scan.decode", "scan.search", "scan.statistics",
    "packs.view", "packs.view.all", "packs.create", "packs.edit", "packs.delete",
    "users.view", "users.view.all", "users.create", "users.edit", "users.manage_permissions",
    "audit.view.all", "content.view", "content.create", "content.edit", "content.delete"
  ],
  admin: [
    "reservations.view", "reservations.view.all", "reservations.create", "reservations.edit", 
    "reservations.export", "reservations.statistics",
    "payments.view", "payments.view.all", "payments.create", "payments.approve",
    "tickets.view", "tickets.view.all", "tickets.generate", "tickets.download", "tickets.preview",
    "scan.validate", "scan.decode", "scan.search",
    "packs.view", "packs.view.all", "packs.create", "packs.edit",
    "users.view", "users.view.all", "content.view", "content.edit"
  ],
  cashier: [
    "reservations.view", "reservations.create", "reservations.edit",
    "payments.view", "payments.create",
    "tickets.view", "tickets.download", "tickets.preview",
    "packs.view"
  ],
  scanner: [
    "tickets.view", "scan.validate", "scan.decode", "scan.search"
  ]
}

// Cache local pour les rôles
let rolesCache = new Map()
let lastCacheUpdate = 0
const CACHE_TTL = 1000 * 60 * 2 // 2 minutes

/**
 * Charge tous les rôles depuis la base de données et les met en cache
 */
const refreshRolesCache = async () => {
  try {
    const roles = await Role.findAll()
    const newCache = new Map()
    roles.forEach(r => {
      newCache.set(r.id, r.permissions)
      newCache.set(r.name, r.permissions) // Permet de chercher par nom aussi
    })
    rolesCache = newCache
    lastCacheUpdate = Date.now()
    return true
  } catch (err) {
    logger.error("Error refreshing roles cache:", err)
    return false
  }
}

/**
 * Middleware pour vérifier une permission
 */
const checkPermission = (permission) => async (req, res, next) => {
  try {
    const user = req.user
    if (!user) return res.status(401).json({ status: 401, message: "Non authentifié" })

    // 1. Le superadmin a TOUJOURS tout par défaut (sécurité critique)
    if (user.role === 'superadmin') return next()

    // 2. Vérifier le cache
    if (Date.now() - lastCacheUpdate > CACHE_TTL) {
      await refreshRolesCache()
    }

    // 3. Récupérer les permissions (priorité au role_id, puis au nom du role)
    let userPermissions = rolesCache.get(user.role_id) || rolesCache.get(user.role)

    // 4. Si pas dans le cache, on tente une lecture directe en DB (sécurité)
    if (!userPermissions) {
      const roleDoc = user.role_id 
        ? await Role.findByPk(user.role_id)
        : await Role.findOne({ where: { name: user.role } })
      
      if (roleDoc) {
        userPermissions = roleDoc.permissions
        rolesCache.set(roleDoc.id, userPermissions)
        rolesCache.set(roleDoc.name, userPermissions)
      }
    }

    // 5. Vérification finale
    if (userPermissions && userPermissions.includes(permission)) {
      return next()
    }

    logger.warn(`Permission refusée : User ${user.id} (${user.role}) -> ${permission}`)
    return res.status(403).json({
      status: 403,
      message: "Action non autorisée pour votre profil.",
    })
  } catch (err) {
    logger.error("Erreur checkPermission:", err)
    return res.status(500).json({ status: 500, message: "Erreur serveur" })
  }
}

module.exports = { checkPermission, refreshRolesCache, DEFAULT_ROLE_PERMISSIONS }
