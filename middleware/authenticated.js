const jwt = require ( 'jwt-simple' );
const moment = require( 'moment' );
const SECRET_KEY = "gr7HTYU12847SAFd54try568821";

exports.ensureAuth = ( req, res, next ) => {
    if( !req.headers.authorization ){
        return res.status(403),send( { messange: "La petición no tiene cabecera de autentificación" } );
    }
    const token = req.headers.authorization.replace(/['"]+/g, "");

    try{
        var playload = jwt.decode( token, SECRET_KEY );
        if ( playload.exp <= moment.unix() ){
            return res.status(404).send({ messange: "El token ha expirado" });
        }
    }catch( ex ){
        return res.status(404).send({ message: 'Token invalido.' })
    }
    req.user=playload;
    next();
}