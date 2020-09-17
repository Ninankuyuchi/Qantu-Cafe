// libreria que trae codigo para poder recuperar toda la informacion directamente
const jwt = require('jsonwebtoken');

/*
crearemos una funcion que ejecute algo en particular
1. Verificacion del token
*/
//next continua con la ejecucion del programa
/*VERIFICAR TOKEN
1. lee headers
*/
let verificaToken = (req, res, next) => {

    //req.get() lee el header, token es el nombre del header
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                error: {
                    mensaje: 'token no valido'
                }
            });
        }

        req.usuario = decoded.usuario
        next();
    });

    /*
    res.json({
        token: token
    })
    */
    //console.log(token);
    //next();
};

///////////////////////
//VERIFICA ADMIN_ROLE
///////////////////////

let verificaAdmin_ROLE = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        res.json({
            ok: false,
            err: {
                mensaje: 'El usuario no es administrador'
            }
        });

    }


}

module.exports = {

    verificaToken,
    verificaAdmin_ROLE

}