const { Strategy } = require('passport-local');
const boom = require('@hapi/boom');
const argon2 = require('argon2');
const rateLimit = require('express-rate-limit');

const UsuarioService = require('./../../../services/usuario.service');

const service = new UsuarioService();

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 5,                   // Limita a 5 intentos por IP
  message: 'Demasiados intentos, por favor espera unos minutos',
});

const localStrategy = new Strategy(
  {
    usernameField: 'correo',
    passwordField: 'contrasena',
  },
  async (correo, contrasena, done) => {
    try {
      const usuario = await service.findEmail(correo);

      // Mensaje genérico para usuario no encontrado
      if (!usuario) {
        return done(null, false, { message: 'Credenciales inválidas' });
      }

      // Comparar contraseña (si existe usuario)
      const isMatch = await argon2.verify(usuario.contrasena, contrasena);
      
      // Mensaje genérico para contraseña incorrecta
      if (!isMatch) {
        return done(null, false, { message: 'Credenciales inválidas' });
      }

      // Eliminar contraseña antes de devolver usuario
      delete usuario.dataValues.contrasena;

      return done(null, usuario);
    } catch (error) {
      return done(boom.badImplementation(error));
    }
  }
);

module.exports = {localStrategy, loginLimiter};
