const jwt = require("jsonwebtoken")
const logger = require("../config/logger")

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
}

const verifyToken = (req, res, next) => {
  try {
    // Cookie httpOnly prioritaire (XSS-safe), fallback Authorization header
    const token = req.cookies?.access_token || req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ status: 401, message: "No token provided" })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    logger.error("Token verification failed:", err.message)
    res.status(401).json({ status: 401, message: "Invalid token" })
  }
}

const verifyRefreshToken = (req, res, next) => {
  try {
    // Cookie httpOnly prioritaire, fallback body (rétrocompatibilité)
    const refreshToken = req.cookies?.refresh_token || req.body?.refreshToken
    if (!refreshToken) {
      return res.status(401).json({ status: 401, message: "Refresh token required" })
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    logger.error("Refresh token verification failed:", err.message)
    res.status(401).json({ status: 401, message: "Invalid refresh token" })
  }
}

module.exports = { verifyToken, verifyRefreshToken, COOKIE_OPTS }
