'use strict';
const { CONVERSACION, ConversacionSchema } = require('./../models/conversacion.model');
const { MENSAJE, MensajeSchema } = require('./../models/mensaje.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
        await queryInterface.createTable(CONVERSACION, ConversacionSchema);

    // Crear tabla de mensaje
    await queryInterface.createTable(MENSAJE, MensajeSchema);
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
        await queryInterface.dropTable(MENSAJE);
    await queryInterface.dropTable(CONVERSACION);
  }
};
