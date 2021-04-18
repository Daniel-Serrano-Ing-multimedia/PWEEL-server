const express = require ('express');
const conetcarDB = require('./config/db');
const cors = require('cors');
//config
const { API_NAME, API_VERSION } = require("./config");
// routes
const usersRoutes = require( './routes/users' );
const authRoutes = require( './routes/auth' );
const laborsRoutes = require( './routes/labors' );
const employRoutes = require( './routes/employ' );
const employerRoutes = require( './routes/employer' );
// crear el servidor
const app = express();
//conectar a la base de datos
conetcarDB();
// habilitar Cors
console.log ( 'FrontEnd : ', process.env.FRONTEND_URL )
const opcionesCors = {
  origin: process.env.FRONTEND_URL
}
app.use( cors( opcionesCors ) );
// puerto de la app
const port = process.env.PORT || 3977;
// habilitar leer valores de un body
app.use( express.json() );
// habilitar carpeta publica
app.use( express.static( 'uploads' ) );
// rutas app
app.use( `/${ API_NAME }/${ API_VERSION }`, usersRoutes );
app.use( `/${ API_NAME }/${ API_VERSION }`, authRoutes );
app.use( `/${ API_NAME }/${ API_VERSION }`, laborsRoutes );
app.use( `/${ API_NAME }/${ API_VERSION }`, employRoutes );
app.use( `/${ API_NAME }/${ API_VERSION }`, employerRoutes );
// Arrancar la app
app.listen(port, '0.0.0.0', () => {
  console.log( `El servidor esta funcionando en el puerto ${ port }` );
}  )