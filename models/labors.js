const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const LaborSchema = Schema({
    employer_id     : { type: Schema.ObjectId, ref: 'User' }, 
    name            : { type: String, requiered : true},
    description     : { type: String, requiered : true},
    aviable         : { type: Boolean, default: true }, 
    image           : String,
    finished        : { type: Boolean, default: false },
    numVacancies    : { type: Number, requiered: true},
    employerScore   : { type: Number, default: 0 },
    publishDate     : { type: Date, default : Date.now() },
    startDate       : Date,
    finishDate      : Date,
    applicants      : [{ type: Schema.ObjectId, ref: 'User' }],
    employees       : [{
        elmployee   : { type: Schema.ObjectId, ref: 'User' },
        score       : Number
    }],
    categories        : [String],   
    comnets         : [ {
        user    : { body: String, date: Date },
        body    : String,  
        date    : Date
    }]
});

module.exports = mongoose.model( "Labor", LaborSchema );