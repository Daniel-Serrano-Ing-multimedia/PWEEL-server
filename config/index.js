require('dotenv').config ({ path : 'variables.env' });
const cloudinary = require('cloudinary').v2;
const API_NAME    = "pweel-api";
const API_VERSION = "v1";
//
const CLUSTER_USER      = process.env.CLUSTER_USER;
const CLUSTER_PASSWORD  = process.env.CLUSTER_PASSWORD;
const CLUSTER_DATA_BASE = process.env.CLUSTER_DATA_BASE;
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
  CLUSTER_USER,
  CLUSTER_PASSWORD,
  CLUSTER_DATA_BASE,
  SECRET_KEY,
  cloudinaryConfig 
};



