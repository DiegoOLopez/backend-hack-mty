const { Model, DataTypes, Sequelize } = require('sequelize')

const { EMPRESA_VARIABLE } = require('./empresa.model')

const ANIO_VARIABLE = 'anio'

const anioSchema = {

  id_anio: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  }
}

class Anio extends Model {
  static associate(models) {

    this.belongsTo(models.Ticket, { as: 'Ticket', foreignKey: 'id_anio' })
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ANIO_VARIABLE,
      modelName: 'Anio',
      timestamps: false
    }
  }
}

// Exportar tabla, esquema y modelo
module.exports = { ANIO_VARIABLE, anioSchema, Anio }
