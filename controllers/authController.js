const jwt = require ('../services/jwt');
const moment = require ('moment');
const User = require('../models/users');

const willExpireToken = token  => {
    const { exp } = jwt.decodedToken( token );
    const currentDate = moment().unix();
    if ( currentDate >= exp ) {
        return true ;
    } else {
        return false;
    }
}

const refreshAccessToken = ( req, res ) => {
    const { refreshToken } = req.body
    const isTokenExpired = willExpireToken ( refreshToken );
    if ( isTokenExpired ){ //verifia si el token expriro
        res.status(404).send({ code: 404, message: "El refreshToken ha caducado." });
    }else{
        //Busca al usuario en la DB
        const { id } = jwt.decodedToken( refreshToken );
        User.findOne( { _id: id }, ( err, userStored ) => {
            if ( err ) { // Verificar si hubo un error en el servidor
                res.status(500).send({ code: 500, message: "Error del servidor." });
            } else if ( !userStored ){ // Verificar si se encuentra el ususario
                res.status(404).send({ code: 404, message: "Usuario no encontrado." });
            }else {
                res.status(200).send({ 
                    code: 200,
                    message: "accessToken y refreshToken actualizados.",
                    accessToken : jwt.createAccessToken ( userStored ),
                    refreshToken: refreshToken
                });
            }
        } );
    }
}

module.exports = {
    refreshAccessToken
}