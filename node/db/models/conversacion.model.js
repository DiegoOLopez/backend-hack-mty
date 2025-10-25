// models/conversacion.model.js
const { Model, DataTypes, Sequelize } = require('sequelize');

const CONVERSACION = 'conversaciones';

const ConversacionSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
    data: {
    type: DataTypes.JSON, // MySQL soporta JSON
    allowNull: false
  },

  usuario_id: {
    allowNull: false,
    type: DataTypes.INTEGER
  },

  nombre: {
    allowNull: true,
    type: DataTypes.STRING
  },

  fecha_creacion: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  status: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: "Done"
  }
};

class Conversacion extends Model {
  static associate(models) {
    this.hasMany(models.Mensaje, {
      foreignKey: 'conversacion_id',
      as: 'mensajes',
      onDelete: 'CASCADE'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CONVERSACION,
      modelName: 'Conversacion',
      timestamps: false
    };
  }
}

module.exports = { CONVERSACION, ConversacionSchema, Conversacion };
