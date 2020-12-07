const express = require( 'express' );
const UserController = require( '../controllers/users' );

const multiparty = require ( 'connect-multiparty' );
const md_auth = require( '../middleware/authenticated' );
const md_upload_avatar = multiparty( {uploadDir: "./uploads/avatar"} );

const api =  express.Router();

api.post( "/sign-up", UserController.signUp );
api.post( "/sign-in", UserController.signIn );
api.put( "/update-user", [ md_auth.ensureAuth ], UserController.updateUser );

module.exports= api;