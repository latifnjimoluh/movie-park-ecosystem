require("dotenv").config()
const path = require("path")

const useSSL = process.env.DB_SSL === "true"

// Configuration de base
let dbConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  dialect: "postgres",
  logging: false,
  seederStorage: "sequelize",
  dialectOptions: useSSL ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {}
}

// Support de l'URL de connexion complète (standard sur Render/Heroku)
if (process.env.DATABASE_URL) {
  dbConfig.url = process.env.DATABASE_URL
}

module.exports = {
  development: {
    ...dbConfig,
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "Nexus2023.",
    database: process.env.DB_NAME || "movie",
    host: process.env.DB_HOST || "localhost",
  },
  test: {
    username: "postgres",
    password: "postgres",
    database: "movie_in_the_park_test",
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    logging: false,
  },
  production: {
    ...dbConfig
  },
}
