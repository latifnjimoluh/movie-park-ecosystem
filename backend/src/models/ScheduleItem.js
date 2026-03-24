const { DataTypes } = require("sequelize")
const { v4: uuidv4 } = require("uuid")

module.exports = (sequelize) => {
  const ScheduleItem = sequelize.define(
    "ScheduleItem",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Plage horaire ex: 18h00 - 18h30",
      },
      title_fr: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title_en: {
        type: DataTypes.STRING,
      },
      description_fr: {
        type: DataTypes.TEXT,
      },
      description_en: {
        type: DataTypes.TEXT,
      },
      is_surprise: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "Affiche le bloc surprise sous cet item",
      },
      is_after: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "Affiche le bloc after-midnight sous cet item",
      },
      is_teaser: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "Affiche un message de teaser discret",
      },
      display_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "schedule_items",
      timestamps: true,
    },
  )

  return ScheduleItem
}
