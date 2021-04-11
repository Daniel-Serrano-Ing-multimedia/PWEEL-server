const express = require( 'express' );
// controller
const UserController = require( '../controllers/usersController' );
// midllewares
const md_images = require( '../middleware/images' );
const md_auth = require( '../middleware/authenticated' );

const api =  express.Router();

api.post( "/sign-up",
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