const moment = require ('moment');
const { Mongoose, mongo } = require('mongoose');
const Labor = require( '../models/labors' ); 
const { exists } = require('../models/users');

const createLabor = ( req, res ) => {
    const { user_id } = req.params;
    const laborData = req.body;
    const labor = new Labor();
    
   
    console.log( 'createLabor... ', user_id, laborData );
    if ( !laborData.name || !laborData.description || !laborData.numVacancies ) {
        res.status(404).send({ code: 404, message: 'name, description y numVacancies son obligatorios' });
    } else {

        labor.name              = laborData.name;
        labor.description       = laborData.description;
        labor.category          = laborData.category ? laborData.category : "General" ;
        labor.numVacancies      = laborData.numVacancies;
        labor.publishDate       = moment().unix();
        labor.startDate         = laborData.startDate? laborData.startDate : moment().add( 7,'days' ).unix() ;
        labor.finishDate        = laborData.finishDate? laborData.finishDate : moment().add( 37,'days' ).unix();
        labor.employer_id       = mongo.ObjectID( user_id ) ;

        labor.save( ( err, laborStored ) => {
            if ( err ) {
                res.status(500).send({ code: 500, message: 'Error del servidor.', console: err });
            } else if ( !laborStored ) {
                res.status(404).send({ code: 404, message: 'Error al crear la labor.' });
            }else{
                res.status(200).send({ code: 200, message: 'Labor creada correctamente', labor: laborStored });
            }
        } );
    }
} 

const updateLabor = ( req, res ) => {
    console.log( 'updateLabor... ' );
} 

const getLabor = ( req, res ) => {
    console.log( 'getLabor... ' );
} 

const getLabors = ( req, res ) => {
    console.log( 'getLabors... ' );
} 

const deleteLabor = ( req, res ) => {
    console.log( 'deleteLabor.. ' );
} 

//
const activateLabor = ( req, res ) => {
    console.log( 'activateLabor... ' );
}

const finishLabor = ( req, res ) => {
    console.log( 'activateLabor... ' );
}

module.exports = {
    createLabor,
    updateLabor,
    getLabor,
    getLabors,
    deleteLabor
}