const express = require("express")
const router = express.Router()
const {
  createDonation,
  confirmDonation,
  failDonation,
  getAllDonations,
  uploadDonationProof,
} = require("../controllers/donations/donationController")
const { verifyToken } = require("../middlewares/auth")
const uploadPaymentProof = require("../middlewares/uploadPaymentProof")

// Public — enregistrer un don
router.post("/", createDonation)

// Admin — lister tous les dons + total collecté
router.get("/", verifyToken, getAllDonations)

// Admin — uploader une preuve de paiement
router.post("/:id/proof", verifyToken, uploadPaymentProof.single("proof"), uploadDonationProof)

// Admin — confirmer un don
router.patch("/:id/confirm", verifyToken, confirmDonation)

// Admin — marquer un don comme échoué
router.patch("/:id/fail", verifyToken, failDonation)

module.exports = router
