//variable de proceso
process.env.PORT = process.env.PORT || 3000;

//////////////////////
//Entorno, si la variable no existe estoy en desarrollo
//////////////////////
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/*/////////////////////////////////////////
//         VENCIMIENTO DEL TOKEN
//Creamos 2 variables
//Fecha de expiracion y la sit
- 60 seg
- 60 min
-60 horas
-30 dias
*/ ////////////////////////////////////////
process.env.CADUCIDAD_TOKEN = '48h';

/*
SEED de autenticacion
*/
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//////////////////////
//Base de datos
//////////////////////
let urlDB

///Mongoose Atlas
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://qantu:qantuqantu123@cluster0.o7wpo.mongodb.net/cafe?retryWrites=true&w=majority";
////

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    //urlDB = uri;
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

//////////////////////
//Google CLIENT ID
//////////////////////
process.env.CLIENT_ID = process.env.CLIENT_ID || '845431137480-uf2sgct4nqq9u8t5cqp8l5esvvnef25e.apps.googleusercontent.com';