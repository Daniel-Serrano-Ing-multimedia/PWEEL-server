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
api.put( "/coment-labor/:laborID",
  [ md_auth.ensureAuth, md_labor.laborExist ],
  EmployController.comentLabor 
);

//calificar employer
api.put( "/qualify-employer/:laborID",
  [ md_auth.ensureAuth, md_labor.laborExist ],
  EmployController.qualifyEmployer 
);

// retirarse como aplicante de una labor
api.put( "/quit-aply-labor/:laborID",
  [ md_auth.ensureAuth, md_labor.laborExist ],
  EmployController.retireAplication 
);

module.exports= api;