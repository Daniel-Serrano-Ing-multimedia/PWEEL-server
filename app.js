const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const { API_VERSION } = require("./config");

//load routings
const usersRoutes = require( './routes/users' );
const authRoutes = require( './routes/auth' );
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
app.use( `/api/${ API_VERSION }`, usersRoutes );
app.use( `/api/${ API_VERSION }`, authRoutes );
//...

module.exports = app;
