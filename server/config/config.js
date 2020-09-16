//variable de proceso
process.env.PORT = process.env.PORT || 3000;

//////////////////////
//Entorno, si la variable no existe estoy en desarrollo
//////////////////////
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


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

/*
mongodb://mongodb+srv://qantu:<password>@cluster0.o7wpo.mongodb.net/<dbname>?retryWrites=true&w=majority
mongodb://<dbuser>:<dbpassword>@cluster0.o7wpo.mongodb.net/cafe
*/