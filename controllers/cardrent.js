"use strict"
var CardRent = require('../models/cardrent');
var PriceRent=require('../models/pricerent');
var Image = require("../models/image");
var path = require("path");
var controller = {
	hola:(req,res) => {
		
		return res.status(200).send({message: "hola"})
	},
	saveCardRent:(req,res) => {		
		var params = req.body;
		//el boolean req._body permite saber si existe objecto body (de bodyParser)
		if(req._body){
			console.log(req._body)	
		}
		
		if(!params || !params.title || !params.capacity || !params.type || !params.phone) 
			return res.status(200).send({message: "Faltan datos",status:"error"});
		var cardrent = new CardRent();
		

		//console.log("el array: ",typeof(params.capacity))
		cardrent.title=params.title;
		if(params.title){
			//validar string
			let data=checkString(params.title);			
		}
		//para las pruebas en postman generar un array mediante repetición del parámetro
		if(Array.isArray(params.capacity)){			
			cardrent.capacity=params.capacity;
		}
		//pricerent.minNight = params.capacity[0];
		/*
		params.pricerents.maps((num)=> {
			var pricerent=new PriceRent();
			pricerent.capacity=params.capacity;
			if(params.type.length==1){
				pricerent.type=params.type;	
			}else{

			}
			
			//pricerent.minNight=
		})
		*/
		console.log("params:",params);
		
			cardrent.minPrice=null;
			cardrent.minNights=null;
			cardrent.minCapacity=null;		
		cardrent.logo=null;
		cardrent.image=null;
		cardrent.images = null;
		cardrent.thumbnail=null;
		if(Array.isArray(params.type)){
			cardrent.type=params.type;
		}
		cardrent.services=params.services;
		cardrent.web=params.web;
		cardrent.phone=params.phone;
			cardrent.numLevelFeedback=null;
		cardrent.numLevelLocation=0;
		cardrent.maps=params.maps;
		cardrent.text=params.text
		cardrent.save((err,cardrentStored)=> {
			if(err) return res.status({message: "Error al crear cardrent"})
			if(!cardrent) return res.status(200).send({message: "No se ha podido crear cardrent"})
				
			if(cardrentStored){
				let data=params.capacities;
				data.map((cap)=> {
					var pricerent=new PriceRent();					
					pricerent.capacity=cap.capacity;
					pricerent.type=cap.subtype;
					pricerent.minNights=cap.minNights;
					pricerent.priceBase=cap.priceBase;
					pricerent.priceNight=cap.priceNight;
					pricerent.rentId=cardrentStored._id;
					pricerent.save((err,pricerentStored) => {
						if(err) return res.status(200).send({message: "error con tarifas"})
						if(!pricerentStored) return res.status(200).send({message: "No existe"})
							return res.status(200).send({message: "cardrent creado",id:cardrentStored._id})
					})
				})

				/*cardrent.capacities.map((cap)=>{
					
					pricerent.save((err,pricerentStored) => {
						if(err) return res.status(200).send({message: "error con tarifas"})
						if(!pricerentStored) return res.status(200).send({message: "No existe"})
							return res.status(200).send({message: "cardrent creado"})
					})
					
				})
				
				
				

			}
			*/
			}
			//console.log("cardrent: ",data.length)
			console.log("params: ",params)
			
		})
		

	},
	getCard:(req,res) => {

		

	},
	getCards:(req,res) => {
		CardRent.find({},function(err,cardrents){
			if(err) return res.status(200).send({message: "Error al recuperar alojamientos"});
			if(!cardrents) return res.status(200).send({message: "No existe ninguna"})
			return res.status(200).send({message: cardrents})

		});
	},
	uploadImages:(req,res) => {
		console.log("files: ",req.files);
		
		
		let id;
		let files=[];
		let message="",warningSize="",warningType;

		if(req.params && req.params.id){
			id=req.params.id;
		}else{
			//mensaje de error
			//Si no existe id no es posible asignar la imagen
		}

		req.files.forEach((file) => {
			let splitname=path.basename(file.originalname).split('\.');
			//extension
			let ext = splitname[1];
			let type= file.mimetype;

	//1048576=1 MB (bytes/megabyte)
			if(type == "image/jpeg" || type=="image/png" || type=="image/gif"){
				if(file.size < (1048576 * 2)){
					let image = new Image();
					image.name=file.filename;
					image.originalName=file.originalname;					
					image.path=file.destination;
					image.ext=ext;
					image.size=file.size;
					image.type=type;
					image.rentId=id;

					image.save((err,imageStored) => {
						if(err) return res.status(500).send({message: "Error al guardar imagen"})						
					})

				}else{
					//establecemos mensaje				
					warningSize="Alguna de las imágenes no ha sido incluida, es superior a 2MB";
					//eliminamos imagen (síncrono)
					controller.removeUploadedFile(file.path+file.originalname);
				}
				
			}else{
				//establecemos mensaje				
				warningType="Alguna de las imágenes no ha sido incluida, no es una imagen válida";
				//eliminamos imagen (síncrono)
				controller.removeUploadedFile(file.path+file.originalname);
			}
			
			
		})	
		
		if(req.files.length == 1)
			message="La imagen ha sido guardada";			
		else
			message="Las imágenes han sido guardadas";
		//return res.status(200).send({message: message});
		return res.status(200).send({message: message});
	},
	removeUploadedFile:function(file_path){
		fs.unlinkSync(file_path);
	}
	

	
}

function checkString(value){
	return typeof value === 'string' || value instanceof String;
}

module.exports = controller;