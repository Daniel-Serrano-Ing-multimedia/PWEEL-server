const moment = require ('moment');
const { mongo } = require('mongoose');
const Labor = require( '../models/labors' ); 

// crear labor
const createLabor = ( req, res ) => {
    const { user_id } = req.params;
    const laborData = req.body;
    const labor = new Labor();
    
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
        labor.employer          = mongo.ObjectID( user_id ) ;

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
// actualizar labor
const updateLabor = async ( req, res ) => {
    const { labor_id } = req.params;
    const { id: userID } = req.user;
    const { body : newLabor } = req;
    try {
        if( !labor_id ){ 
            return res.status( 400 ).send( { code: 400, message: 'Usuario no especificado' } );
        }
        // obener labor
        const labor = await Labor.findById( labor_id );
        if( !labor ){
            return res.status( 400 ).send( { code: 400, message: 'la labor no existe' } );
        }
        // comprobar que la labor pertenece a este usuario
        if( userID != labor.employer ){
            return res.status( 400 ).send( { code: 400, message: 'Esta Labor no pertenece a este usuario' } );
        }
        //editar labor
        // actualizar labor
        const response = await Labor.findByIdAndUpdate( { _id : labor_id } , newLabor, { new : true } );
        
        res.status( 200 ).send( { code: 200, labor : response } );
    } catch (error) {
        res.status( 400 ).send( { code: 400, message: 'La labor no existe', error } );
    } 
} 

const getLabor = async ( req, res ) => {
    const { id } = req.params;
    try {
        if( !id ){ 
            return res.status( 400 ).send( { code: 400, message: 'Usuario no especificado' } );
        }
        // comporbar que exista la labor
        const labor = await Labor.findById( id );
        if ( !labor )  throw { message :'La labor no existe', code : 404} ;
        res.status( 200 ).send( { code: 200, labor } );
    } catch (error) {
        res.status( 500 ).send( { message: 'Error en el servidor', error } );
    }
} 

const getLabors = ( req, res ) => {
    console.log( 'getLabors... ' );
} 

const deleteLabor = ( req, res ) => {
    const { id } = req.params;
    Labor.findOneAndDelete( {_id: id }, ( err, laborDeleted ) => {
        if ( err ) {
            res.status(500).send({ code: 500, message: 'Error del servidor.', error: err });
        } else if ( !laborDeleted ) {
            res.status(404).send({ code: 404, message: 'Labor no encontrada.' });
        } else {
            res.status(200).send({ code: 200, message: 'Labor eliminada correctamente.', labor: laborDeleted });
        }
    } );
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