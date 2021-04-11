require('dotenv').config ({ path : 'variables.env' });
const cloudinary = require('cloudinary').v2;
const API_NAME    = "pweel-api";
const API_VERSION = "v1";
const IP_SERVER   = "localhost";
const PORT_DB     = 27017;
//
const CLUSTER_USER      = "Daniel";
const CLUSTER_PASSWORD  = "daniel1234";
const CLUSTER_DATA_BASE = "PWEELDB";
//
const SECRET_KEY = 'gr7HTYU182d56dSAFd54try568821';

const cloudinaryConfig = { 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
};

module.exports = {
  API_NAME,
  API_VERSION,
  IP_SERVER,
  PORT_DB,
  CLUSTER_USER,
  CLUSTER_PASSWORD,
  CLUSTER_DATA_BASE,
  SECRET_KEY,
  cloudinaryConfig 
};



