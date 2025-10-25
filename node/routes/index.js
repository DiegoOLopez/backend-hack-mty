// Importamos express
const express = require('express');


const authRouter = require('./auth.routes');
const clienteRouter = require('./cliente');


function routerAPI(app){
    const router = express.Router();
    app.use('/api', router);
    router.use('/auth', authRouter);
    router.use('/cliente', clienteRouter)
}

module.exports = routerAPI;