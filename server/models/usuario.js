//encargado de trabajar el modelo de datos
const mongoose = require('mongoose');

/*
1. se declara la constante uniqueValidator
2. definir el campo que sera unico
3. definir el plugin a utilizar
*/
const uniqueValidator = require('mongoose-unique-validator');

//Se creara la variable de roles validos
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'], //valores permitidos
    message: '{VALUE} no es un rol valido'
};


//obtener el cascaron para crear esquemas de mongoose
let Schema = mongoose.Schema;

/*definimos el esquema
Definir reglas y controles **Campos
*/
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    }, // la imagen no es obligatoria
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    }, // el rol tendra la propiedad default User Rol
    estado: {
        type: Boolean,
        default: true
    }, //Este sera boolean
    google: {
        type: Boolean,
        default: false // si el usuario no se crea con la propiedad de google sera usuario normal por ende falso
    }, // tambien un booleano 
});

//el metodo toJSON en un esquema siempre se llama cuando se intenta imprimir, impresion mediante JSON
//usamos function    
usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject(); //Tomamos el objeto de ese usuario, propiedades y metodos
    delete userObject.password;

    return userObject;
}

// definicion del plugin a usar, 3. de validator
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);