const { DataTypes, Model } = require('sequelize');

const { ALUMNO_VARIABLE } = require('./alumno.model');

const { MES_VARIABLE } = require('./mes.model');
const { ANIO_VARIABLE } = require('./anio.model');
const { EMPRESA_VARIABLE } = require('./empresa.model');

const TICKET_VARIABLE = 'ticket';

const ticketSchema = {

    //Atributos
    id_ticket: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },

    monto: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },

    estado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_pago: {
        type: DataTypes.DATE,
        allowNull: false
    },

    //Llaves foraneas
    id_alumno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_alumno',
        references: {
            model: ALUMNO_VARIABLE,
            key: 'id_alumno'
        }
    },

    id_mes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_mes',
        references: {
            model: MES_VARIABLE,
            key: 'id_mes'
        }
    },

    id_anio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_anio',
        references: {
            model: ANIO_VARIABLE,
            key: 'id_anio'
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

//Clase Ticket para enviar a la base de datos
class Ticket extends Model {
    static associate(models) {
        this.hasMany(models.Ticket, { as: 'Alumno', foreignKey: 'id_alumno' });
        this.hasMany(models.Ticket, { as: 'Mes', foreignKey: 'id_mes' });
        this.hasMany(models.Ticket, { as: 'Anio', foreignKey: 'id_anio' });
        this.hasMany(models.Ticket, { as: 'Empresa', foreignKey: 'id_empresa' });
    }

    //Configuracion de la tabla
    static config(sequelize) {
        return {
            sequelize,
            tableName: TICKET_VARIABLE,
            modelName: 'Ticket',
            timestamps: false
        }
    }
}

//Exportar el esquema y la clase para ser utilizado en otros archivos
module.exports = { TICKET_VARIABLE, ticketSchema, Ticket };