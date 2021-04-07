const Labor = require('../models/labors');
exports.laborExist = async ( req, res, next ) => {
  console.log( 'Labor Exist' );
  if( !req.params.laborID ){
      return res.status(403).send( { message: "No hay parametro para obtener labor" } );
  }

  try{
    const { laborID } = req.params;
      const labor = await Labor.findById( laborID ) ;
      if ( !labor ){
          return res.status(404).send({ messange: "Esta oferta ya no existe" });
      }
      req.labor = labor ;
      next();
  }catch( error ){
      return res.status(404).send({ message: 'Esta labor ya no existe.' });
  }
}