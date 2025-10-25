// Importamos express
const express = require('express');


const authRouter = require('./auth.routes');
const clienteRouter = require('./cliente');
const accountRouter = require('./account.routes')
const transferRouter = require('./transfer.routes');
const openRouter = require('./openrouter.routes');
const speechToText = require('../services/elevenlabs.service');
const textToSpeech = require('../services/elevenlabs.service');


function routerAPI(app){
    const router = express.Router();
    app.use('/api', router);
    router.use('/auth', authRouter);
    router.use('/cliente', clienteRouter);
    router.use('/account', accountRouter);
    router.use('/transfer', transferRouter);
    router.use('/openrouter', openRouter);
    router.use('/sst', speechToText);
    router.use('/tts', textToSpeech);
}

module.exports = routerAPI;