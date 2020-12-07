const fs = require( 'fs' );
const path = require( 'path' );
const bcrypt =  require("bcrypt");
const jwt =  require("../services/jwt");
const User = require( '../models/users' ); 

const signUp = ( req, res ) => {
    const user = new User();
    const { name, lastname, email, password, repeatpassword } = req.body;
    user.name           = name;
    user.lastname       = lastname;
    user.email          = email.toLowerCase();
    // verificar que se llenaron los campos de contraseñas
    if ( password && repeatpassword ) {
        // verificar que los campos de contraseñas son iguales
        if ( password == repeatpassword ) {
            // Encriptar contraseña.
            bcrypt.hash ( password, 10, ( err, hash ) => {
                //Verificar errores al encriptar
                if ( !err ) {
                    user.password = hash;
                    user.save( ( err, userStored ) => {
                        // Verificar que el usuario no exista
                        if ( err ) {  
                            res.status(500).send({ code: 500, message: "Error el Usuario ya esta registrado.", error: err });    
                        } else {
                            //Verificar que el ususario fue creado correctamente
                            if ( userStored ) {
                                res.status(200).send({ code: 200, userCreated: userStored, message: "Usuario Creado correctamente." });   
                            } else {
                                res.status(404).send({ code: 404, message: "error al crear usuario" });   
                            } 
                        }
                    } );
                } else {
                    res.status(500).send({ code: 500, message: "error al encriptar la contraseña" });  
                }
            } );       
        } else {
            res.status(404).send({code: 404 , message: "las contraseñas no coinciden." });
        }
    } else {
        res.status(404).send({code: 404 , message: "Las contraseñas son obligatorias." });
    }

} 

const signIn = ( req, res ) => {
    const { email, password } =  req.body;
    const emailLower =  email.toLowerCase();
    // Biscar en la base de datos por email
    User.findOne( { email: emailLower }, ( err, userStored ) => {
        // Si ocurre un error en la base de datos
        if ( err ) {
            res.status(500).send({ code: 500, message: "Error del servidor.", error: err });
        } else if ( !userStored ) { // Verifiar si se encuentra el usuario en la BD 
            res.status(404).send({ code: 404, message: "Usuario no encontrado." });
        } else {
            // Comparar la contraseña contraseña
            bcrypt.compare( password, userStored.password, ( error, check ) => {
                // Verificar si ocurre un error en el servidor
                if ( error ) {
                    res.status(500).send({ code: 500, message: "Error del servidor.", error: err });
                } else if ( !check ) {  // Verificar que coinciden las contraseñas
                    res.status(404).send({ code: 404, message: "Contraseña incorrecta" });
                } else if ( !userStored.active ) { // Verificar que el usuario se encuentra activo
                    res.status(401).send({ code: 401, message: "Este usuario no se encuentra activo." });
                } else{
                    res.status(200).send({ 
                        code: 200, 
                        message: "Ingreso exitoso.", 
                        accessToken  : jwt.createAccessToken( userStored ),
                        refreshToken : jwt.createRefreshToken( userStored )
                    });
                }
            } );
        }
    });  
}

const uploadAvatar = ( req, res ) =>{
    console.log ( "uploadAvatar..." );
}

const getAvatar = ( req, res ) =>{
    console.log ( "getAvatar..." );
}

const updateUser = ( req, res ) =>{
    console.log ( "updateUser..." ); 
}

const activateUser = ( req, res ) =>{
    console.log ( "activateUser..." );
} 

const deleteUser = ( req, res ) =>{
    console.log ( "deleteUser..." );
}

module.exports = {
    signUp,
    signIn,
    uploadAvatar,
    getAvatar,
    updateUser,
    activateUser,
    deleteUser
}