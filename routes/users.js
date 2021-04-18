const express = require( 'express' );
// controller
const UserController = require( '../controllers/usersController' );
// midllewares
const md_images = require( '../middleware/images' );
const md_auth = require( '../middleware/authenticated' );
// validation
const { check } = require( 'express-validator' );
const api =  express.Router();

api.post( "/sign-up",
  [
    check( 'name', 'El nombre es obligatorio' ).notEmpty(),
    check( 'lastname', 'El apellido es obligatorio' ).notEmpty(),
    check( 'email', 'Agrega un email válido' ).isEmail(),
    check( 'password', 'El password debe ser de al menos 6 caracteres' ).isLength({ min : 6 }),
  ],
  UserController.signUp 
);

api.post( "/sign-in",
  UserController.signIn 
);

api.put( "/update-user/:id",
  [ md_auth.ensureAuth ],
   UserController.updateUser 
);

api.put( "/activate-user/:id",
  [ md_auth.ensureAuth ], 
  UserController.activateUser 
);

api.delete( "/delete-user/:id",
  [ md_auth.ensureAuth ], 
  UserController.deleteUser 
);

api.put( "/upload-avatar",
  [ md_auth.ensureAuth, md_images.imageExist ], 
  UserController.uploadAvatar 
);
// to do Obtener usuarios ...


api.get( "/get-avatar/:avatar",
  [ md_auth.ensureAuth ],
  UserController.getAvatar 
);

module.exports= api;