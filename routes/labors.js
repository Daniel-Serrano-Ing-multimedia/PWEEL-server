const express = require( 'express' );
const LaborController = require( '../controllers/laborsController' );
const md_auth = require( '../middleware/authenticated' );

const api =  express.Router();
// crear labor
api.post( '/create-labor/:user_id', 
	[ md_auth.ensureAuth ], 
	LaborController.createLabor 
);

// actualizar labor
api.put( '/update-labor/:labor_id',
	[ md_auth.ensureAuth ],
	LaborController.updateLabor 
);

// obtener labor
api.get( '/get-labor/:id', 
	LaborController.getLabor 
);

// obtener labores
api.get( '/get-labors', 
	LaborController.getLabors 	
);

// crear labor
api.delete( '/delete-labor/:id', 
  [ md_auth.ensureAuth ], 
	LaborController.deleteLabor 
);

module.exports= api;