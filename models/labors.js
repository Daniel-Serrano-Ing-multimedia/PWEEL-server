const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const LaborSchema = Schema({
    employer    : { type: Schema.ObjectId, ref: 'User' }, 
    name            : { type: String, requiered : true},
    description     : { type: String, requiered : true},
    aviable         : { type: Boolean, default: true }, 
    finished        : { type: Boolean, default: false },
    succes          : { type: Boolean, default: false },
    numVacancies    : { type: Number, requiered: true},
    employerScore   : { type: Number, default: 0 },
    image           : { type: String, default : null },
    publishDate     : { type: Date, default : Date.now() },
    startDate       : { type: Date, required : true },
    finishDate      : { type: Date, default :null },
    aplicants      : [{ type: Schema.ObjectId, ref: 'User' }],
    employees       : [{ type: Schema.ObjectId, ref: 'User' }],
    categories        : [String],   
    coments         : [ {
        user    : { type: Schema.ObjectId, ref: 'User' },
        body    : String,  
        date    : { type: Date, default :  Date.now() }
    }]
});

module.exports = mongoose.model( "Labor", LaborSchema );