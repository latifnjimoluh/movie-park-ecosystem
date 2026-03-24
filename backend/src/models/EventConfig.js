const { DataTypes } = require("sequelize")
const { v4: uuidv4 } = require("uuid")

module.exports = (sequelize) => {
  const EventConfig = sequelize.define(
    "EventConfig",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.TEXT,
        comment: "Valeur de la configuration",
      },
      type: {
        type: DataTypes.ENUM("text", "number", "boolean", "json"),
        defaultValue: "text",
      },
      label: {
        type: DataTypes.STRING,
        comment: "Label lisible pour l'interface admin",
      },
      group: {
        type: DataTypes.STRING,
        defaultValue: "general",
        comment: "Groupe de configuration: general, hero, contact, social",
      },
    },
    {
      tableName: "event_config",
      timestamps: true,
    },
  )

  return EventConfig
}
