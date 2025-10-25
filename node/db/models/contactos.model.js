const { Model, DataTypes } = require('sequelize');

const CONTACTO_TABLE = 'contactos';

const ContactoSchema = {
  nombre: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING,
  },
  numero_cuenta: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
cuenta_id: {
  allowNull: false,
  type: DataTypes.STRING, // antes era INTEGER
},
  fecha_creacion: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

class Contacto extends Model {
  static associate(models) {
    // Puedes enlazar con la tabla de cuentas o usuarios si quieres:
    // this.belongsTo(models.Usuario, { as: 'usuario', foreignKey: 'cuenta_id' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CONTACTO_TABLE,
      modelName: 'Contacto',
      timestamps: false,
    };
  }
}

module.exports = { CONTACTO_TABLE, ContactoSchema, Contacto };
