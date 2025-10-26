const { models } = require('../libs/sequelize');
const axios = require('axios');

class AccountService {
    // Funcion para buscar todos los estudiantes (findAll)
    async findAll(id_empresa){
        const alumnos = await models.Alumno.findAll({
            where: {
                id_empresa: id_empresa
            }
        });
        return alumnos;
    }

    // Funcion para buscar un estudiante por su id (findVyPk)


    async findById(id) {
    try {
        //const response = await axios.get(`http://api.nessieisreal.com/customers/${id}`, {
        //params: { key: 'b9c71161ea6125345750dcb92f0df27c' }
        //});
        const response = (await axios.get(`http:/mockdb-production.up.railway.app/customers/${id}`)).data;
        
        // El cliente viene directamente en response.data
        return response.data;
    } catch (error) {
        console.error('Error buscando cliente:', error.message);
        return null;
    }
    }

    // Funcion para crear un estudiante (create)
    async create(alumno){
        const dataAlumno = {
            ...alumno,
            telefono2: alumno.telefono2 || alumno.telefono1
        }
        const alumnocreated = await models.Alumno.create(dataAlumno);
        return alumnocreated;
    }

    // Funcion para actualizar un estudiante (update)
    async updateById(id, alumno){
        const alumnoUpdated = await models.Alumno.findOne({
            where: {
                id_alumno: id,
                id_empresa: alumno.id_empresa
            }
        });
        if(!alumnoUpdated){
            return null;
        }
        const result = await alumnoUpdated.update(alumno);
        return result
    }

    // Funcion para eliminar un estudiante (destroy)
    async deleteById(id, id_empresa){
        const alumno = await models.Alumno.findOne({
            where: {
                id_alumno: id,
                id_empresa: id_empresa
            }
        });
        const result = await alumno.destroy();
        return result;
    }

    // Funcion para buscar un tutor por id alumno
    async findTutor(id_alumno, id_empresa){
        const alumno = await models.Alumno.findOne({
            where: {
                id_alumno: id_alumno,
                id_empresa: id_empresa
            }
        });
        const tutor = await models.Tutor.findOne({
            where: {
                id_tutor: alumno.id_tutor,
                id_empresa: id_empresa
            }
        });
        return { alumno, tutor };
    }


    /****
     * 
     * 
     * EMPIEZA
     * 
     * 
     * 
     */

    // Find by id customer
      async findAccountsByCustomer(id_cliente) {
    try {
      //const response = await axios.get(
      //  `http://api.nessieisreal.com/customers/${id_cliente}/accounts`,
      //  { params: { key: 'b9c71161ea6125345750dcb92f0df27c' } }
      //);
      const response = (await axios.get(`http:/mockdb-production.up.railway.app/customers/${req.user.id_cliente}/accounts`)).data;
      console.log("Cuentas propias", cuentas_propias)

      // Las cuentas vienen en response.data
      return response.data;
    } catch (error) {
      console.error('Error obteniendo cuentas del cliente:', error.message);
      return null;
    }
  }
}

module.exports = AccountService;