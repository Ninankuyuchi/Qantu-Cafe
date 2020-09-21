/*
Encriptaremos la contraseña y validación de estas
*/

const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // obtencion de token

//configuraciones libreria de autenticaciones google
/*
OAuth2Client> importacion
CLIENT_ID> Puede cambiar
*/
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

const app = express();

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

    });
});

//configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}

//se pone async para poder usar las propiedades de una promesa (await)
app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    // verificar si yo no tengo un usuario con ese correo
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        /*
            1. esa persona ya se autentico mediante las credenciales de usuario password con nuestra aplicacion de registro de usuario
            entonces esa persona no deberia poder autenticarse mediante google pero si nunca se autenticado en la base de datos debe
            riamos crear el usuario
        */

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        mensaje: 'Debe de usar su autenticacion normal' //usuario autenticado con credenciales normales
                    }
                });
            } else { //usuario previamente autenticado, le renovaremos su token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else { // si el usuario no existe
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            })

        }

    });

    /*res.json({
        usuario: googleUser
    });*/
})

module.exports = app;