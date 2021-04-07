const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const { API_NAME, API_VERSION } = require("./config");

//load routings
const usersRoutes = require( './routes/users' );
const authRoutes = require( './routes/auth' );
const laborsRoutes = require( './routes/labors' );
const employRoutes = require( './routes/employ' );
//....

app.use( bodyParser.urlencoded( {extended: false} ) );
app.use( bodyParser.json()) ;


//configure Header HTTP
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});
//....
// Router Basic
app.use( `/${ API_NAME }/${ API_VERSION }`, usersRoutes );
app.use( `/${ API_NAME }/${ API_VERSION }`, authRoutes );
app.use( `/${ API_NAME }/${ API_VERSION }`, laborsRoutes );
app.use( `/${ API_NAME }/${ API_VERSION }`, employRoutes );
//...

module.exports = app;
