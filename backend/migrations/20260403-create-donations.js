module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("donations", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      donor_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      payment_status: {
        type: Sequelize.ENUM("pending", "completed", "failed"),
        defaultValue: "pending",
        allowNull: false,
      },
      transaction_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    })

    await queryInterface.addIndex("donations", ["payment_status"])
    await queryInterface.addIndex("donations", ["email"])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("donations")
    // Supprimer le type ENUM manuellement pour PostgreSQL
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_donations_payment_status";'
    )
  },
}
