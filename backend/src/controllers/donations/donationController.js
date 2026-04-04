const { Donation } = require("../../models")

/**
 * POST /api/donations
 * Enregistrer une intention de don (statut: pending)
 */
const createDonation = async (req, res) => {
  const { donor_name, amount, email } = req.body

  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ error: "Veuillez indiquer un montant valide." })
  }

  const donation = await Donation.create({
    donor_name: donor_name?.trim() || null,
    amount: Number(amount),
    email: email?.trim() || null,
    payment_status: "pending",
  })

  return res.status(201).json({
    message: "Don enregistré. Merci pour votre générosité !",
    donation,
  })
}

/**
 * PATCH /api/donations/:id/confirm
 * Confirmer un don après réception du paiement
 */
const confirmDonation = async (req, res) => {
  const { id } = req.params
  const { transaction_id, proof_url } = req.body

  const donation = await Donation.findByPk(id)
  if (!donation) {
    return res.status(404).json({ error: "Don introuvable." })
  }

  await donation.update({
    payment_status: "completed",
    transaction_id: transaction_id?.trim() || null,
    proof_url: proof_url || null,
  })

  return res.json({
    message: "Don confirmé avec succès.",
    donation,
  })
}

/**
 * POST /api/donations/:id/proof
 * Uploader une preuve de paiement (image/PDF) pour un don
 */
const uploadDonationProof = async (req, res) => {
  const { id } = req.params

  const donation = await Donation.findByPk(id)
  if (!donation) {
    return res.status(404).json({ error: "Don introuvable." })
  }

  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier fourni." })
  }

  const proof_url = `/uploads/payments/${req.file.filename}`
  return res.json({ proof_url })
}

/**
 * PATCH /api/donations/:id/fail
 * Marquer un don comme échoué
 */
const failDonation = async (req, res) => {
  const { id } = req.params

  const donation = await Donation.findByPk(id)
  if (!donation) {
    return res.status(404).json({ error: "Don introuvable." })
  }

  await donation.update({ payment_status: "failed" })

  return res.json({ message: "Don marqué comme échoué.", donation })
}

/**
 * GET /api/donations
 * Lister tous les dons (admin seulement)
 */
const getAllDonations = async (req, res) => {
  const donations = await Donation.findAll({
    order: [["createdAt", "DESC"]],
  })

  const total = donations
    .filter((d) => d.payment_status === "completed")
    .reduce((sum, d) => sum + Number(d.amount), 0)

  return res.json({ donations, total_collected: total })
}

module.exports = { createDonation, confirmDonation, failDonation, getAllDonations, uploadDonationProof }
