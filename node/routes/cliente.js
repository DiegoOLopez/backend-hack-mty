const express = require('express');

const router = express.Router();

const ClienteController = require('../controller/cliente.controller');

const {validacionJWT, verificarRol }= require('./validacionJWT');


// Obtener datos de un cliente por id
//router.get('/:id_cliente', validacionJWT, verificarRol(['superadmin', 'admin', 'moderador']), (req, res, next) => ClienteController.findById(req, res, next));
router.get('/:id_cliente', validacionJWT, (req, res, next) => ClienteController.findById(req, res, next));
// Crear un nuevo cliente
router.post('/', validacionJWT, (req, res, next) => ClienteController.create(req, res, next));



module.exports = router;