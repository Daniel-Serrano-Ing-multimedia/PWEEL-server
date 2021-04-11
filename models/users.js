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
    avatar              : {
        url      : { type: String, default : null },
        publicId : { type: String, default : null }
    },
    employerScore       : { 
        value : { type :Number, default: 0 }, 
        numVotes: { type :Number, default: 0 }
    },
    employeeScore       : { 
        value : { type :Number, default: 0 }, 
        numVotes: { type :Number, default: 0 }
    },
    sex                 : { type : String, default : null },
    adress              : { type : String, default : null },
    cellphone           : { type : String, default : null },
    birthDay            : { type : Date, default : null },
    identificationType  : { type : String, },
    IdentificationId    : { type : String, default : null },
    signUpDate          : { type : Date, default: Date.now() },
    cv                  :{
        aboutMe     : { type : String, default : null },
        description : { type : String, default : null }
    },
    laborsDone: [{
        labor       : { type: Schema.ObjectId, ref: 'Labor'},  
    }]  
});

module.exports = mongoose.model( "User", UserSchema );