const { Model, DataTypes, Sequelize } = require('sequelize')

const ROLES_TABLE = 'roles';

const rolesSchema = {
    id_rol: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    rol: {
        allowNull: false,
        type: DataTypes.STRING
    }
}

class Roles extends Model {
    static associate(models) {
        this.belongsTo(models.Usuario, { as: 'usuario', foreignKey: 'id_rol' })
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: ROLES_TABLE,
            modelName: 'Roles',
            timestamps: false
        }
    }
}


module.exports = { ROLES_TABLE, rolesSchema, Roles };