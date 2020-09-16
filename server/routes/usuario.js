const express = require('express');

//Declaro la constante Bcrypt.justify-content-around
const bcrypt = require('bcrypt');

//declaro el uso del underscore
const _ = require('underscore');

/*
Utilizaremos el elsquema Usuario como modelo para grabar en la base de datos
- se tiene el objeto Usuario para trabajar y crear nuevos elementos del esquema
*/
const Usuario = require('../models/usuario.js');


const app = express();

app.get('/', (req, res) => {
    res.json('Hola Mundo');
});

app.get('/usuario', function(req, res) {

    /*
    find regresa todo
    1. puedo especificar la condicion,
    2. exec ejecuta el find. Todas las funciones reciben un error y la respuesta
    */

    //parametros opcionales caen en un objeto .query
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    //segundo argumenta muestra los campos que se quieren mostrar
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            /*devolver la cantidad de registros
            1. recibe la condicion similar que se tiene en la busqueda
            2. segundo argumento el callback, el error y el conteo de registros
            */
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });


        });
});

app.post('/usuario', (req, res) => {

    let body = req.body;

    /*
    se crea una nueva instancia del Usuario esquema, a lo cual definiremos 
    un objeto para pasarle todos los parametros que se deseen
    */
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    /*
    grabando en la base de datos
    1. Puede recibir un error
    2. o bien un usuario de base de datos, respuesta del usuario grabbado en mongo
    */
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;


        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });

});

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;

    // obtener el body como recibimos en peticion post
    /*
        1. recibe el objeto con todas las propiedades (req.body)
        2. arreglo con todas las propiedades validas
    */
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    /*
    podriamos llegar al body y hacer delete de cada propiedad que no se quiera mostrar
    delete body.password;
    delete body.google;
    */
    //recibe el error o busca usuarioDB para actualizar
    /*
    new: manda el nuevo objeto
    runValidators: Corre todas las validaciones
    */
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })

});

app.delete('/usuario/:id', function(req, res) {

    //saber el id del objeto a borrar
    let id = req.params.id;

    //objeto estado para indicar eliminacion de Usuario
    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

    /*
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
    */

});

module.exports = app;