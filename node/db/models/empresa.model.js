const { Model, DataTypes, Sequelize } = require('sequelize')

const EMPRESA_VARIABLE = 'empresa'

const empresaSchema = {
    id_empresa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    nombre: {
        allowNull: false,
        type: DataTypes.STRING
    },
    telefono: {
        allowNull: false,
        type: DataTypes.STRING
    },
    email: {
        allowNull: false,
        type: DataTypes.STRING
    },
    rfc: {
        allowNull: true,
        type: DataTypes.STRING
    }
}

// Clase Empresa para enviar a la base de datos
class Empresa extends Model {
    static associate(models) {
        //Se envia la llave primary key de la tabla Empresa a todas las tablas 
        this.belongsTo(models.Alumno, { as: 'alumno', foreignKey: 'id_empresa' })
        this.belongsTo(models.Anio, { as: 'anio', foreignKey: 'id_empresa' })
        this.belongsTo(models.Mes, { as: 'mes', foreignKey: 'id_empresa' })
        this.belongsTo(models.Profesor, { as: 'profesor', foreignKey: 'id_empresa' })
        this.belongsTo(models.Tutor, { as: 'tutor', foreignKey: 'id_empresa' })
        this.belongsTo(models.Usuario, { as: 'usuario', foreignKey: 'id_empresa' })
        this.belongsTo(models.Ticket, { as: 'ticket', foreignKey: 'id_empresa' })


    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: EMPRESA_VARIABLE,
            modelName: 'Empresa',
            timestamps: false
        }
    }
}

// Exportamos el modelo
module.exports = {EMPRESA_VARIABLE, empresaSchema, Empresa};