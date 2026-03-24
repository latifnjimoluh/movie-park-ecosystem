const { DataTypes } = require("sequelize")
const { v4: uuidv4 } = require("uuid")

module.exports = (sequelize) => {
  const Role = sequelize.define(
    "Role",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Nom affiché (ex: Administrateur Principal)",
      },
      description: {
        type: DataTypes.STRING,
      },
      permissions: {
        type: DataTypes.JSON,
        defaultValue: [],
        comment: "Liste des permissions [reservations.view, ...]",
      },
      is_system: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "Si vrai, le rôle ne peut pas être supprimé",
      }
    },
    {
      tableName: "roles",
      timestamps: true,
    },
  )

  Role.associate = (models) => {
    Role.hasMany(models.User, { foreignKey: "role_id", as: "users" })
  }

  return Role
}
