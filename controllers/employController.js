// models
const Labor = require( '../models/labors' ); 
const User = require('../models/users');
//
const moment = require ('moment');
const { findOneAndUpdate } = require('../models/labors');
const { urlencoded } = require('body-parser');

// obtener labores recomendadas
// **  Para simular recomendaciones se enviaran las 10 labors de lo employers mejor punteados **
exports.getRecomendedLabors = async ( req, res ) =>{
  console.log( 'getRecomendedLabors...' );
} 

// Aplicar a una labor
exports.aplyLabor = async ( req, res ) =>{
  const  { labor, user } = req
  try {
    // verificar que la labor existe
    //- done -  desde middelawre
    // *******************************************************************
    // ********************  Verificaciones ******************************
    // *******************************************************************
    // verificar que la labor no pertenece al usuario
    if( user.id == labor.employer ) throw 'No puedes aplicar a tu propia oferta';
    // verificar que la labor esta disponible
    if ( !labor.aviable ) throw 'Esta oferta no esta disponoble';
    // verificar que la labor tiene vacantes
    if ( labor.numVacancies < 1 )  throw 'Esta oferta ya no tiene vacantes';
    // verificar qwue el usuario no haya aplicado a esta labor
    if ( labor.applicants.includes( user.id ) ) throw 'Ya has aplicado a esta oferta';
    // *******************************************************************
    // ************** agregar al arreglo de aplicantes *******************
    // *******************************************************************
    labor.applicants.push( user.id );
    const laborUpdated = await Labor.findByIdAndUpdate( labor.id, labor );
    // verificar que haya actualizado en la base de datos
    if ( !laborUpdated ) throw 'No se ha podido actualizar la labor';
    res.status(200).send( { message: 'Has aplicado correctamente', laborUpdated } ) 
  } catch (error) {
    res.status( 500 ).send( { code: 500, message: error , error: 'No se ha podido actualizar la labor' } );
  }
} 

// Comentar una labor
exports.comentLabor = async ( req, res ) =>{
  const  { labor, user } = req;
  const  { coment } = req.body;
  // construir comentario
  const comentario = {
    user : user.id,
    body : coment,
    date : Date.now()
  }
  console.log( ' ids ', user.id, labor );
  try {
    // verificar que la labor existe
    //- done -  desde middelawre
    // *******************************************************************
    // ********************  Verificaciones ******************************
    // *******************************************************************
    // verificar que exista un comentario
    if( !coment ) throw 'No se ha enviado ningun comentario';
    // verificar que el ususrio es/fue un empleado de esta labor   
    if( !labor.employees.includes( user.id ) ) throw 'Solo los empleados a esta labor pueden comentar';
    // verificar que la labor ha concluido
    if ( !labor.finished ) throw 'Solo puedes comentar si esta oferta ya ha finalizo';
    // *******************************************************************
    // ************** agregar al arreglo de comentarios ******************
    // *******************************************************************
    labor.coments.push( comentario );
    const laborUpdated = await Labor.findByIdAndUpdate( labor.id, labor );
    // verificar que haya actualizado en la base de datos
    if ( !laborUpdated ) throw 'No se ha podido enviar el comentario';
    // comentario a devolver
    comentUpload = laborUpdated.coments.find( coment => coment.user == user.id  );
    res.status(200).send( { message: 'El comentario se guardo correctamente', comentUpload } ); 
  } catch (error) {
    res.status( 500 ).send( { code: 500, message: error , error: 'No se ha podido enviar el comentario' } );
  }
} 
//calificar employer
exports.qualifyEmployer = async ( req, res ) =>{
  const  { labor, user } = req;
  const  { score } = req.body;
  try {
    //- done -  desde middelawre
    // *******************************************************************
    // ********************  Verificaciones ******************************
    // *******************************************************************
    // verificar que exista un score
    if( !score ) throw 'No se ha enviado ninguna calificacion';
    //verificar que el score este entre 0 y 10
    if ( score < 0 || score > 10 ) throw 'El score debe ser un valor entre 0 y 10';
    // verificar que el ususrio es/fue un empleado de esta labor   
    if( !labor.employees.includes( user.id ) ) throw 'Solo los empleados a esta labor pueden calificar al empleador';
    // verificar que la labor ha concluido
    if ( !labor.finished ) throw 'Solo puedes calificar al empleador si la oferta ya ha finalizo'; 
    // ********************************************************************
    // ****************  actualizar emloyer con el score ******************
    // ********************************************************************
    // traer avlores antiguos
    const oldUser =  await User.findOne({ _id: labor.employer });
    if( !oldUser ) throw 'Error en la base de datos';
    let  { numVotes, value } = oldUser.employerScore;
    // crear objeto con valores nuevos
    numVotes++;
    const newEmployScore = {
      value :( ( numVotes -1 ) * value + score )  / numVotes,
      numVotes
    }
    const userUpdated = await User.findByIdAndUpdate( labor.employer, { employerScore : newEmployScore });
    // verificar que haya actualizado en la base de datos
    if ( !userUpdated ) throw 'No se ha podido calificar';
    // objeto aa devolve a devolver
    res.status(200).send( { message: 'La calificación se realizo correctamente', newEmployScore } ); 
  } catch (error) {
    res.status( 500 ).send( { code: 500, message: error , error: 'No se ha podido calificar' } );
  }
} 

// retirarse como aplicante de una labor
exports.retireAplication = async ( req, res ) =>{
  let  { labor, user } = req
  try {
    // verificar que la labor existe
    //- done -  desde middelawre
    // *******************************************************************
    // ********************  Verificaciones ******************************
    // *******************************************************************
    // verificar qwue el usuario haya aplicado a esta labor
    if ( !labor.applicants.includes( user.id ) ) throw 'No has aplicado a esta oferta';
    // *******************************************************************
    // ************** retirar del arreglo de aplicantes ******************
    // *******************************************************************
    // retirar del array
    console.log( ' ddd : ', labor.applicants, user.id )
    labor.applicants = labor.applicants.filter( value => value != user.id );
    console.log( 'retireAplication....', labor.aplicants );
    const laborUpdated = await Labor.findByIdAndUpdate( labor.id, labor );
    // verificar que haya actualizado en la base de datos
    if ( !laborUpdated ) throw 'No se ha podido actualizar la labor';
    res.status(200).send( { code : 200, message: 'Ya no estas aplicando a la labor', aplicants : laborUpdated.aplicants } ) 
  } catch (error) {
    res.status( 500 ).send( { code: 500, message: error , error: 'No se ha podido actualizar la labor' } );
  }
} 