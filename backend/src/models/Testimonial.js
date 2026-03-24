const { DataTypes } = require("sequelize")
const { v4: uuidv4 } = require("uuid")

module.exports = (sequelize) => {
  const Testimonial = sequelize.define(
    "Testimonial",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      quote_fr: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      quote_en: {
        type: DataTypes.TEXT,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pack_name: {
        type: DataTypes.STRING,
        comment: "Nom du pack acheté ex: Pack VIP",
      },
      edition: {
        type: DataTypes.STRING,
        comment: "Édition ex: Decembre 2024",
      },
      photo_url: {
        type: DataTypes.STRING,
        comment: "Chemin vers la photo du participant",
      },
      image_url: {
        type: DataTypes.STRING,
        comment: "Chemin de l'image uploadée localement",
      },
      rating: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        validate: { min: 1, max: 5 },
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      display_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "testimonials",
      timestamps: true,
    },
  )

  return Testimonial
}
