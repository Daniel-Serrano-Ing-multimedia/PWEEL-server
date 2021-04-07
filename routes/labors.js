const express = require( 'express' );
const LaborController = require( '../controllers/laborsController' );
const md_auth = require( '../middleware/authenticated' );

const api =  express.Router();

api.post( '/create-labor/:user_id', 
  [ md_auth.ensureAuth ], LaborController.createLabor 
);

api.put( '/update-labor/:labor_id',
  [ md_auth.ensureAuth ], LaborController.updateLabor 
 );

api.get( '/get-labor', 
LaborController.getLabor 
);

api.get( '/get-labors', 
  LaborController.getLabors 
);

api.delete( '/delete-labor/:id', 
  [ md_auth.ensureAuth ], LaborController.deleteLabor 
);

module.exports= api;