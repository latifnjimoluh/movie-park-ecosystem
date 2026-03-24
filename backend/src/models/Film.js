const { DataTypes } = require("sequelize")
const { v4: uuidv4 } = require("uuid")

module.exports = (sequelize) => {
  const Film = sequelize.define(
    "Film",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      title_fr: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title_en: {
        type: DataTypes.STRING,
      },
      genre_fr: {
        type: DataTypes.STRING,
      },
      genre_en: {
        type: DataTypes.STRING,
      },
      year: {
        type: DataTypes.STRING,
      },
      country_fr: {
        type: DataTypes.STRING,
      },
      country_en: {
        type: DataTypes.STRING,
      },
      duration: {
        type: DataTypes.STRING,
      },
      synopsis_fr: {
        type: DataTypes.TEXT,
      },
      synopsis_en: {
        type: DataTypes.TEXT,
      },
      classification_fr: {
        type: DataTypes.STRING,
      },
      classification_en: {
        type: DataTypes.STRING,
      },
      poster_url: {
        type: DataTypes.STRING,
      },
      image_url: {
        type: DataTypes.STRING,
        comment: "Chemin de l'image uploadée localement",
      },
      youtube_url: {
        type: DataTypes.STRING,
      },
      screening_time: {
        type: DataTypes.STRING,
        comment: "Heure de diffusion ex: 18h30",
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
      tableName: "films",
      timestamps: true,
    },
  )

  return Film
}
