//haremos publico la carpeta de uploads para que puedan realizar consultas
//colocar esta ruta en el index

const express = require('express');

const fs = require('fs');
const path = require('path');

const { verificaTokenImg } = require('../middlewares/autenticacion');

let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    //let pathImg = `./uploads/${tipo}/${img}`;

    //deseo retornar una imagen en lugar de un json
    //archivo a devolver en carpeta assets
    //lee el contentType del archivo y eso es lo que regresa

    //path de la imagen recibida por parametro
    //me interesa verificar si el path de la imagen existe
    //si existe muestra la imagen sino
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }

    /*
    //Crear el path de la imagen a enviar al no encontrar nada
    let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');

    //sendFile solicita el path absoluto de la imagen
    res.sendFile(noImagePath);
    */
})

module.exports = app;