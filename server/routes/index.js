/*
Archivo que permitira la importacion de todas las rutas
Aqui se van a crear todas las nuevas rutas
*/

const express = require('express');
const app = express();


app.use(require('./usuario'));
app.use(require('./login'));


module.exports = app;