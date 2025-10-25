'use strict';
const { MES_VARIABLE, mesSchema } = require('./../models/mes.model');
const { ANIO_VARIABLE, anioSchema } = require('./../models/anio.model');
const { TICKET_VARIABLE, ticketSchema } = require('./../models/ticket.model');
const { USUARIO, UsuarioSchema } = require('./../models/usuario.model');
const { TUTOR_VARIABLE, tutorSchema } = require('./../models/tutores.model');
const { PROFESOR_VARIABLE, profesorSchema } = require('./../models/profesor.model');
const { ALUMNO_VARIABLE, alumnoSchema } = require('./../models/alumno.model');
const { EMPRESA_VARIABLE, empresaSchema } = require('./../models/empresa.model');
const { ROLES_TABLE, rolesSchema } = require('./../models/roles.model');
const { SUSCRIPCION_VARIABLE, suscripcionSchema } = require('./../models/suscripcion.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(ROLES_TABLE, rolesSchema);
    //Crear las tablas
    await queryInterface.createTable(EMPRESA_VARIABLE, empresaSchema);
    await queryInterface.createTable(MES_VARIABLE, mesSchema);
    await queryInterface.createTable(ANIO_VARIABLE, anioSchema);
    await queryInterface.createTable(TUTOR_VARIABLE, tutorSchema);
    await queryInterface.createTable(PROFESOR_VARIABLE, profesorSchema);
    await queryInterface.createTable(ALUMNO_VARIABLE, alumnoSchema);
    await queryInterface.createTable(SUSCRIPCION_VARIABLE, suscripcionSchema);
    await queryInterface.createTable(USUARIO, UsuarioSchema);
    await queryInterface.createTable(TICKET_VARIABLE, ticketSchema);
    

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


    //Eliminar las tablas
    await queryInterface.dropTable(TICKET_VARIABLE);
    await queryInterface.dropTable(USUARIO);
    await queryInterface.dropTable(SUSCRIPCION_VARIABLE);
    await queryInterface.dropTable(ALUMNO_VARIABLE);
    await queryInterface.dropTable(PROFESOR_VARIABLE);
    await queryInterface.dropTable(TUTOR_VARIABLE);
    await queryInterface.dropTable(ANIO_VARIABLE);
    await queryInterface.dropTable(MES_VARIABLE);
    await queryInterface.dropTable(EMPRESA_VARIABLE);
    await queryInterface.dropTable(ROLES_TABLE);
    await queryInterface.dropTable(SUSCRIPCION_VARIABLE);
    
  }
};
