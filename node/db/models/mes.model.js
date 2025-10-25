const { Model, DataTypes, Sequelize } = require('sequelize')
const { EMPRESA_VARIABLE } = require('./empresa.model')

const MES_VARIABLE = 'mes'

const mesSchema = {

  id_mes: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },

  mes: {
    allowNull: false,
    type: DataTypes.STRING
  }

}

class Mes extends Model {
  static associate(models) {

    this.belongsTo(models.Ticket, { as: 'ticket', foreignKey: 'id_mes' })
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: MES_VARIABLE,
      modelName: 'Mes',
      timestamps: false
    }
  }
}


// Exportar tabla, esquema y modelo
module.exports = { MES_VARIABLE, mesSchema, Mes }
