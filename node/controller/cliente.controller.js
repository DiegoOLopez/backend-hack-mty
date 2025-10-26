const ClienteService = require('../services/cliente.service');

const service = new ClienteService();

class ClienteController {


    // Obtener el cliente por ID
    // ID de cliente prueba
    async findById(req, res, next) {
        try {
            //const { id_empresa } = req.user;
            const { id_cliente } = req.params;
            const result = await service.findById(id_cliente);
            if (!result) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }
            return res.json(result);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { id_cliente } = req.user;
            const body = req.body
            // Generar numero aleatorio de 16 digitos
            const result = await service.create(body, id_cliente)
            if (!result){
                return res.status(404).json({ message: 'Error al crear cliente'});
            }
            return res.json(result)
        } catch (error) {
            console.error(error)
            next(error)
        }
    }
}

module.exports = new ClienteController;