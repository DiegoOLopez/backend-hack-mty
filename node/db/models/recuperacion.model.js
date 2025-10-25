const { Model, DataTypes, Sequelize } = require('sequelize');
const { USUARIO } = require('./usuario.model');

const RECUPERACION = 'recuperacion';

const RecuperacionSchema = {

  id_recuperacion: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },

  change_status: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },

  token_recuperacion: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  expira_at: {
    allowNull: true,
    type: DataTypes.DATE,
  },
  solicitud_at: {
    allowNull: true,
    type: DataTypes.DATE,
  },
  //Llaves foraneas

  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario',
    references: {
      model: USUARIO,
      key: 'id_usuario'
    }
  }
}

class Recuperacion extends Model {
  static associate(models) {
    this.hasMany(models.Recuperacion, { as: 'Usuario', foreignKey: 'id_usuario' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: RECUPERACION,
      modelName: 'Recuperacion',
      timestamps: false
    }
  }
}

module.exports = { RECUPERACION, RecuperacionSchema, Recuperacion };
