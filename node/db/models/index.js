// Usuario
const { UsuarioSchema, Usuario  } = require('./usuario.model')
const { ConversacionSchema, Conversacion } = require('./conversacion.model')
const { MensajeSchema, Mensaje } = require('./mensaje.model')
const { ContactoSchema, Contacto } = require('./contactos.model')

function setupModels(sequelize) {
    // Usuario
    Usuario.init(UsuarioSchema, Usuario.config(sequelize));
    // Usuario
    Usuario.associate(sequelize.models);
    Conversacion.init(ConversacionSchema, Conversacion.config(sequelize))
    Contacto.init(ContactoSchema, Contacto.config(sequelize))
    Mensaje.init(MensajeSchema, Mensaje.config(sequelize))
    Contacto.associate(sequelize.models)
    Conversacion.associate(sequelize.models)
    Mensaje.associate(sequelize.models)
}

module.exports = setupModels;