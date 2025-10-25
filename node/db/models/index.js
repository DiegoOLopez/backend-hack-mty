const { Alumno, alumnoSchema } = require('./alumno.model');
const { Profesor, profesorSchema } = require('./profesor.model');
const { Ticket, ticketSchema } = require('./ticket.model');
const { Tutor, tutorSchema } = require('./tutores.model');
// Mes y anio
const { mesSchema, Mes } = require('./mes.model')
const { anioSchema, Anio } = require('./anio.model')

// Usuario
const { UsuarioSchema, Usuario  } = require('./usuario.model')

// Añadimos empresas y roles
const { Empresa, empresaSchema } = require('./empresa.model');
const { Roles, rolesSchema } = require('./roles.model');

const { Suscripcion, suscripcionSchema } = require('./suscripcion.model');

// Llamamos recuperacion
const { Recuperacion, RecuperacionSchema } =  require('./recuperacion.model');


function setupModels(sequelize) {
    Alumno.init(alumnoSchema, Alumno.config(sequelize));
    Profesor.init(profesorSchema, Profesor.config(sequelize));
    Ticket.init(ticketSchema, Ticket.config(sequelize));
    Tutor.init(tutorSchema, Tutor.config(sequelize));
    // Mes y anio
    Anio.init(anioSchema, Anio.config(sequelize));
    Mes.init(mesSchema, Mes.config(sequelize));
    // Usuario
    Usuario.init(UsuarioSchema, Usuario.config(sequelize));
    // Init empresas y roles
    Empresa.init(empresaSchema, Empresa.config(sequelize));
    Roles.init(rolesSchema, Roles.config(sequelize));
    // Suscripcion
    Suscripcion.init(suscripcionSchema, Suscripcion.config(sequelize));
    // Recuperacion
    Recuperacion.init(RecuperacionSchema, Recuperacion.config(sequelize));

    Alumno.associate(sequelize.models);
    Profesor.associate(sequelize.models);
    Ticket.associate(sequelize.models);
    Tutor.associate(sequelize.models);
    // Mes y anio
    Anio.associate(sequelize.models);
    Mes.associate(sequelize.models);
    // Usuario
    Usuario.associate(sequelize.models);
    // Associate empresas y roles
    Empresa.associate(sequelize.models);
    Roles.associate(sequelize.models);

    Suscripcion.associate(sequelize.models);
    // Recuperacion
    Recuperacion.associate(sequelize.models);
}

module.exports = setupModels;