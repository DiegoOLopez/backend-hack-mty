// Usuario
const { UsuarioSchema, Usuario  } = require('./usuario.model')
const { ConversacionSchema, Conversacion } = require('./conversacion.model')
const { MensajeSchema, Mensaje } = require('./mensaje.model')

function setupModels(sequelize) {
    // Usuario
    Usuario.init(UsuarioSchema, Usuario.config(sequelize));
    // Usuario
    Usuario.associate(sequelize.models);
    Conversacion.init(ConversacionSchema, Conversacion.config(sequelize))
    Mensaje.init(MensajeSchema, Mensaje.config(sequelize))
    Conversacion.associate(sequelize.models)
    Mensaje.associate(sequelize.models)
}

module.exports = setupModels;