const { DataTypes } = require("sequelize")
const { v4: uuidv4 } = require("uuid")

module.exports = (sequelize) => {
  const Donation = sequelize.define(
    "Donation",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      donor_name: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Nom du donateur (optionnel — don anonyme autorisé)",
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: "Montant du don en XAF",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isEmail: true },
        comment: "Email du donateur pour confirmation",
      },
      payment_status: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        defaultValue: "pending",
        allowNull: false,
      },
      transaction_id: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Référence de transaction Mobile Money",
      },
      proof_url: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "URL de la preuve de paiement (image/PDF uploadé par l'admin)",
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "donations",
      timestamps: true,
    }
  )

  return Donation
}
