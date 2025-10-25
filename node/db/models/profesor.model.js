const { DataTypes, Model } = require('sequelize');
const { EMPRESA_VARIABLE } = require('./empresa.model');

const PROFESOR_VARIABLE = 'profesor';

const profesorSchema = {

    //Atributos
    id_profesor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },

    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },

    apellido_paterno: {
        type: DataTypes.STRING,
        allowNull: false
    },

    apellido_materno: {
        type: DataTypes.STRING,
        allowNull: false
    },

    telefono1: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    localidad: {
        type: DataTypes.STRING,
        allowNull: false
    },

    fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        allowNullNull: false
    },

    id_empresa: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_empresa',
        references: {
            model: EMPRESA_VARIABLE,
            key: 'id_empresa'
        }
    }
}

//Clase Profesor para enviar a la base de datos
class Profesor extends Model {
    static associate(models) {
        this.hasMany(models.Profesor, { as: 'Empresa', foreignKey: 'id_empresa' });

        this.belongsTo(models.Alumno, { as: 'Alumno', foreignKey: 'id_profesor' });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: PROFESOR_VARIABLE,
            modelNAme: 'Profesor',
            timestamps: false
        }
    }
}

//Exportar el esquema y la clase para ser utilizado en otros archivos
module.exports = { PROFESOR_VARIABLE, profesorSchema, Profesor };