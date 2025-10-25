// Importamos express
const express = require('express');


const authRouter = require('./auth.routes');
const clienteRouter = require('./cliente');
const accountRouter = require('./account.routes')


function routerAPI(app){
    const router = express.Router();
    app.use('/api', router);
    router.use('/auth', authRouter);
    router.use('/cliente', clienteRouter);
    router.use('/account', accountRouter);
}

module.exports = routerAPI;