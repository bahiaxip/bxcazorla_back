"use strict"

const express = require("express");
var bodyParser = require("body-parser");
var app = express();

var cardrent_routes = require('./routes/cardrent');
var feedbackrent_routes = require('./routes/feedbackrent');
var pricerent_routes = require('./routes/pricerent');
var user_routes = require('./routes/user')

app.use((req,res,next) =>{
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers", "Authorization, X-API-KEY, Origin, X-Requested-With,Content-Type,Accept,Access-Control-Allow-Request-Method");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE");
  res.header("Allow","GET,POST,OPTIONS,PUT,DELETE");
  next();
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//para mostrar imagen: añadir la ruta: http://localhost:[port]/[directorio]/imagen
//ejemplo para este proyecto: http://localhost:3900/images/37ig9aia2dic9.jpg
app.use("/images",express.static('uploads',{redirect: false}));

app.use('/',cardrent_routes);
app.use('/',feedbackrent_routes);
app.use('/',pricerent_routes);
app.use('/',user_routes);
//app.listen(3000);
//console.log("La app está escuchando el puerto 3000");

module.exports = app;