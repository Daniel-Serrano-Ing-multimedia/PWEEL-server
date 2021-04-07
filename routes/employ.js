const express = require( 'express' );
// controller
const EmployController = require( '../controllers/employController' );
// midllewares
const md_auth = require( '../middleware/authenticated' );
const md_labor = require( '../middleware/laborExist' );
// api
const api =  express.Router();
// obtener labores recomendadas
api.put( "/get-recomended-labors",
  [ md_auth.ensureAuth, md_labor.laborExist ],
  EmployController.getRecomendedLabors 
);
// Aplicar a una labor
api.put( "/aply-labor/:laborID",
  [ md_auth.ensureAuth, md_labor.laborExist ],
  EmployController.aplyLabor 
);

// Comentar una labor
api.put( "/comment-labor/:laborID",
  [ md_auth.ensureAuth, md_labor.laborExist ],
  EmployController.comentLabor 
);

//calificar employer
api.put( "/qualify-employer/:employerID",
  [ md_auth.ensureAuth ],
  EmployController.qualifyEmployer 
);

// retirarse como aplicante de una labor
api.put( "/qualify-employer/:laborID",
  [ md_auth.ensureAuth, md_labor.laborExist ],
  EmployController.qualifyEmployer 
);

module.exports= api;