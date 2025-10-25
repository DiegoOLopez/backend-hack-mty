const express = require('express');
const morgan = require('morgan');
const passport = require('./utils/auth');
const port = process.env.port || 3000   ;

const routes = require('./routes');

const app = express();


// Instalado?
const cors = require('cors');

// CONFIGURAR CORS
const whileList = ['http://localhost:3000', 'https://myapp.co', 'http://localhost:4200', `https://${process.env.REMOTE_HOST}`];

// Configurar OPS DE CORS
const options = {
  origin: (origin, callback) => {
    if (whileList.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'));
    }
  },
}

app.use(cors(options));

app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));


app.use(passport.initialize());


routes(app);

app.use((err, req, res, next) => {
    return res.json({ 
        error: err.message 
    });
});
const HOST = "0.0.0.0";
app.listen(port, () => {
  console.log(`Servidor corriendo en ${port}`);
});