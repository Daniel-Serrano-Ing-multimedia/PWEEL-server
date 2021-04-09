// models
const Labor = require( '../models/labors' ); 
const User = require('../models/users');
//validaciones
const { validationResult } = require( 'express-validator' );
//
const moment = require ('moment');
const { findOneAndUpdate } = require('../models/labors');
const { urlencoded } = require('body-parser');

// Obtener aplicantes a una labor
exports. getAplicants = async ( req, res, next ) => {
  const  { labor, user } = req;
  try {
    // usuario y labor obtenidos desde middlewares
    // *******************************************************************
    // ********************  Verificaciones ******************************
    // *******************************************************************
    // verificar que la labor pertenece al usuario
    if( user.id != labor.employer ) throw 'Solo puedes ver aplicantes a tus labores';
    // verificar que hayan aplicantes
    if ( labor.aplicants.length < 1 ) throw 'No hay aplicantes para esta labor';
    // verificar que la labor esta habilitada
    if ( !labor.aplicants.aviable ) throw 'La labor no esta habilitada';     
    // *******************************************************************
    // ************** regresar el arreglo de aplicantes ******************
    // *******************************************************************
    res.status( 200 ).send( { code: 200, aplicants: labor.aplicants } );
  } catch (error) {
    res.status( 500 ).send( { code: 500, message: error , error: 'No se han podido obtener aplicantes' } );
  }
}

// Obtener aceptados para una labor
exports. getEmployees = async ( req, res, next ) => {
  const  { labor, user } = req;
  try {
    // usuario y labor obtenidos desde middlewares
    // *******************************************************************
    // ********************  Verificaciones ******************************
    // *******************************************************************
    // verificar que la labor pertenece al usuario
    if( user.id != labor.employer ) throw 'Solo puedes ver empleados de tus labores';
    // verificar que hayan aplicantes
    if ( labor.employees.length < 1 ) throw 'Aun no hay empleados para esta labor';
    // verificar que la labor esta habilitada
    if ( !labor.aplicants.aviable ) throw 'La labor no esta habilitada';       
    // *******************************************************************
    // ************** regresar el arreglo de aplicantes ******************
    // *******************************************************************
    res.status( 200 ).send( { code: 200, employees: labor.employees } );
  } catch (error) {
    res.status( 500 ).send( { code: 500, message: error , error: 'No se han podido obtener empleados' } );
  }
}

// Aceptar un aplicante en la labor
exports. aceptAplicant = async ( req, res, next ) => {
  // usuario y labor obtenidos desde middlewares
  let  { labor, user } = req;
  try {
    // *******************************************************************
    // ********************  Verificaciones ******************************
    // *******************************************************************
    // verificasr aplicante
    const errors = validationResult( req );
    if ( !errors.isEmpty() ) return  res.status( 400 ).json({ errores : errors.array() });
    // verificar que la labor pertenece al usuario
    if( user.id != labor.employer ) throw 'Solo puedes aceptar empleados a tus labores';
    // verificar que la labor esta habilitada
    if ( !labor.aplicants.aviable ) throw 'NLa labor no esta habilitada';   
    // verificar que el aplicante este en la lista de labor
    const  { aplicant } = req.body;
    if ( !labor.aplicants.includes( aplicant ) ) throw 'Este usuario no ha aplicado a esta labor';
    // *******************************************************************
    // *********** pasar aplicante a arreglo de employees ****************
    // *******************************************************************
    // agregar a employees
    labor.employees.push( aplicant );
    // eliminar de aplicants
    labor.aplicants = labor.aplicants.filter( value => value != aplicant );
    // actualizar labor
    const updatedLabor = await Labor.findByIdAndUpdate( labor.id, labor,{ new :true });
    const aceptedAplicant = await User.findById( aplicant );
    res.status( 200 ).send( { code: 200, employees: updatedLabor.employees, aceptedAplicant } );
  } catch (error) {
    res.status( 500 ).send( { code: 500, message: error , error: 'No se ha podido aceptar aplicante' } );
  }
}

// Retirar un empleado de la labor
exports. retireAplicant = async ( req, res, next ) => {
  // usuario y labor obtenidos desde middlewares
  let  { labor, user } = req;
  try {
    // *******************************************************************
    // ********************  Verificaciones ******************************
    // *******************************************************************
    // verificasr aplicante
    const errors = validationResult( req );
    if ( !errors.isEmpty() ) return  res.status( 400 ).json({ errores : errors.array() });
    // verificar que la labor pertenece al usuario
    if( user.id != labor.employer ) throw 'Solo puedes aceptar empleados a tus labores';
    // verificar que el empleado este en la lista de employees
    const  { employee } = req.body;
    if ( !labor.employees.includes( employee ) ) throw 'Este usuario no es empleado de esta labor';
    // *******************************************************************
    // **************** retirar empleado de employees ********************
    // *******************************************************************
    // eliminar de employees
    labor.employees = labor.employees.filter( value => value != employee );
    // agregar a aplicants
    labor.aplicants.push( employee );
    // actualizar labor
    const updatedLabor = await Labor.findByIdAndUpdate( labor.id, labor,{ new :true });
    const retiredEmployee = await User.findById( employee );
    res.status( 200 ).send( { code: 200, employees: updatedLabor.employees, retiredEmployee } );
  } catch (error) {
    res.status( 500 ).send( { code: 500, message: error , error: 'No se ha podido retirar empleado' } );
  }
}

// activar desactivar una labor
exports. setActiveLAbor = async ( req, res, next ) => {
  let  { labor, user } = req;
  const { enable } = req.body;
  try {
    // usuario y labor obtenidos desde middlewares
    // *******************************************************************
    // ********************  Verificaciones ******************************
    // *******************************************************************
    const errors = validationResult( req );
    if ( !errors.isEmpty() ) return  res.status( 400 ).json({ errores : errors.array() });
    // verificar que la labor pertenece al usuario
    if( user.id != labor.employer ) throw enable? 'Solo puedes habiilitar tus labores' :  'Solo puedes deshabiilitar tus labores';    
    // *******************************************************************
    // ******************** Habilitar labor ******************************
    // *******************************************************************
    labor.aviable = enable;
    const updatedLabor = await Labor.findByIdAndUpdate( labor.id, labor,{ new :true });
    res.status( 200 ).send( { code: 200, updatedLabor,  aviable: enable , } );
  } catch (error) {
    res.status( 500 ).send( { code: 500, message: error , error: enable? 'No se ha podido habilitar labor' : 'No se ha podido deshabilitar labor' } );
  }
}

// finalizar labor
exports. finishdLabor = async ( req, res, next ) => {
  let  { labor, user } = req;
  const { finish } = req.body;
  try {
    // usuario y labor obtenidos desde middlewares
    // *******************************************************************
    // ********************  Verificaciones ******************************
    // *******************************************************************
    const errors = validationResult( req );
    if ( !errors.isEmpty() ) return  res.status( 400 ).json({ errores : errors.array() });
    // verificar que la labor pertenece al usuario
    if( user.id != labor.employer ) throw finish? 'Solo puedes finalizar tus labores' :  'Solo puedes configurar como en curso tus labores';     
    // *******************************************************************
    // ******************** Habilitar labor ******************************
    // *******************************************************************
    labor.finished = finish;
    const updatedLabor = await Labor.findByIdAndUpdate( labor.id, labor,{ new :true });
    res.status( 200 ).send( { code: 200, updatedLabor,  finished: finish , } );
  } catch (error) {
    res.status( 500 ).send( { code: 500, message: error , error: finish? 'No se ha podido finalizar labor' : 'No se ha podido configurar labor como en curso...' } );
  }
}