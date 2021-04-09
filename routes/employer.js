const express = require( 'express' );
// controller
const EmployerController = require( '../controllers/employerController' );
// midllewares
const md_auth = require( '../middleware/authenticated' );
const md_labor = require( '../middleware/laborExist' );
// validation
const { check } = require( 'express-validator' );
// api
const api =  express.Router();

// Obtener aplicantes a una labor
api.get( '/get-aplicants/:laborID', 
  [ md_auth.ensureAuth, md_labor.laborExist ],  
  EmployerController.getAplicants
);
// Obtener aceptados para una labor
api.get( '/get-employees/:laborID', 
  [ md_auth.ensureAuth, md_labor.laborExist ],   
  EmployerController.getEmployees
);
// Aceptar un aplicante en la labor
api.put( '/acept-aplicant/:laborID', 
  [ 
    md_auth.ensureAuth, 
    md_labor.laborExist,
    check( 'aplicant', 'El aplicante es requerido' ).notEmpty()
  ],  
  EmployerController.aceptAplicant
);
// Retirar un empleado de la labor
api.put( '/retire-employee/:laborID', 
  [ 
    md_auth.ensureAuth, 
    md_labor.laborExist,
    check( 'employee', 'El empleado es requerido' ).notEmpty()
  ], 
  EmployerController.retireAplicant
);
// activar desactivar una labor
api.put( '/enable-labor/:laborID', 
  [ 
    md_auth.ensureAuth, 
    md_labor.laborExist,
    check( 'enable', 'El nuevo estado es necesario' ).notEmpty()
  ], 
  EmployerController.setActiveLAbor
);
// finalizar labor
api.put( '/finish-labor/:laborID', 
  [ 
    md_auth.ensureAuth, 
    md_labor.laborExist,
    check( 'finish', 'El nuevo estado es necesario' ).notEmpty()
  ],   
  EmployerController.finishdLabor
);


module.exports= api;