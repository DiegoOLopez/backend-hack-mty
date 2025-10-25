'use strict';
//const { TICKET_VARIABLE, ticketSchema } = require('./../models/ticket.model');
//const { USUARIO, UsuarioSchema } = require('./../models/usuario.model');
const { USUARIO, UsuarioSchema } = require('./../models/usuario.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    //await queryInterface.createTable(USUARIO, UsuarioSchema);
    await queryInterface.createTable(USUARIO, UsuarioSchema);
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    //await queryInterface.dropTable(USUARIO);
    await queryInterface.dropTable(USUARIO);
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
