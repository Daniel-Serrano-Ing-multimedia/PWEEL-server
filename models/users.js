const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
// Other Models

const UserSchema = Schema({
    name                : String,
    lastname            : String,
    password            : String,
    role                : { type :String, default: 'user'},
    active              : { type :Boolean, default: true }, 
    avatar              : String,
    employerScore       : { type :Number, default: 0 },
    employeeScore       : { type :Number, default: 0 },
    sex                 : Boolean,
    adress              : String,
    cellphone           : String,
    birthDay            : Date,
    identificationType  : String,
    IdentificationId    : String,
    signUpDate          : Date,
    labors              : [{ type: Schema.ObjectId, ref: 'Labor'}],  
    email               :{
       type     :String,
       unique   : true
    },
    cv                  :{
        aboutMe     : String,
        description : String
    } 
});

module.exports = mongoose.model( "User", UserSchema );