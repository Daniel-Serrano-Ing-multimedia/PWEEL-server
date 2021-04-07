const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
// Other Models

const UserSchema = Schema({
    name                : { type : String, required : true },
    lastname            : String,
    password            : { type : String, required : true },
    email               :{ type :String, unique : true, required : true },
    role                : { type :String, default: 'user' },
    active              : { type :Boolean, default: true }, 
    avatar              : { type : String, default : null },
    employerScore       : { type :Number, default: 0 },
    employeeScore       : { type :Number, default: 0 },
    sex                 : String,
    adress              : String,
    cellphone           : String,
    birthDay            : Date,
    identificationType  : { type : String, },
    IdentificationId    : String,
    signUpDate          : Date,
    creado              : { type : Date, default: Date.now() },
    cv                  :{
        aboutMe     : String,
        description : String
    },
    laborsDone: [{
        labor       : { type: Schema.ObjectId, ref: 'Labor'},  
    }]  
});

module.exports = mongoose.model( "User", UserSchema );