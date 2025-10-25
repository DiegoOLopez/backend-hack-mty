const { Model, DataTypes, Sequelize } = require('sequelize');
const { EMPRESA_VARIABLE } = require('./empresa.model');
const { ROLES_TABLE} = require('./roles.model');
const { SUSCRIPCION_VARIABLE } = require('./suscripcion.model');
const USUARIO = 'usuario';

const UsuarioSchema = {

  id_usuario: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },

  correo: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true //Valida que sea un correo electronico valido
    }
  },

  contrasena: {
    allowNull: false,
    type: DataTypes.STRING
  },

  verificado: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },

  token_verificacion: {
    allowNull: true,
    type: DataTypes.STRING,
  },

  expira_token: {
    allowNull: true,
    type: DataTypes.DATE,
  },

  fecha_creacion: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'fecha_creacion',
    defaultValue: Sequelize.NOW
  },

  //Suscripciones

  fecha_inicio: {
          type: DataTypes.DATE,
          allowNull: true
      },
      
      suscripcion_estado: {
          type: DataTypes.BOOLEAN,
          allowNull: true
      },
  
      fecha_fin: {
          type: DataTypes.DATE,
          allowNull: true
      },

  id_cliente: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,

  }

}

class Usuario extends Model {
  static associate(models) {
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USUARIO,
      modelName: 'Usuario',
      timestamps: false
    }
  }
}

module.exports = { USUARIO, UsuarioSchema, Usuario };
