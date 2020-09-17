/*
Encriptaremos la contraseña y validación de estas
*/

const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // obtencion de token

const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

const app = express();

module.exports = app;

//Peticion Post para trabajar con autenticacion

app.post('/login', (req, res) => {

    //obtener el boddy, email and password
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: true,
                error: {
                    mensaje: '(Usuario) o contraseña incorrecto'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'Usuario o (Contraseña) incorrectos'
                }
            });
        }
        /*
        .sign manda el payload, la informacion que abra en el token
        secretet- usado posteriormente para ver si coinciden con el secret del servidor
        fecha de expiracion del token
        60 segundos * 60 minutos * 24 horas * 30dias
        */
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    })
})