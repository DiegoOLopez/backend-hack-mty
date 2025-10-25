const AccountService = require('../services/accounts.service');

const service = new AccountService();

class AccountController {
    // Obtener todos los profesores
    async findAll(req, res, next) {
        try {
            const { id_empresa } = req.user;
            const allprofesores = await service.findAll(id_empresa);
            res.json(allprofesores);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

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

    // Crear un profesor (create)
    async create(req, res, next) {
        try {
            const { id_empresa } = req.user;
            const { id_empresa: _, ...body } = req.body; // Elimina cualquier id_empresa enviado por el usuario
            const result = await service.create({ ...body, id_empresa });
            res.json(result);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    // Actualizar un profesor (update)
    async update(req, res, next) {
        try {
            const { id_profesor } = req.params;
            const { id_empresa } = req.user;
            const { id_empresa: _, ...body } = req.body; // Elimina cualquier id_empresa enviado por el usuario
            const result = await service.updateByID(id_profesor, { ...body, id_empresa });
            if (!result) {
                return res.status(404).json({ message: 'Profesor no encontrado' });
            }
            return res.json(result + ' Profesor actualizado');
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    // Eliminar un profesor (delete)
    async delete(req, res, next) {
        try {
            const { id_profesor } = req.params;
            const { id_empresa } = req.user;
            const result = await service.deleteByID(id_profesor, id_empresa);
            if (!result) {
                return res.status(404).json({ message: 'Profesor no encontrado' });
            }
            return res.json(result + ' Profesor eliminado');
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    // Obtener todos los alumnos de un profesor
    async findAllAlumnos(req, res, next) {
        try {
            const { id_profesor } = req.params;
            const { id_empresa } = req.user;
            const result = await service.findAlumnos(id_profesor, id_empresa);
            res.json(result);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    /**
     * 
     * HERE
     * 
     */

    async findAccountsByCustomer(req, res, next) {
        try {
            const { id_cliente } = req.user;
            console.log(req.user)
            const result = await service.findAccountsByCustomer(id_cliente);
            res.json(result)
        } catch (error) {
            console.error(error);
            next(error)
        }

    }
}

module.exports = new AccountController;