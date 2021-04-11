// subida de archivos
const multer = require('multer');

exports.imageExist = async ( req, res, next ) => {
  // configurar multer
  const storage = multer.memoryStorage()
  const confMulter ={ 
    limits : { fileSize : 1024*1024 * 10 },
    storage: storage // guarda en la memoria mas no en el seervidor
  }
  try {
    //*********************************************************
    //*************  Guardar imagen en memoria ****************
    //*********************************************************
    const upload = multer( confMulter ).single('imagen');
    upload( req, res, async (error) => {
      // verificar que la imagen esta ewn memoria
      if( error || !req.file ) {
        return res.status(400).send({  error: error || 'No hay archivo para enviar' });
      }
      next() ;
    } );
  } catch (error) {
    return res.status(500).send({ message : 'No se ha podido subir la imagen' ,error });
  }
  

}