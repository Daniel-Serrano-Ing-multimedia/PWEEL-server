const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
// Other Models

const UserSchema = Schema({
    name        : String,
    lastname    : String,
    password    : String,
    role        : { type :String, default: 'user'},
    active      : { type :Boolean, default: true }, 
    avatar      : String,
    vacancies   : [{ type: Schema.ObjectId, ref: 'Vacant'}],  
    email    :{
       type     :String,
       unique   : true
    } 
});

module.exports = mongoose.model( "User", UserSchema );