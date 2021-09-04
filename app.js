"use strict"

const express = require("express");

var app = express();

var cardrent_routes = require('./routes/cardrent');
var feedbackrent_routes = require('./routes/feedbackrent');
var pricerent_routes = require('./routes/pricerent');
var user_routes = require('./routes/user')
app.use('/',cardrent_routes);
app.use('/',feedbackrent_routes);
app.use('/',pricerent_routes);
app.use('/',user_routes);
//app.listen(3000);
//console.log("La app está escuchando el puerto 3000");

module.exports = app;