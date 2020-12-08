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
api.put( "/upload-avatar/:id", [ md_auth.ensureAuth, md_upload_avatar ], UserController.uploadAvatar );
api.put( "/activate-user/:id", [ md_auth.ensureAuth ], UserController.activateUser );
api.get( "/get-avatar/:avatarName", UserController.getAvatar );

module.exports= api;