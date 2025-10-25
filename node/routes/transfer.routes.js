



const express = require('express');

const router = express.Router();

const TransferController = require('../controller/transfer.controller');

const {validacionJWT, verificarRol }= require('./validacionJWT');


// Obtener datos de todos los clientes
//router.get('/', validacionJWT, verificarRol(['superadmin', 'admin', 'moderador']), (req, res, next) => ClienteController.findAll(req, res, next));
// Obtener datos de un cliente por id
// Crear un nuevo cliente
//router.post('/', validacionJWT, verificarRol(['superadmin', 'admin', 'moderador']), (req, res, next) => TransferController.create(req, res, next));
// Actualizar un cliente por id
router.patch('/:id_cliente', validacionJWT, verificarRol(['superadmin', 'admin', 'moderador']) ,  (req, res, next) => TransferController.update(req, res, next));
// Eliminar un cliente por id
router.delete('/:id_cliente', validacionJWT , verificarRol(['superadmin', 'admin']) , (req, res, next) => TransferController.delete(req, res, next));

/**
 * 
 *  Here
 * 
 */
// Llamamos a las cuentas por el id de cliente
router.post('/', validacionJWT, (req, res, next) => TransferController.createTransfer(req, res, next));

module.exports = router;