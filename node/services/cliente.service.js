const { models } = require('../libs/sequelize');
const axios = require('axios');

class ClienteService {

    async findById(id) {
    try {
        const response = await axios.get(`http://api.nessieisreal.com/customers/${id}`, {
        params: { key: 'b9c71161ea6125345750dcb92f0df27c' }
        });

        // El cliente viene directamente en response.data
        return response.data;
    } catch (error) {
        console.error('Error buscando cliente:', error.message);
        return null;
    }
    }

    async create(body, id_cliente) {
  try {
    const url = `http://api.nessieisreal.com/customers/${id_cliente}/accounts?key=b9c71161ea6125345750dcb92f0df27c`;
    // Llamamos a las cuentas existentes
    const { data: cuentas } = await axios.get(
        `http://api.nessieisreal.com/accounts?key=b9c71161ea6125345750dcb92f0df27c`
    );

    let numeroCuenta;
    let valido = false;

    while (!valido) {
        // Generamos número aleatorio de 16 dígitos
        numeroCuenta = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();

        // Verificamos si ya existe
        const existe = cuentas.some((c) => c.account_number === numeroCuenta);
        if (!existe) valido = true;
    }

    body = {
        ...body,
        account_number: numeroCuenta
    }
    const response = await axios.post(url, body);

    return response.data; // 👈 Devuelve directamente los datos útiles
  } catch (error) {
    console.error('Error creando la cuenta:', error.response?.data || error.message);
    return null;
  }
}

}

module.exports = ClienteService;