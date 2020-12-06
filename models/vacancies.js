const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const VacantSchema = Schema({
    employer_id : String, 
    name        : String,
    description : String,
    active      : Boolean, 
    image       : String,
    finished    : Boolean,
    applicants  : [{ type: Schema.ObjectId, ref: 'User' }],
    comnets     : [{ body: String, date: Date }]
});

module.exports = mongoose.model( "Vacant", VacantSchema );