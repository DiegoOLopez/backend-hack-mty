const {DataTypes, Model} = require('sequelize');
const {EMPRESA_VARIABLE} = require('./empresa.model');

const TUTOR_VARIABLE = 'tutor';

const tutorSchema = {

    //Atributos
    id_tutor: {
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

    telefono: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    localidad: {
        type: DataTypes.STRING,
        allowNull: false
    },

    fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false
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

//Clase Tutor para enviar a la base de datos
class Tutor extends Model {
    static associate(models) {
        this.hasMany(models.Tutor, { as: 'Empresa', foreignKey: 'id_empresa' });

        this.belongsTo(models.Alumno, { as: 'Alumno', foreignKey: 'id_tutor' });
    }

    //Configuracion de la tabla
    static config(sequelize) {
        return {
            sequelize,
            tableName: TUTOR_VARIABLE,
            modelName: 'Tutor',
            timestamps: false
        }
    }
}

//Exportar el esquema y la clase para ser utilizado en otros archivos
module.exports = {TUTOR_VARIABLE, tutorSchema, Tutor};
