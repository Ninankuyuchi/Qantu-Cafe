const express = require('express');

//todas las peticiones requieren que el usuario este autenticado, token
let { verificaToken, verificaAdmin_ROLE } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//se va a obtener todas las categorias
// ===============================
//Mostrar todas las categorias
// ===============================
app.get('/categoria', (req, res) => {

    //condicion vacia
    //se ejecuta

    //populate permite cargar informacion referente a los objecID
    Categoria.find({})
        .sort('descripcion') // ordena
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        });
});

// ===============================
//Mostrar una categoria por ID
// ===============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.findById(...)

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'El ID no es valido'
                }
            })
        }

        res.json({

            ok: true,
            categoria: categoriaDB
        });


    })
});

// ===============================
// Crear nueva categoria
// ===============================

app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nueva categoria
    // al crear nueva categoria, yo tengo el ID del usuario en el token, como yo voy
    // a usar la funcion verifica token, entonces tengo el ID del usuario que lo creo
    // el ID se encuentra en req.usuario._id

    //obtener el body o lo que quiero postear
    let body = req.body;

    //creamos instancia de categoria
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ===============================
// Mostrar todas las categorias
// ===============================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    //llamar funcion que lo busca por el ID y lo actualiza
    //manda el id y lo que se quiere actualizar

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

// ===============================
// Borrar categorias
// ===============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_ROLE], (req, res) => {
    // 1. que solo la pueda borrar un administrador // eliminar fisicamente
    // 2. tiene que pedir el token
    // instruccion en borrar Categoria.findByIdAndRemove

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'El ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            mensaje: 'Categoria borrada'
        });


    })
});

module.exports = app;