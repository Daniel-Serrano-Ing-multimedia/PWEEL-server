const fs = require( 'fs' );
const path = require( 'path' );
const bcrypt =  require("bcrypt");
const jwt =  require("../services/jwt");
const moment = require ('moment');
const User = require( '../models/users' ); 

// registrar usuario
const signUp = ( req, res ) => {
    const user = new User();
    const { name, lastname, email, password, repeatpassword } = req.body;
    user.name           = name;
    user.lastname       = lastname;
    user.email          = email.toLowerCase();
    user.signUpDate     = moment().unix();
    user.cv.aboutMe     = `Hi my name is ${ name } ${ lastname }`;
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
// autenticar usuario
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
// actualizar usuario
const updateUser = async ( req, res ) =>{
    let userData    = req.body;
    const { id }    = req.params;
    if ( userData.password ) {
        try {
            // hash al password
            const salt = await bcryptjs.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt );
               
        }catch (err){
            res.status(500).send({ message: 'error al encriptar la contraseña' });
        }
    }
    // Actulizar el ususario
    try {
        const updatedUser = await  User.findByIdAndUpdate( id, userData );
        res.status(200).send({ message: 'Usuario Actualizado correctamente', ussuario : updatedUser });
    } catch (error) {
        res.status(500).send({ message: 'error al actualizar usuario', error : error });
    }
    
}
// eliminar usuario
const deleteUser = ( req, res ) =>{
    const { id } = req.params;

    User.findOneAndDelete( {_id: id }, ( err, userDeleted ) => {
        if ( err ) {
            res.status(500).send({ code: 500, message: 'error de servidor', error: err });
        } else if ( !userDeleted ){
            res.status(404).send({ code : 400, message: 'no se ha encontrado el usuario' });
        }else{
            res.status(200).send({ code: 200, message: 'Usuario eliminado correctamente', user: userDeleted });
        }
    } );
}
// actualizar avatar
const uploadAvatar = async ( req, res ) =>{
    const { id } = req.params;
    console.log( '****** subir Avatar : ', id )
    try {
        const userData = await User.findById( proyecto, ( userData , error)=> ( {

        } ) );
        console.log( '****** subir Avatar' )
        // verificar que el ususario exista
        if ( !userData ) return res.status(404).send({ code: 400, message: 'No se ha encontrado el usuario' });
        // file extension
        let filepath = req.files.avatar.path;
        let fileSplit = filepath.split('\\');
        let fileName =  fileSplit[2];
        let textSplit = fileName.split(".");
        let fileExt = textSplit[1];
        // verificar extencion del archivo
        console.log( 'file Extension : ', fileExt )
        if ( fileExt !== 'png' && fileExt !== 'jpg' ) {
            console.log( 'extension no valida  ' )
            throw  'extension de imagen invalida (debe ser .jpg o .png)'; 
        }   
        const { id } = req.params;
        userData.avatar = fileName;
        // Actualizar avatar
        console.log( 'lo va a guarda..' )
        const updatedUser = await User.findByIdAndUpdate({ _id: id }, userData, );
        res.status(200).send({ message: 'Avatar Actualizado', avatar : updatedUser.avatar });

    } catch (error) {
        res.status(500).send({ code: 500, message: 'Error en el servidor', error });
    }
}
// obtener usuario
const getAvatar = ( req, res ) =>{
    const avatarName = req.params.avatarName;
    const filePath  = "./uploads/avatar/"+avatarName;
    fs.exists( filePath, exists => {
        if ( !exists ) {
            res.status(404).send({ message: 'El avatar que buscas no existe' });
        } else {
            res.sendFile( path.resolve( filePath ) );
        }
    } );
}

const activateUser = ( req, res ) =>{
    const { id } = req.params;
    const { active } = req.body;
    User.findByIdAndUpdate( id, { active }, ( err, userStored ) =>{
        if ( err ) {
            res.status(500).send({ code: 500, message: 'Error del servidor.' });
        } else if ( !userStored ) {
            res.status(404).send({ code: 404, message: 'Usuario no encontrado.' });
        }else{
            if ( active ) {
                res.status(200).send({ code: 200, message: 'Usuario activado.' });
            } else {
                res.status(200).send({ code: 200, message: 'Usuario desactivado.' });
            }
        }

    } )
} 

module.exports = {
    signUp,
    signIn,
    uploadAvatar,
    getAvatar,
    updateUser,
    activateUser,
    deleteUser,
    getAvatar
}