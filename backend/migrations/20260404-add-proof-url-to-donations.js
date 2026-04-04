module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDesc = await queryInterface.describeTable("donations")
    if (!tableDesc.proof_url) {
      await queryInterface.addColumn("donations", "proof_url", {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "URL de la preuve de paiement (image/PDF uploadé par l'admin)",
      })
    }
  },

  down: async (queryInterface) => {
    const tableDesc = await queryInterface.describeTable("donations")
    if (tableDesc.proof_url) {
      await queryInterface.removeColumn("donations", "proof_url")
    }
  },
}
