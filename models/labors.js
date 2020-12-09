const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const LaborSchema = Schema({
    employer_id     : { type: Schema.ObjectId, ref: 'User' }, 
    name            : String,
    description     : String,
    category        : String,   
    aviable         : { type: Boolean, default: true }, 
    image           : String,
    finished        : { type: Boolean, default: false },
    numVacancies    : Number,
    employerScore   : { type: Number, default: 0 },
    publishDate     : Date,
    startDate       : Date,
    finishDate      : Date,
    applicants      : [{ type: Schema.ObjectId, ref: 'User' }],
    employees       : [{
        elmployee   : { type: Schema.ObjectId, ref: 'User' },
        score       : Number
    }],
    comnets         : [ {
        user    : { body: String, date: Date },
        body    : String,  
        date    : Date
    }]
});

module.exports = mongoose.model( "Labor", LaborSchema );