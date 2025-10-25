const { DataTypes, Model } = require('sequelize');

const { PROFESOR_VARIABLE } = require('./profesor.model');
const { TUTOR_VARIABLE } = require('./tutores.model');
const { EMPRESA_VARIABLE } = require('./empresa.model');

const ALUMNO_VARIABLE = 'alumno';

const alumnoSchema = {

    //Atributos
    id_alumno: {
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

    telefono2: {
        type: DataTypes.BIGINT,
        allowNull: true
    },

    localidad: {
        type: DataTypes.STRING,
        allowNull: false
    },

    fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    nivel_ingles: {
        type: DataTypes.STRING,
        allowNull: false
    },

    foto: {
        type: DataTypes.STRING,
        allowNull: true
    },

    //Llaves foraneas
    id_profesor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_profesor',
        references: {
            model: PROFESOR_VARIABLE,
            key: 'id_profesor'

        }
    },

    id_tutor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_tutor',
        references: {
            model: TUTOR_VARIABLE,
            key: 'id_tutor'
        }
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
//Clase Alumno para enviar a la base de datos
class Alumno extends Model {
    static associate(models) {

        //Recibe la llave foranea de la tabla Prof
        this.hasMany(models.Alumno, { as: 'Profesor', foreignKey: 'id_profesor' });
        this.hasMany(models.Alumno, { as: 'Tutor', foreignKey: 'id_tutor' });
        this.hasMany(models.Alumno, { as: 'Empresa', foreignKey: 'id_empresa' });

        // Enviamos la llave primaria a la tabla Ticket
        this.belongsTo(models.Ticket, { as: 'Ticket', foreignKey: 'id_alumno' });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: ALUMNO_VARIABLE,
            modelName: 'Alumno',
            timestamps: false
        }
    }
}

//Exportar el esquema y la clase para ser utilizado en otros archivos
module.exports = { ALUMNO_VARIABLE, alumnoSchema, Alumno };