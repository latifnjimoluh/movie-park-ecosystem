require("dotenv").config()
const path = require("path")

const useSSL = process.env.DB_SSL === "true"

// Configuration pour la production (Hébergement Cloud)
if (process.env.DATABASE_URL) {
  module.exports = {
    development: {
      url: process.env.DATABASE_URL,
      dialect: "postgres",
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    },
    production: {
      url: process.env.DATABASE_URL,
      dialect: "postgres",
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    }
  }
} else {
  // Configuration pour le développement local
  const localConfig = {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "Nexus2023.",
    database: process.env.DB_NAME || "movie",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
    seederStorage: "sequelize",
  }

  module.exports = {
    development: localConfig,
    test: { ...localConfig, database: "movie_test" },
    production: localConfig
  }
}
