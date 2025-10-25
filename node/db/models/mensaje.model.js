// models/mensaje.model.js
const { Model, DataTypes, Sequelize } = require('sequelize');

const MENSAJE = 'mensajes';

const MensajeSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },

  conversacion_id: {
    allowNull: false,
    type: DataTypes.INTEGER
  },

  remitente: {
    allowNull: false,
    type: DataTypes.ENUM('usuario', 'bot')
  },

  contenido: {
    allowNull: false,
    type: DataTypes.TEXT
  },

  fecha_envio: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
};

class Mensaje extends Model {
  static associate(models) {
    this.belongsTo(models.Conversacion, {
      foreignKey: 'conversacion_id',
      as: 'conversacion',
      onDelete: 'CASCADE'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: MENSAJE,
      modelName: 'Mensaje',
      timestamps: false
    };
  }
}

module.exports = { MENSAJE, MensajeSchema, Mensaje };
