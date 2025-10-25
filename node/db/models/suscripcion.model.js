const { DataTypes, Model } = require('sequelize');

const SUSCRIPCION_VARIABLE = 'suscripcion';

const suscripcionSchema = {
    
    id_suscripcion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },

    tipo_suscripcion: {
        type: DataTypes.STRING,
        allowNull: false
    }
}
class Suscripcion extends Model {
    static associate(models) {
        this.belongsTo(models.Usuario, { as: 'Usuario', foreignKey: 'id_suscripcion' });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: SUSCRIPCION_VARIABLE,
            modelName: 'Suscripcion',
            timestamps: false
        }
    }

}

module.exports = {SUSCRIPCION_VARIABLE, suscripcionSchema, Suscripcion};