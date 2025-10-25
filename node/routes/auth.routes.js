const express = require('express');
const passport = require('passport');
const UsuarioController = require('../controller/usuario.controller');
const {localStrategy, loginLimiter} = require('../utils/auth/strategies/local.strategy');
const {validacionJWT, verificarRol }= require('./validacionJWT');

const router = express.Router();

router.post('/login', loginLimiter, (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      console.log("Credenciales invalidas ->" + req.body.correo);
      console.log("Credenciales invalidas ->" + req.body.contrasena);
      return res.status(401).json({ message: info?.message || 'Credenciales inválidas' });
    }

    req.user = user;
    UsuarioController.login(req, res, next);
  })(req, res, next);
});

//Ruta para registrar usuario
router.post('/register', (req, res, next) => UsuarioController.registerUser(req, res, next));

//Ruta para verificar usuario
router.get('/verify/:token', (req, res, next) => UsuarioController.verifyUsuario(req, res, next));


router.post('/',(req, res, next) => UsuarioController.create(req, res, next));
router.get('/', validacionJWT, verificarRol(['superadmin', 'admin']), (req, res, next) => UsuarioController.find(req, res, next));
router.get('/:id', validacionJWT, verificarRol(['superadmin', 'admin']), (req, res, next) => UsuarioController.findOne(req, res, next));
router.put('/:id', validacionJWT, verificarRol(['superadmin', 'admin']), (req, res, next) => UsuarioController.update(req, res, next));
router.delete('/:id', validacionJWT, verificarRol(['superadmin', 'admin']), (req, res, next) => UsuarioController.delete(req, res, next));
router.get('/alumno/:userID', validacionJWT, verificarRol(['superadmin', 'admin']),(req, res, next) => UsuarioController.findAlumnoByUserId(req, res, next));

module.exports = router;