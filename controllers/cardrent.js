"use strict"


var controller = {
	hola:(req,res) => {
		
		return res.status(200).send({message: "hola"})
	},
	saveCard:(req,res) => {

	},
	getCard:(req,res) => {

	},
	getCards:(req,res) => {

	}
	
}

module.exports = controller;