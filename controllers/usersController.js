const fs = require( 'fs' );
const path = require( 'path' );
const bcrypt =  require("bcrypt");
const jwt =  require("../services/jwt");
const moment = require ('moment');
const User = require( '../models/users' ); 
// storage
const cloudinary = require('cloudinary').v2;
const { cloudinaryConfig } = require('../config');

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

// activar / desactivcar usuario
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

// actualizar avatar
const uploadAvatar = async ( req, res ) =>{
		let { file : avatar, originalname, user } = req;
		// funcion para subir el avatar con promesas
		const uloadBufferToCloudinary = ( imageBuffer ) =>{
			//cloudinary.config( cloudinaryConfig );
			return new Promise( 
				( resolve, reject ) => {
					cloudinary.uploader.upload_stream({ resource_type: "image", tags: 'avatar', folder : '/pweel/avatar' }, ( error, result ) => {
						if (error) return reject( error );
	  			return  resolve (result);
					}).end( imageBuffer );	
				}		
			)	
		}	
	try {

			//*********************************************************
			//*****************  Sibir a Cloudinary *******************
			//*********************************************************
			// configurar cloudinary
			cloudinary.config( cloudinaryConfig );
			// File upload to Cloudinary
			avatar = await uloadBufferToCloudinary( avatar.buffer );
			const newAvatar = { 
				url 			: avatar.url,
				publicId 	: avatar.public_id
			 }
			//*********************************************************
			//*****************  actualizar usuario *******************
			//*********************************************************
			const updateUser = await User.findByIdAndUpdate( user.id, { avatar : newAvatar } );
			if( !updateUser ) throw 'No existe el usuario';
			res.status( 200 ).send({ code: 200, message: 'Avatar actualizado', avatar  : updateUser.avatar });

	} catch (error) {
		res.status(500).send({ code: 500, message: 'Error en el servidor', error });
	}
}

// obtener avatar de usuario
const getAvatar = ( req, res ) =>{
  // Previsto para ser hecho desde el front
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