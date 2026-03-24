const { DataTypes } = require("sequelize")
const { v4: uuidv4 } = require("uuid")

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "cashier",
      },
      role_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "roles",
          key: "id",
        },
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "users",
      timestamps: true,
    },
  )

  User.associate = (models) => {
    User.hasMany(models.Payment, { foreignKey: "created_by", as: "payments" })
    User.hasMany(models.Ticket, { foreignKey: "generated_by", as: "tickets" })
    User.hasMany(models.ActionLog, { foreignKey: "user_id", as: "actions" })
    User.hasMany(models.ActivityLog, { foreignKey: "user_id", as: "activities" })
  }

  return User
}
