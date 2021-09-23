'use strict'
var Feedbackrent = require('../models/feedbackrent');
var CardRent = require('../models/cardrent');

var controller = {
	getFeeds:(req,res) => {
		Feedbackrent.find({},function(err,feeds) {
			if(err) return res.status(200).send({message: "Hubo un error obteniendo valoraciones"})
			if(!feeds) return res.status(200).send({message : "No existen valoraciones"})
				console.log(feeds)
			return res.status(200).send({
				feedbacks:feeds
			})
		})

	},
	saveFeed:(req,res) => {		
		var params=req.body;
		if(!params || !params.nick || !params.email || !params.text){
			return res.status(200).send({message:"Faltan datos"})
		}
		let feed = new Feedbackrent();
		feed.nick = params.nick;
		feed.email = params.email;
		feed.text = params.text;
		feed.feedback = params.feedback;
		feed.rentId=params.rentId

		feed.save((err,feedStored) => {
			if(err) return res.status(500).send({message: "No se ha podido almacenar el feedback"})			
		//realizar media de feedback general en cardrent		
	//podríamos ahorrarnos este método y asignar un nuevo campo al cardrent con el largo de feedbacks y tan solo 
	//sumariamos 1 a ese campo y junto al campo numLevelFeedback(existente) podríamos calcular la media; estos 2 campos habría
	//que pasarlos en los params pk sino habría que llamar 2 veces al modelo CardRent y al final no habríamos ahorrado nada.
			Feedbackrent.find({rentId:params.rentId},(err,feeds) => {				
				if(err) return res.status(200).send({message: "Error al obtener las valoraciones"})
			//obtenemos la cantidad de feedbacks y otenemos la suma de todas las valoraciones
				let countFeeds=feeds.length;
				
				let sum=0;
				feeds.map((f)=> {
					let value=0;
					if(f.feedback>0 && f.feedback<6)
						value=f.feedback;
					sum=sum+value;
				})
				
			//calculamos la media general del alojamiento
				let generalFeedback=Math.round(sum / countFeeds);
				CardRent.findByIdAndUpdate(params.rentId,{numLevelFeedback:generalFeedback},(err,cardrent) => {
					if(err) return res.status(500).send({message: "Hubo un error al actualizar el feedback general"})
					return res.status(200).send({message: "llega al saveFeed"})	
				})
			})
		})
	},
	getFeedsByRentId:(req,res) => {
		let id;
		if(req.params && req.params.id){
			id=req.params.id;
		}
		Feedbackrent.find({rentId:id},(err,feeds) => {
			if(err) return res.status(200).send({message: "Error al obtener las valoraciones"})
			if(!feeds) return res.status(404).send({message: "No existen valoraciones"})
			return res.status(200).send({
				feedbacks:feeds
			})	
		})
	},
	deleteFeeds:(req,res) =>{
		Feedbackrent.deleteMany({},(err,feeds) => {
			if(err) return res.status(500).send({message: "No se pudiero eliminar los feedback"})
			if(!feeds) return res.status(404).send({message: "No se han encontrados registros"})
			return res.status(200).send({message: "Todos los registros de feedback han sido eliminados"})
		})
	},



}

module.exports = controller;