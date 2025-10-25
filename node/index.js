const express = require('express');
const morgan = require('morgan');
const passport = require('./utils/auth');
const port = process.env.PORT || 3000   ;

const routes = require('./routes');

const app = express();


// Instalado?
const cors = require('cors');

// CONFIGURAR CORS
const whileList = ['http://localhost:3000', 'https://myapp.co', 'http://localhost:4200', `https://${process.env.REMOTE_HOST}`,'exp://192.168.43.72:8081', 'http://192.168.43.72:8081', 'http://localhost:8081', 'http://192.168.43.185:8081'];


//PRUEBA TEMPORAL
app.use(cors({ origin: '*', credentials: true }));

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
app.listen(port, HOST, () => {
  console.log(`Servidor corriendo en http://${HOST}:${port}`);
});
