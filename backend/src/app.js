require("express-async-errors")
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const cookieParser = require("cookie-parser")
const path = require("path")
const cron = require("node-cron")

// 👇 Fetch natif de Node
const fetch = global.fetch

// Services / Models
const ActionLog = require("./models/ActionLog")
const actionLogService = require("./services/logService")
const auditService = require("./services/auditService")
const contactService = require("./services/contactService")

// Routes
const authRoutes = require("./routes/authRoutes")
const packRoutes = require("./routes/packRoutes")
const reservationRoutes = require("./routes/reservationRoutes")
const paymentRoutes = require("./routes/paymentRoutes")
const ticketRoutes = require("./routes/ticketRoutes")
const scanRoutes = require("./routes/scanRoutes")
const userRoutes = require("./routes/userRoutes")
const auditRoutes = require("./routes/auditRoutes")
const contactRoutes = require("./routes/contactRoutes")
const trackingRoutes = require("./routes/trackingRoutes")
// Contenu dynamique
const filmRoutes = require("./routes/filmRoutes")
const scheduleRoutes = require("./routes/scheduleRoutes")
const testimonialRoutes = require("./routes/testimonialRoutes")
const eventConfigRoutes = require("./routes/eventConfigRoutes")
const donationRoutes = require("./routes/donationRoutes")

const errorHandler = require("./middlewares/errorHandler")

const app = express()

// ============================================
// HELMET - CSP sécurisée
// ============================================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"],
        frameAncestors: [
          "'self'",
          "http://localhost:3002",
          "http://localhost:3001"
        ],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
)

// ============================================
// CORS - Autorisations complètes
// ============================================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      process.env.FRONTEND_URL,
      process.env.FRONTEND_URL2,
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: [
      "Content-Disposition",
      "Content-Type",
      "Content-Length",
    ],
  })
)

// ============================================
// BODY PARSER + COOKIE PARSER
// ============================================
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "10mb", extended: true }))
app.use(cookieParser())

// ============================================
// STATIC FILES
// ============================================
const uploadPath = path.join(process.cwd(), "uploads")
app.use("/uploads", express.static(uploadPath))

// ============================================
// API ROUTES
// ============================================
app.use("/api/auth", authRoutes)
app.use("/api/packs", packRoutes)
app.use("/api/reservations", reservationRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/tickets", ticketRoutes)
app.use("/api/scan", scanRoutes)
app.use("/api/users", userRoutes)
app.use("/api/audit", auditRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/track", trackingRoutes)
// Contenu dynamique
app.use("/api/films", filmRoutes)
app.use("/api/schedule", scheduleRoutes)
app.use("/api/testimonials", testimonialRoutes)
app.use("/api/event-config", eventConfigRoutes)
app.use("/api/donations", donationRoutes)

// ============================================
// HEALTH CHECK
// ============================================
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  })
})

// ============================================
// KEEPALIVE ENDPOINT
// ============================================
app.get("/api/keepalive", (req, res) => {
  res.json({
    status: "alive",
    time: new Date().toISOString(),
  })
})

// ============================================
// CRON KEEPALIVE — toutes les 5 minutes
// ============================================
// cron.schedule("*/5 * * * *", async () => {
//   console.log("⏱️ CRON KEEPALIVE lancé :", new Date().toISOString())

//   const frontend1 = process.env.FRONTEND_LOGIN_URL
//   const frontend2 = process.env.FRONTEND_URL2
//   const backend = process.env.BACKEND_KEEPALIVE_URL

//   try {
//     // 🔵 Ping FRONTEND 1
//     if (frontend1) {
//       const res1 = await fetch(frontend1)
//       console.log("🌐 Ping frontend 1:", res1.status)
//     }

//     // 🔵 Ping FRONTEND 2
//     if (frontend2) {
//       const res2 = await fetch(frontend2)
//       console.log("🌐 Ping frontend 2:", res2.status)
//     }

//     // 🟢 Ping BACKEND
//     if (backend) {
//       const res3 = await fetch(backend)
//       console.log("🟢 Ping backend keepalive:", res3.status)
//     }
//   } catch (err) {
//     console.error("❌ Erreur CRON keepalive :", err.message)
//   }
// })

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({ status: 404, message: "Route not found" })
})

// ============================================
// GLOBAL ERROR HANDLER
// ============================================
app.use(errorHandler)

module.exports = app
