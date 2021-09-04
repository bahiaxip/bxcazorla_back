"use strict"

var mongoose = require("mongoose");
var app = require("./app");
var port = 3900;

mongoose.connect("mongodb://localhost:27017/bxcazorla")
	.then(()=> {
		console.log("conexión correcta");

		app.listen(port,()=> {
			console.log("Servidor corriendo en puerto: ",port)
		})
	})