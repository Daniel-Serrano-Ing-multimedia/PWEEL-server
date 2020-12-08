const express = require( 'express' );
const UserController = require( '../controllers/users' );

const multiparty = require ( 'connect-multiparty' );
const md_auth = require( '../middleware/authenticated' );
const md_upload_avatar = multiparty( {uploadDir: "./uploads/avatar"} );

const api =  express.Router();

api.post( "/sign-up", UserController.signUp );
api.post( "/sign-in", UserController.signIn );
api.put( "/update-user/:id", [ md_auth.ensureAuth ], UserController.updateUser );
api.delete( "/delete-user/:id", [ md_auth.ensureAuth ], UserController.deleteUser );
module.exports= api;