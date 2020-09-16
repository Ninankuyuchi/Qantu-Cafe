require('./config/config')

const express = require('express');

//declarar la constante mongoose   
const mongoose = require('mongoose');


const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//importar y usar las rutas del usuario>>
app.use(require('./routes/usuario'));



//Establecer la conexion con la base de datos
/*
Protocolo> mongodb
localhost:27017
basedatos:cafe
*/

//{} manda las configuraciones createIndix indicado al correr el servidor 
////

//const MongoClient = require('mongodb').MongoClient;
//const uri = "mongodb+srv://qantu:qantuqantu123@cluster0.o7wpo.mongodb.net/cafe?retryWrites=true&w=majority";
//const client = new MongoClient(uri, { useNewUrlParser: true });

/*client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});*/

//process.env.URLDB

///
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {

        if (err) throw err;
        console.log('Base de datos ONLINE');
    });

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto ', process.env.PORT);
})