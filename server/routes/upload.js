const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

//importacion del fs para realizar consultas de existencia de archivos
const fs = require('fs');

//grabar en la base de datos de usuarios en archivo.mv
const Usuario = require('../models/usuario');

//Importar el modelo de Producto
const Producto = require('../models/producto');

/*
Como yo me encuentro en una carpeta, en rutas, y si yo quiero hacer referencia
a la parte de productos y uploads. Yo tengo que hacer referencia al dirname seguido
del uploads/productos y usuarios. Por ende, tendre que construir un path para 
poder llegar al archivo desde las rutas, por ende lo importamos.

Estoy en routes/uploads.js y quiero llegar a uploads/productos o uploads/usuarios
*/
const path = require('path');

/*
El middleware cuando llama a la funcion de fileUpload, todos los archivos que se carguen, caen dentro de req.files
*/
//app.use( fileUpload({ useTempFiles: true }) );

//default optins - agregar ciertas configuraciones al fileUpload
app.use(fileUpload());

/*
    Imagen de tipo usuario o producto
    id, indentifica que usuario o producto debo actualizar
*/
app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    //si no hay ningun archivo, retorna error
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                error: {
                    mensaje: 'No se ha seleccionado ningun archivos'
                }
            });
    }

    //validar tipo de informacion a recibir "Valida Tipo"
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            error: {
                mensaje: 'Los tipos permitidos son ' + tiposValidos.join(', ')
            }
        });
    }

    /*
    si viene un archivo o lo que sea que se suba, va a caer dentro de req.files.archivo
    archivo es el nombre que se pondra en las peticiones POSTMAN
    lo que sea que se postee lo va a agarrar con .archivo
    
    Hay que usar el sampleFile, propiedad que fileUpload crea para mover ese archivo ".mv"accordion
    al directorio con el nombre que nosotros queremos /filename.jpg 

    */
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    //console.log(extension);

    //restringir el tipo de extension
    //Extensiones Permitidas

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpg'];

    //obtender la extension del archivo para poder verificarlo que existe
    //dentro de este arreglo- SI existe procedo y si no no sigo
    // el archivo es "archivo"

    //indexOf busca en el arreglo la extension
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                mensaje: ' Las extensiones permitidas son ' + extensionesValidas.join(', '),
                extension
            }
        });
    }
    //cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;


    //path que especifica a donde lo subiremos 
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Aquí ya se que la imagen se cargó. Pero como lo actualizo ya que solo
        //los usuarios que tienen imagen vienen de google,


        /*
        res.json({
            ok: true,
            mensaje: 'Imagen subida correctamente'
        });
        */
        //Se reemplaza por la funcion de imagenUsuario.
        // La imagen en ese punto, cuando se llama la funcion ya se carga, por ende
        //si sucede un error (funcion imagenUsuario) la imagen sigue ahi
        //necesitare borrar para evitar tener mucha imagen no necesaria
        //imagenUsuario(id, res, nombreArchivo);

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }

    });



});

//el res no existe ya que es una funcion, por ende debe de enviarse como parametro
//del res donde se esta aplicando la consulta. Por ende se envia por referencia
//la respuesta. nombre archivo entra como argumento para actualizar imagen
function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {

            //borrar imagen subida por error, lo cual en este caso es el nombre
            //del archivo que se acaba de subir
            borrarArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            //se borrar el archivo subido para evitar que se llene el servidor
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'El usuario no existe en la Base de datos'
                }
            });
        }

        //Yo necesito antes de borrar la imagen, confirmar que la imagen exista
        //confirmar que el path de la imagen exista, porque no quiere correr
        //en una exepcion que intento borrar un archivo que no existe
        //Evaluaremos con una condicion Si:
        //1. Existe en el FIle System ??
        //2. Importamos el file system const fs = require ('fs')

        //Verificar primero la ruta del Archivo
        //Muestra path especifico:
        //llegar de rutas a uploads: ".." llego a server " ".." para llegar a uploads

        /*
        let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);
        if (fs.existsSync(pathImagen)) { //funciona sin callback
            fs.unlinkSync(pathImagen);
        }*/

        borrarArchivo(usuarioDB.img, 'usuarios');




        //Ya se que el usuario existe, entonces actualicemos la imagen
        //actualizaremos en el nombre del archivo por ende entrara como argumento

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });

    });
}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borrarArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'El ID del producto no existe'
                }
            });
        }

        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });




}

//recibe nombre de imagen que se desea borrar.
//recibe argumento de carpeta a borar, usuario o producto == tipo 
function borrarArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}


module.exports = app;