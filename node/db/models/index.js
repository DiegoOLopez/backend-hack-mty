// Usuario
const { UsuarioSchema, Usuario  } = require('./usuario.model')

function setupModels(sequelize) {
    // Usuario
    Usuario.init(UsuarioSchema, Usuario.config(sequelize));
    // Usuario
    Usuario.associate(sequelize.models);
}

module.exports = setupModels;