const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const LaborSchema = Schema({
    employer_id     : String, 
    name            : String,
    description     : String,
    aviable         : Boolean, 
    image           : String,
    finished        : Boolean,
    numVacancies    : Number,
    employerScore   : Number,
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