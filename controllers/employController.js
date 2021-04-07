// models
const Labor = require( '../models/labors' ); 
const User = require('../models/users');
//
const moment = require ('moment');

// obtener labores recomendadas
// **  Para simular recomendaciones se enviaran las 10 labors de lo employers mejor punteados **
exports.getRecomendedLabors = async ( req, res ) =>{
  console.log( 'getRecomendedLabors...' );
} 

// Aplicar a una labor
exports.aplyLabor = async ( req, res ) =>{
  const  { labor, user } = req
  try {
    // verificar que la labor existe - desde middelawre 
    //- done -
    // verificar que la labor no pertenece al usuario
    
    console .log( 'usuario : ', user.id )
    console .log( 'labor : ', labor.employer )
    console .log( ' ?????? : ',  user.id == labor.employer )
    if( user.id == labor.employer ){
      console.log( 'iguales' )
      throw 'No puedes aplicar a tu propia oferta';
    }
    // verificar que la labor esta disponible
    if ( !labor.aviable ) {
      console.log( 'no hay vacantess' )
      throw 'Esta oferta no esta disponoble';
    }
    // verificar que la labor tiene vacantes
    if ( labor.numVacancies < 1 ) {
      console.log( 'no hay vacantess' )
      throw 'Esta oferta ya no tiene vacantes';
    }
    
    // agregar al arreglo de aplicantes
    console.log( 'labor ', labor.applicants )
    labor.applicants.push( userd.id );
    console.log( 'labor ', labor.applicants )
    //res.status(200).send( { message: 'Has aplicado correctamente', labor } ) 
  } catch (error) {
    res.status( 500 ).send( { code: 500, message: error , error: 'No se ha podido actualizar la labor' } );
  }
} 

// Comentar una labor
exports.comentLabor = async ( req, res ) =>{
  console.log( 'comentLabor...' );
} 
//calificar employer
exports.qualifyEmployer = async ( req, res ) =>{
  console.log( 'qualifyEmployer...' );
} 

// retirarse como aplicante de una labor
exports.retireAplication = async ( req, res ) =>{
  console.log( 'retireAplication....' );
} 