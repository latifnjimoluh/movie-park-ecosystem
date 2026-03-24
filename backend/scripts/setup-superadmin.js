const { sequelize, User, Role } = require("../src/models")
const bcryptjs = require("bcryptjs")
const { DEFAULT_ROLE_PERMISSIONS } = require("../src/middlewares/permissions")

async function setup() {
  try {
    console.log("⏳ Connexion à la base de données...")
    await sequelize.authenticate()
    
    console.log("⏳ Synchronisation du schéma...")
    await sequelize.sync()

    console.log("⏳ Initialisation des rôles...")
    const rolesData = [
      { name: 'superadmin', label: 'Super Administrateur', is_system: true, permissions: DEFAULT_ROLE_PERMISSIONS.superadmin },
      { name: 'admin',      label: 'Administrateur',       is_system: true, permissions: DEFAULT_ROLE_PERMISSIONS.admin },
      { name: 'cashier',    label: 'Caissier / Vendeur',   is_system: true, permissions: DEFAULT_ROLE_PERMISSIONS.cashier },
      { name: 'scanner',    label: 'Contrôleur Entrée',    is_system: true, permissions: DEFAULT_ROLE_PERMISSIONS.scanner },
    ]

    for (const r of rolesData) {
      const [role, created] = await Role.findOrCreate({
        where: { name: r.name },
        defaults: r
      })
      if (!created) {
        role.permissions = r.permissions
        await role.save()
      }
    }

    const superadminRole = await Role.findOne({ where: { name: 'superadmin' } })

    console.log("⏳ Création de l'utilisateur SuperAdmin...")
    const adminEmail = "latifnjimoluh@gmail.com"
    const adminPassword = "AdminPassword123!"
    
    const [user, created] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        name: "Super Admin",
        password_hash: bcryptjs.hashSync(adminPassword, 10),
        role: "superadmin",
        role_id: superadminRole.id,
        phone: "672475691"
      }
    })

    if (!created) {
      user.password_hash = bcryptjs.hashSync(adminPassword, 10)
      user.role_id = superadminRole.id
      user.role = "superadmin"
      await user.save()
      console.log("✅ SuperAdmin mis à jour.")
    } else {
      console.log("✅ SuperAdmin créé avec succès.")
    }

    console.log("\n--------------------------------------------------")
    console.log(`Email: ${adminEmail}`)
    console.log(`Pass:  ${adminPassword}`)
    console.log("--------------------------------------------------\n")

    process.exit(0)
  } catch (err) {
    console.error("❌ Erreur lors du setup:", err)
    process.exit(1)
  }
}

setup()
