const boom = require('@hapi/boom');
const argon2 = require('argon2');
const { Op } = require('sequelize');


const { models } = require('./../libs/sequelize');

class UsuarioService {

  async create(usuario) {
    // Hash password con argon2 antes de guardar en la base de datos
    const hash = await argon2.hash(usuario.contrasena, { type: argon2.argon2id });

    const newUser = await models.Usuario.create({
      ...usuario,
      contrasena: hash
    });
    delete newUser.dataValues.contrasena;
    return newUser;
  }

  async find(id_empresa) {
    const usuario = await models.Usuario.findAll({
      where: {
        id_empresa
      }
    });
    const usuarioSinContrasena = usuario.map((usuario) => {
      const { contrasena, ...usuarioSinContrasena } = usuario.dataValues;
      return usuarioSinContrasena;
    });

    console.log(usuarioSinContrasena)
    return usuarioSinContrasena;
  }

  async findEmail(correo) {
    const rta = await models.Usuario.findOne({
      where: { correo }
    });
    return rta;
  }

  async findOne(id, id_empresa) {
    const user = await models.Usuario.findOne({
      where: {
        id_usuario: id,
        id_empresa
      }
    });
    if (!user) {
      throw boom.notFound('user not found');
    }
    return user;
  }

  async update(id, changes) {
    const user = await this.findOne({
      where: {
        id_usuario: id,
        id_empresa: changes.id_empresa
    }
    });
    // Hash password con argon2 antes de guardar en la base de datos
    if (changes.contrasena) {
      changes.contrasena = await argon2.hash(changes.contrasena, {
        type: argon2.argon2id
      });
    }
    const rta = await user.update(changes);
    return rta;
  }

  async delete(id, id_empresa) {
    const user = await this.findOne({
      where: {
        id_usuario: id,
        id_empresa: id_empresa
      }
    });
    const result = await user.destroy();
    return result;
  }

  async findAlumnoByUserId(userID, id_empresa) {
    const alumno = await models.Alumno.findOne({
      where: { 
        id_usuario: userID,
        id_empresa: id_empresa
      }
    });
    return alumno.id_alumno;
  }

  async findRole(id_rol) {
    const role = await models.Roles.findByPk(id_rol);
    return role;
  }

  async registerUser(usuario) {
    try {
          const newUser = await this.create(usuario);
    if (!newUser) {
      await empresa.destroy();
      throw boom.badRequest('Error al registrar el usuario');
    }

    return newUser;
    } catch (error) {
      console.error(error)
    }

  }

  // Verificar contraseña al iniciar sesión
  async verifyPassword(inputPassword, storedHash) {
    try {
      return await argon2.verify(storedHash, inputPassword);
    } catch (error) {
      throw boom.unauthorized('Error al verificar la contraseña');
    }
  }


  //Funcion para verificar el usuario con el token
  async verify(token) {
    const usuario = await models.Usuario.findOne({
      where: {
        token_verificacion: token,
        expira_token: {
          [Op.gte]: Date.now() //Verifica que la fecha de expiracion sea mayor o igual a la fecha actual
        }
      }
    });

    if (!usuario) {
      throw boom.unauthorized('Credenciales invalidas');
    }

    usuario.verificado = true; //Cambia el estado de verificado a true
    usuario.token_verificacion = null; //Elimina el token
    usuario.expira_token = null; //Elimina el token y la fecha de expiracion

    await usuario.save(); //Guarda los cambios en la base de datos

    return usuario;
  }

}

module.exports = UsuarioService;