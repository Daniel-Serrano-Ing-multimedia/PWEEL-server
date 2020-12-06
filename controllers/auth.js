const jwt = require ('../services/jwt');
const moment = require ('moment');
const user = require('../models/user');

const willExpireToken = token  => {
    const { exp } = jwt.decodedToken( token );
    const currentDate = moment().unix();
    
    if ( currentDate > exp ) {
        return true ;
    } else {
        return false;
    }
}

const refreshAccessToken = ( req, res ) => {
    const { refreshToken } = req.body

}