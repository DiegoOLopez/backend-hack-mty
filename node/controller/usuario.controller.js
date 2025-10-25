const UsuarioService = require('../services/usuario.service');
const jwt = require('jsonwebtoken');
const verificacionEmail = require('../services/email.service');
const { v4: uuidv4 } = require('uuid');
const { config } = require('../config/config.js');

//Servicio para verificar la fortaleza de la contraseña
const zxcvbn = require('zxcvbn');

const service = new UsuarioService();

class UsuarioController {
  async create(req, res, next) {
    try {
      const body = req.body;
      const result = await service.create(body);
      res.status(201).json(result);
    } catch (error) {
            console.log(req.body, "\n\nºn\n\n\n\n")
      next(error);
    }
  }

  async find(req, res, next) {
    try {
      const { id_empresa } = req.user;
      const usuarios = await service.find(id_empresa);
      res.json(usuarios);
    } catch (error) {
      next(error);
    }
  }

  async findEmail(req, res, next) {
    try {
      const { correo } = req.params;
      const usuario = await service.findEmail(correo);
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req, res, next) {
    try {
      const { id } = req.params;
      const { id_empresa } = req.user;
      const result = await service.findOne(id, id_empresa);
      if (!result) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { id_empresa } = req.user;
      const { id_empresa: _, ...body } = req.body;
      const result = await service.update(id, { ...body, id_empresa });
      if (!result) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      return res.json(result + ' Usuario actualizado');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const { id_empresa } = req.user;
      const result = await service.delete(id, id_empresa);
      if (!result) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      return res.json(result + ' Usuario eliminado');
    } catch (error) {
      console.error(error);
      next(error);
    }
  }


  async verifyUsuario(req, res, next) {
    try {
      const { token } = req.params;

      // Verificamos el token
      const usuario = await service.verify(token);
      if (!usuario) {
        return res.status(400).json({ message: 'Token invalido o expirado' });
      }

      //
      res.status(200).json({ message: 'Cuenta verificada exitosamente' });

    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      console.log("Usuario ->" + req.user);
      if (!req.user) {
        return res.status(401).json({ message: 'Credenciales invalidas' });
      }
      const usuario = req.user;
      console.log(req.user, "\n\n\n\n\n")
      // Buscamos el rol
      const payload = {
        sub: usuario.id_usuario,
        id_cliente: usuario.id_cliente
      };
      console.log(payload, "\n\n\n\n")
      const token = jwt.sign(payload, config.jwtSecret);
      if (token) {
        res.status(200).json({
          usuario,
          token,
          payload
        });
      } else {

        console.log("Credenciales invalidas ->" + req.body.correo);
        console.log("Credenciales invalidas ->" + req.body.contrasena);
        res.status(401).json({ message: 'Credenciales invalidas', correo: req.body.correo});
      }
    } catch (error) {
      console.log("Error router ->" + error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  }


  //Funcion para registrar un usuario
  async registerUser(req, res, next) {
    try {
      const { correo, contrasena, nombre, rfc, telefono, id_cliente } = req.body;

      //Verificar si el correo ya existe
      const existingUser = await service.findEmail(correo);//CREAR OTRO FINEMAIL QUE NO SEA EL DE ARRIBA
      if (existingUser) {
        return res.status(409).json({ message: 'El correo ya esta registrado' });
      }

      //Generar token de verificacion
      const token = uuidv4();
      const expira_token = new Date();
      expira_token.setHours(expira_token.getHours() + 1); // Expira en 1 hora

      //Verificar fortaleza de la contraseña
      const passwordStrength = zxcvbn(contrasena);
      if (passwordStrength.score < 2) {
        return res.status(400).json({ 
          message: 'La contraseña es muy debil. Intenta con una contraseña mas segura',
        });
      }


      //Crear usuario

      const usuario = await service.registerUser({
        correo,
        contrasena,
        verificado: false,
        token_verificacion: token,
        expira_token,
        fecha_creacion: new Date(),

        nombre,
        rfc,
        telefono,
        id_cliente
      });

      //Enviar email de verificacion
      await verificacionEmail.sendVerificationEmail(correo, token);
      res.status(201).json({ message: 'Usuario registrado. Verifica tu correo electronico' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UsuarioController();