const jwt = require ( 'jwt-simple' );
const moment = require ( 'moment' );

const SECRET_KEY = 'gr7HTYU182d56dSAFd54try568821'

exports.createAccessToken =  user => {
    const playload ={
        id          : user.id,
        name        : user.name,
        lastname    : user.lastname,
        email       : user.email,
        role        : user.role,
        createToken : moment().unix(),
        exp: moment().add(10, 'minutes').unix()
    }
    return jwt.encode( playload, SECRET_KEY );
}

exports.createRefreshToken = user =>{
    const playload = {
        id  : user._id,
        exp : moment().add(30,'days').unix()
    }    
    return jwt.encode( playload, SECRET_KEY );
}

exports.decodedToken = token => {
    return jwt.decode( token, SECRET_KEY, true );
}